const mongoose = require('mongoose');

// Try with different connection options to timeout faster
const options = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 10000,
  family: 4 // Force IPv4
};

async function testConnection() {
  const uri = process.env.MONGODB_URI; // Use the env var directly
  
  if (!uri) {
      console.error("No MONGODB_URI in process.env");
      // Load from file for this script since nextjs isn't loading it
       const path = require('path');
       const fs = require('fs');
       const envPath = path.resolve(process.cwd(), '.env');
       if(fs.existsSync(envPath)){
           const envContent = fs.readFileSync(envPath, 'utf-8');
           const match = envContent.match(/MONGODB_URI=(.+)/);
           if(match) {
               console.log("Loaded URI from .env file manually");
               process.env.MONGODB_URI = match[1].trim();
           }
       }
  }

  const finalUri = process.env.MONGODB_URI;
  if(!finalUri) {
      console.error("Still no URI found.");
      return;
  }

  console.log('Testing connection to:', finalUri.substring(0, 20) + "...");
  
  try {
    await mongoose.connect(finalUri, options);
    console.log('✅ Connected!');
    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

testConnection();
