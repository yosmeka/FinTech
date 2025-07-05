# Fintech Management App

A comprehensive fintech company and product management system built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **Admin User Management**: Create and manage admin users with role-based access
- **Company Management**: Full CRUD operations for fintech companies
- **Product Management**: Manage products associated with companies
- **Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Professional UI**: Modern, responsive design with Tailwind CSS
- **Search & Filter**: Advanced search and filtering capabilities
- **Toast Notifications**: User-friendly feedback system

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcryptjs
- **Styling**: Tailwind CSS
- **Deployment**: Vercel, Railway, Docker support

## 🚀 Quick Deployment

### One-Click Deployment
```bash
npm run deploy
```

### Platform-Specific Deployment

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Docker
```bash
npm run docker:compose
```

#### Railway/DigitalOcean
Follow the interactive deployment wizard: `npm run deploy`

## 💻 Local Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd fintech-app
   npm install
   ```

2. **Set up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

3. **Set up Database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Visit [http://localhost:3000](http://localhost:3000)
   Login with: `admin@fintech.com` / `admin123`

## 📋 Environment Variables

Required environment variables:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
NODE_ENV="production"
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run deploy` - Interactive deployment wizard
- `npm run setup:prod` - Production environment setup
- `npm run docker:compose` - Docker deployment
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Comprehensive deployment instructions
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🔐 Default Credentials

After deployment and seeding:
- **Email**: admin@fintech.com
- **Password**: admin123

⚠️ **Important**: Change the default password immediately after first login!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
