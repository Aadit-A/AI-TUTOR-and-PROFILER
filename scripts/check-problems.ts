import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkProblems() {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const Problem = mongoose.model('Problem', new mongoose.Schema({ 
    problemId: Number, 
    title: String, 
    url: String 
  }));
  
  const total = await Problem.countDocuments();
  const valid = await Problem.countDocuments({ url: { $regex: 'leetcode.com' } });
  
  console.log('Total entries:', total);
  console.log('Valid LeetCode problems:', valid);
  
  await mongoose.disconnect();
}

checkProblems();
