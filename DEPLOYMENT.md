# Fintech App Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended)

#### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- PostgreSQL database (Supabase, Neon, or Railway)

#### Steps

1. **Set up Database**
   - Go to [Supabase](https://supabase.com) or [Neon](https://neon.tech)
   - Create a new project
   - Copy the PostgreSQL connection string

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

3. **Configure Environment Variables in Vercel**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add the following variables:
     ```
     DATABASE_URL=your_postgresql_connection_string
     JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
     NODE_ENV=production
     ```

4. **Run Database Migration**
   ```bash
   # After deployment, run migrations
   npx prisma migrate deploy
   ```

#### Database Setup Commands
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### Option 2: Railway

1. **Create Railway Account**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub account

2. **Deploy**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Next.js

3. **Add PostgreSQL**
   - In your project dashboard, click "New"
   - Select "Database" → "PostgreSQL"
   - Copy the connection string

4. **Set Environment Variables**
   ```
   DATABASE_URL=your_railway_postgresql_url
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=production
   ```

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean Account**
2. **Create App**
   - Go to Apps → Create App
   - Connect your GitHub repository
   - Choose "Web Service"

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Run Command: `npm start`

4. **Add Database**
   - Add a PostgreSQL database component
   - Configure environment variables

## 🔧 Environment Variables Required

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"

# Environment
NODE_ENV="production"
```

## 📋 Pre-deployment Checklist

- [ ] Database is set up and accessible
- [ ] Environment variables are configured
- [ ] JWT_SECRET is strong and secure
- [ ] Database migrations are ready
- [ ] Build process works locally (`npm run build`)

## 🔐 Security Notes

1. **JWT Secret**: Use a strong, random secret (at least 32 characters)
2. **Database**: Ensure your database has proper access controls
3. **Environment Variables**: Never commit `.env` files to version control
4. **HTTPS**: Ensure your deployment uses HTTPS (most platforms do this automatically)

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check database server is accessible
   - Ensure database exists

3. **Prisma Issues**
   ```bash
   # Regenerate Prisma client
   npx prisma generate
   
   # Reset database (development only)
   npx prisma migrate reset
   ```

## 📞 Support

If you encounter issues:
1. Check the deployment platform's logs
2. Verify all environment variables are set
3. Test the build process locally first

## 🚀 Quick Start Deployment

### One-Click Deployment
```bash
npm run deploy
```
This interactive script will guide you through deploying to your preferred platform.

### Manual Deployment Commands
```bash
# For Vercel
npm install -g vercel
vercel

# For Docker
npm run docker:compose

# For production setup
npm run setup:prod
```

## 🎯 Post-Deployment

1. **Test the Application**
   - Visit your deployed URL
   - Go to `/api/auth/setup` to create initial admin
   - Test login with: admin@fintech.com / admin123
   - Create test companies and products

2. **Security Setup**
   - Change default admin password immediately
   - Verify JWT_SECRET is secure and unique
   - Enable HTTPS (usually automatic on platforms)
   - Set up database backups

3. **Set up Monitoring** (Optional)
   - Configure error tracking (Sentry)
   - Set up uptime monitoring
   - Configure backup strategies

4. **Custom Domain** (Optional)
   - Configure your custom domain
   - Set up SSL certificate (usually automatic)

## 🔧 Available Scripts

- `npm run deploy` - Interactive deployment wizard
- `npm run setup:prod` - Production environment setup
- `npm run docker:compose` - Docker deployment
- `npm run db:seed` - Seed database with initial data
- `npm run build` - Build for production
