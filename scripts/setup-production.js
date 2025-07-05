#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up production environment...\n');

// Check if required environment variables are set
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\nPlease set these environment variables and try again.');
  process.exit(1);
}

console.log('✅ Environment variables check passed');

// Generate Prisma client
console.log('📦 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  process.exit(1);
}

// Run database migrations
console.log('🗄️  Running database migrations...');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('✅ Database migrations completed');
} catch (error) {
  console.error('❌ Failed to run migrations:', error.message);
  console.log('💡 If this is a new database, you might need to run: npx prisma db push');
}

// Seed database (optional)
if (process.argv.includes('--seed')) {
  console.log('🌱 Seeding database...');
  try {
    execSync('npm run db:seed', { stdio: 'inherit' });
    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed database:', error.message);
  }
}

// Build the application
console.log('🔨 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Application built successfully');
} catch (error) {
  console.error('❌ Failed to build application:', error.message);
  process.exit(1);
}

console.log('\n🎉 Production setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('   1. Start the application: npm start');
console.log('   2. Visit your application in the browser');
console.log('   3. Login with: admin@fintech.com / admin123');
console.log('\n🔐 Security reminders:');
console.log('   - Change the default admin password');
console.log('   - Ensure JWT_SECRET is strong and unique');
console.log('   - Enable HTTPS in production');
console.log('   - Set up proper database backups');
