import {Client} from 'ldapts'

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
}

const LDAP_CONFIG = {
  url: getEnv('LDAP_URL'),
  baseDN: getEnv('LDAP_BASE_DN'),
} as const;

interface AuthenticationResult {
  success: boolean;
  message: string;
  username?: string;
}

export async function authentication(
  username: string,
  password: string
): Promise<AuthenticationResult> {
  // Format username if needed
  const bindDN =
    username.includes('@') || username.includes('\\') || username.includes('dc=')
      ? username
      : `${username}@zemenbank.local`;

  const client = new Client({
    url: LDAP_CONFIG.url,
    tlsOptions: {
    rejectUnauthorized: false,}
  });

  try {
    // Bind (authenticate)
    await client.bind(bindDN, password);

    return {
      success: true,
      message: 'Authentication successful',
      username,
    };
   
  } catch (err: any) {
    if (err) {
      // LDAP-specific error
      if (err.code === 49) {
        // Invalid credentials
        return {
          success: false,
          message: 'Invalid username or password',
        
        };
      }
      return {
        success: false,
        message: `LDAP error: ${err.message}`,
      };
    }
    // Other unexpected errors
    return {
      success: false,
      message: `Authentication failed: ${err?.message || err}`, 
      
    };
   
  } finally {
    // Always unbind
    try {
      await client.unbind();
    } catch {}
  }
}
