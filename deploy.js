#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

function generateJWTSecret() {
  return crypto.randomBytes(64).toString('hex');
}

async function main() {
  console.log('🚀 Fintech App Deployment Wizard\n');
  
  console.log('Choose your deployment platform:');
  console.log('1. Vercel (Recommended)');
  console.log('2. Railway');
  console.log('3. DigitalOcean App Platform');
  console.log('4. Docker (Self-hosted)');
  console.log('5. Manual setup\n');
  
  const platform = await askQuestion('Enter your choice (1-5): ');
  
  switch (platform) {
    case '1':
      await deployToVercel();
      break;
    case '2':
      await deployToRailway();
      break;
    case '3':
      await deployToDigitalOcean();
      break;
    case '4':
      await deployWithDocker();
      break;
    case '5':
      await manualSetup();
      break;
    default:
      console.log('❌ Invalid choice. Please run the script again.');
  }
  
  rl.close();
}

async function deployToVercel() {
  console.log('\n🔵 Deploying to Vercel...\n');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }
  
  console.log('🔐 You\'ll need to set up these environment variables in Vercel:');
  console.log('   DATABASE_URL - Your PostgreSQL connection string');
  console.log('   JWT_SECRET - A secure secret key');
  console.log('\n💡 Suggested JWT_SECRET:', generateJWTSecret());
  
  const proceed = await askQuestion('\nHave you set up your database? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('\n📋 Database Setup Options:');
    console.log('   • Supabase: https://supabase.com (Free tier available)');
    console.log('   • Neon: https://neon.tech (Free tier available)');
    console.log('   • Railway: https://railway.app (PostgreSQL addon)');
    console.log('\nPlease set up your database and run this script again.');
    return;
  }
  
  console.log('\n🚀 Starting Vercel deployment...');
  try {
    execSync('vercel', { stdio: 'inherit' });
    console.log('\n✅ Deployment completed!');
    console.log('\n📋 Next steps:');
    console.log('   1. Go to your Vercel dashboard');
    console.log('   2. Add environment variables (DATABASE_URL, JWT_SECRET)');
    console.log('   3. Redeploy to apply environment variables');
    console.log('   4. Visit /api/auth/setup to create initial admin user');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
  }
}

async function deployToRailway() {
  console.log('\n🚂 Deploying to Railway...\n');
  console.log('📋 Railway Deployment Steps:');
  console.log('   1. Go to https://railway.app');
  console.log('   2. Connect your GitHub account');
  console.log('   3. Create new project from GitHub repo');
  console.log('   4. Add PostgreSQL database service');
  console.log('   5. Set environment variables:');
  console.log('      - DATABASE_URL (from PostgreSQL service)');
  console.log('      - JWT_SECRET:', generateJWTSecret());
  console.log('\n✅ Railway will automatically deploy your app!');
}

async function deployToDigitalOcean() {
  console.log('\n🌊 Deploying to DigitalOcean App Platform...\n');
  console.log('📋 DigitalOcean Deployment Steps:');
  console.log('   1. Go to https://cloud.digitalocean.com/apps');
  console.log('   2. Create App → GitHub → Select your repository');
  console.log('   3. Configure build settings:');
  console.log('      - Build Command: npm run build');
  console.log('      - Run Command: npm start');
  console.log('   4. Add PostgreSQL database component');
  console.log('   5. Set environment variables:');
  console.log('      - DATABASE_URL (from database component)');
  console.log('      - JWT_SECRET:', generateJWTSecret());
}

async function deployWithDocker() {
  console.log('\n🐳 Docker Deployment...\n');
  
  const hasDocker = await askQuestion('Do you have Docker installed? (y/n): ');
  
  if (hasDocker.toLowerCase() !== 'y') {
    console.log('📦 Please install Docker first:');
    console.log('   • Windows/Mac: https://www.docker.com/products/docker-desktop');
    console.log('   • Linux: https://docs.docker.com/engine/install/');
    return;
  }
  
  console.log('🔨 Building Docker containers...');
  try {
    execSync('docker-compose up --build -d', { stdio: 'inherit' });
    console.log('\n✅ Docker deployment completed!');
    console.log('🌐 Your app is running at: http://localhost:3000');
    console.log('🗄️  PostgreSQL is running on port 5432');
    console.log('\n📋 Next steps:');
    console.log('   1. Wait for the database to initialize');
    console.log('   2. Run: docker-compose exec app npm run db:seed');
    console.log('   3. Visit http://localhost:3000');
  } catch (error) {
    console.error('❌ Docker deployment failed:', error.message);
  }
}

async function manualSetup() {
  console.log('\n⚙️  Manual Setup Instructions...\n');
  console.log('📋 Required Environment Variables:');
  console.log('   DATABASE_URL=postgresql://user:password@host:port/database');
  console.log('   JWT_SECRET=' + generateJWTSecret());
  console.log('   NODE_ENV=production');
  
  console.log('\n🔨 Build Commands:');
  console.log('   npm install');
  console.log('   npm run build');
  console.log('   npm run db:migrate');
  console.log('   npm run db:seed');
  console.log('   npm start');
  
  console.log('\n🌐 Your app will be available at: http://localhost:3000');
}

main().catch(console.error);
