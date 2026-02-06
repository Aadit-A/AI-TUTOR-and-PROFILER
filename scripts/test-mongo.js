const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  console.log('--- MongoDB Connection Test ---');
  
  // 1. Read .env file manually
  const envPath = path.resolve(process.cwd(), '.env');
  console.log(`Reading .env from: ${envPath}`);
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!');
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const uriMatch = envContent.match(/MONGODB_URI=(.+)/);
  
  if (!uriMatch || !uriMatch[1]) {
    console.error('❌ MONGODB_URI not found in .env file');
    return;
  }

  const uri = uriMatch[1].trim();
  // Mask URI for logging
  const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
  console.log(`Found URI: ${maskedUri}`);

  // 2. Attempt Connection
  try {
    console.log('Attempting to connect with Mongoose...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`Host: ${mongoose.connection.host}`);
    
    await mongoose.disconnect();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Connection Failed!');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.cause) console.error('Cause:', error.cause);
  }
}

testConnection();
