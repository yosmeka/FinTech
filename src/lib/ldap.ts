import { createClient } from 'ldapjs'
import type { Client } from 'ldapjs'

interface LDAPConfig {
  url: string
  baseDN: string
  userAttribute: string
  bindDN?: string
  bindPassword?: string
  starttls: boolean
}

interface LDAPAuthResult {
  success: boolean
  message: string
  user?: {
    username: string
    email: string
    name: string
    distinguishedName: string
  }
}

/**
 * Get LDAP configuration from environment variables
 */
export function getLDAPConfig(): LDAPConfig {
  const url = process.env.LDAP_URL
  const baseDN = process.env.LDAP_BASE_DN
  const userAttribute = process.env.LDAP_USER_ATTRIBUTE || 'mail'
  const bindDN = process.env.LDAP_BIND_DN
  const bindPassword = process.env.LDAP_BIND_PASSWORD
  const starttls = (process.env.LDAP_STARTTLS || 'false').toLowerCase() === 'true'

  if (!url || !baseDN) {
    throw new Error('LDAP_URL and LDAP_BASE_DN environment variables are required')
  }

  return {
    url,
    baseDN,
    userAttribute,
    bindDN,
    bindPassword,
    starttls,
  }
}

/**
 * Create LDAP client with proper configuration
 */
function createLDAPClient(config: LDAPConfig): Client {
  return createClient({
    url: config.url,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  })
}

/**
 * Search for a user in LDAP by email or username
 */
async function searchLDAPUser(
  client: Client,
  config: LDAPConfig,
  searchQuery: string
): Promise<any | null> {
  return new Promise((resolve, reject) => {
    const filter = `(|(${config.userAttribute}=${searchQuery})(sAMAccountName=${searchQuery})(uid=${searchQuery}))`

    const options = {
      filter,
      scope: 'sub' as const,
    }

    client.search(config.baseDN, options, (err: Error | null, res: any) => {
      if (err) {
        reject(err)
        return
      }

      let user: any = null

      res.on('searchEntry', (entry: any) => {
        user = entry.object
      })

      res.on('error', (err: Error) => {
        reject(err)
      })

      res.on('end', () => {
        resolve(user)
      })
    })
  })
}

/**
 * Authenticate user against LDAP server
 * Supports both direct bind and search-then-bind approaches
 */
export async function authenticateLDAP(
  username: string,
  password: string
): Promise<LDAPAuthResult> {
  const config = getLDAPConfig()
  const client = createLDAPClient(config)

  try {
    // Apply STARTTLS if configured
    if (config.starttls) {
      await new Promise<void>((resolve, reject) => {
        client.starttls(
          {}, // options
          null, // controls (optional)
          (err: Error | null) => {
            if (err) reject(err)
            else resolve()
          }
        )
      })
    }

    let userDN: string | null = null
    let userObject: any = null

    // If bind credentials are provided, use search-then-bind approach
    if (config.bindDN && config.bindPassword) {
      // Bind as service account
      await new Promise<void>((resolve, reject) => {
        client.bind(config.bindDN!, config.bindPassword!, (err: Error | null) => {
          if (err) reject(err)
          else resolve()
        })
      })

      // Search for the user
      userObject = await searchLDAPUser(client, config, username)

      if (!userObject) {
        return {
          success: false,
          message: 'User not found in LDAP directory',
        }
      }

      userDN = userObject.dn
    } else {
      // Direct bind approach - construct DN from username
      // Common patterns: CN=username,OU=..., uid=username,ou=..., etc.
      const possibleDNs = [
        `CN=${username},${config.baseDN}`,
        `uid=${username},${config.baseDN}`,
        `mail=${username},${config.baseDN}`,
        `sAMAccountName=${username},${config.baseDN}`,
      ]

      // Try each possible DN format
      for (const dn of possibleDNs) {
        try {
          await new Promise<void>((resolve, reject) => {
            client.bind(dn, password, (err: Error | null) => {
              if (err) reject(err)
              else resolve()
            })
          })

          userDN = dn
          break
        } catch {
          // Try next DN format
          continue
        }
      }

      if (!userDN) {
        return {
          success: false,
          message: 'Invalid username or password',
        }
      }

      // If we found a valid DN, search for full user object
      userObject = await searchLDAPUser(client, config, username)
    }

    // Bind with user credentials to verify password
    if (!config.bindDN || !config.bindPassword) {
      await new Promise<void>((resolve, reject) => {
        client.bind(userDN!, password, (err: Error | null) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    // Extract user information
    const email = userObject?.mail || userObject?.email || username
    const name = userObject?.displayName || userObject?.cn || username
    const ldapUsername = userObject?.sAMAccountName || userObject?.uid || username

    return {
      success: true,
      message: 'Authentication successful',
      user: {
        username: ldapUsername,
        email,
        name,
        distinguishedName: userDN || userObject?.dn || '',
      },
    }
  } catch (error: any) {
    console.error('LDAP authentication error:', error.message)

    // Handle specific LDAP error codes
    if (error.code === 'INVALID_CREDENTIALS' || error.code === 49) {
      return {
        success: false,
        message: 'Invalid username or password',
      }
    }

    if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: 'Cannot connect to LDAP server',
      }
    }

    return {
      success: false,
      message: `LDAP error: ${error.message}`,
    }
  } finally {
    // Always unbind
    try {
      await new Promise<void>((resolve) => {
        client.unbind((err: Error | null) => resolve())
      })
    } catch {
      // Ignore unbind errors
    }
  }
}

/**
 * Sync LDAP user to database
 */
export async function syncLDAPUserToDatabase(
  ldapUser: {
    username: string
    email: string
    name: string
    distinguishedName: string
  },
  prisma: any
): Promise<any> {
  try {
    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { username: ldapUser.username.toLowerCase() },
    })

    if (user) {
      // Update existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: ldapUser.name,
        },
      })
    } else {
      // Create new user from LDAP
      // Generate a random password since LDAP users don't have local passwords
      const randomPassword = Math.random().toString(36).slice(-16)

      user = await prisma.user.create({
        data: {
          username: ldapUser.username.toLowerCase(),
          name: ldapUser.name,
          password: randomPassword, // LDAP users won't use this
          role: 'ADMIN',
          isActive: true,
        },
      })
    }

    return user
  } catch (error) {
    console.error('Error syncing LDAP user to database:', error)
    throw error
  }
}
