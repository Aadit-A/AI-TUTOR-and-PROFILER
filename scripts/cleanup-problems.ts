import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function cleanupProblems() {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('🔌 Connected to MongoDB');

  const Problem = mongoose.model('Problem', new mongoose.Schema({ 
    problemId: Number, 
    title: String, 
    url: String 
  }));
  
  // Remove invalid entries (those without proper leetcode.com URLs)
  const result = await Problem.deleteMany({ 
    $or: [
      { url: { $not: { $regex: 'leetcode.com' } } },
      { url: null },
      { url: '' }
    ]
  });
  
  console.log(`🗑️  Removed ${result.deletedCount} invalid entries`);
  
  const remaining = await Problem.countDocuments();
  console.log(`✅ ${remaining} valid problems remain`);
  
  await mongoose.disconnect();
  console.log('🔌 Disconnected');
}

cleanupProblems();
