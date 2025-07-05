#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

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

async function main() {
  console.log('🚀 Fintech App - Supabase + Vercel Deployment\n');
  
  console.log('📋 Prerequisites Checklist:');
  console.log('   ✅ Supabase account created');
  console.log('   ✅ New Supabase project created');
  console.log('   ✅ Database password saved');
  console.log('   ✅ Connection string copied');
  console.log('   ✅ .env file updated with DATABASE_URL\n');
  
  const ready = await askQuestion('Have you completed all prerequisites? (y/n): ');
  
  if (ready.toLowerCase() !== 'y') {
    console.log('\n📚 Please complete the prerequisites first:');
    console.log('   1. Go to https://supabase.com');
    console.log('   2. Create account and new project');
    console.log('   3. Copy database connection string');
    console.log('   4. Update your .env file with DATABASE_URL');
    console.log('\nThen run this script again.');
    rl.close();
    return;
  }
  
  console.log('\n🔧 Step 1: Testing database connection...');
  try {
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('Pushing database schema...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    
    console.log('✅ Database connection successful!');
  } catch (error) {
    console.error('❌ Database connection failed!');
    console.error('Please check your DATABASE_URL in .env file');
    console.error('Error:', error.message);
    rl.close();
    return;
  }
  
  console.log('\n🌱 Step 2: Seeding database with initial data...');
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.log('⚠️  Seeding failed (this is okay if data already exists)');
  }
  
  console.log('\n🔨 Step 3: Building application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build successful!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    rl.close();
    return;
  }
  
  console.log('\n🚀 Step 4: Deploying to Vercel...');
  
  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch (error) {
    console.log('📦 Installing Vercel CLI...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }
  
  console.log('\n🔐 Environment Variables for Vercel:');
  console.log('You will need to set these in Vercel dashboard:');
  
  // Read current .env file to get DATABASE_URL
  let databaseUrl = '';
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const dbMatch = envContent.match(/DATABASE_URL="([^"]+)"/);
    if (dbMatch) {
      databaseUrl = dbMatch[1];
    }
  } catch (error) {
    console.log('Could not read .env file');
  }
  
  console.log(`   DATABASE_URL="${databaseUrl}"`);
  console.log('   JWT_SECRET="fintech-app-super-secret-jwt-key-2024-production-ready-secure-token-change-this"');
  console.log('   NODE_ENV="production"');
  
  const proceedDeploy = await askQuestion('\nReady to deploy to Vercel? (y/n): ');
  
  if (proceedDeploy.toLowerCase() === 'y') {
    try {
      console.log('\n🚀 Starting Vercel deployment...');
      execSync('vercel --prod', { stdio: 'inherit' });
      
      console.log('\n🎉 Deployment completed!');
      console.log('\n📋 Next steps:');
      console.log('   1. Go to your Vercel dashboard');
      console.log('   2. Find your project and go to Settings → Environment Variables');
      console.log('   3. Add the environment variables shown above');
      console.log('   4. Redeploy your project to apply the variables');
      console.log('   5. Visit your live URL');
      console.log('   6. Go to /api/auth/setup to create initial admin user');
      console.log('   7. Login with: admin@fintech.com / admin123');
      console.log('\n🔐 Security reminder: Change the default password after first login!');
      
    } catch (error) {
      console.error('❌ Vercel deployment failed:', error.message);
      console.log('\n💡 Manual deployment option:');
      console.log('   1. Push your code to GitHub');
      console.log('   2. Go to https://vercel.com');
      console.log('   3. Import your GitHub repository');
      console.log('   4. Add environment variables in Vercel dashboard');
    }
  } else {
    console.log('\n📚 Manual deployment instructions:');
    console.log('   1. Push your code to GitHub');
    console.log('   2. Go to https://vercel.com and import your repo');
    console.log('   3. Add environment variables in Vercel dashboard');
    console.log('   4. Deploy!');
  }
  
  rl.close();
}

main().catch(console.error);
