import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Problem Schema (inline to avoid ESM issues)
const ProblemSchema = new mongoose.Schema({
  problemId: { type: Number, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true, index: true },
  solutionLink: { type: String },
  acceptanceRate: { type: Number },
  frequency: { type: Number },
  url: { type: String },
  discussCount: { type: Number },
  accepted: { type: Number },
  submissions: { type: Number },
  companies: [{ type: String }],
  relatedTopics: [{ type: String }],
  likes: { type: Number },
  dislikes: { type: Number },
  rating: { type: Number },
  askedByFaang: { type: Boolean, default: false, index: true },
  similarQuestions: { type: String }
});

const Problem = mongoose.models.Problem || mongoose.model('Problem', ProblemSchema);

interface CSVRow {
  id: string;
  title: string;
  description: string;
  is_premium: string;
  difficulty: string;
  solution_link: string;
  acceptance_rate: string;
  frequency: string;
  url: string;
  discuss_count: string;
  accepted: string;
  submissions: string;
  companies: string;
  related_topics: string;
  likes: string;
  dislikes: string;
  rating: string;
  asked_by_faang: string;
  similar_questions: string;
}

function parseArrayField(value: string): string[] {
  if (!value || value === '[]' || value === '') return [];
  try {
    const parsed = JSON.parse(value.replace(/'/g, '"'));
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return value
      .replace(/[\[\]'"]/g, '')
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
}

function normalizeDifficulty(value: string): 'Easy' | 'Medium' | 'Hard' {
  const lower = value?.toLowerCase() || '';
  if (lower.includes('easy')) return 'Easy';
  if (lower.includes('hard')) return 'Hard';
  return 'Medium';
}

async function importData() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const csvPath = path.join('C:', 'Users', 'aarus', 'Downloads', 'archive', 'leetcode_dataset - lc.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    process.exit(1);
  }

  console.log('📂 Reading CSV file...');
  const content = fs.readFileSync(csvPath, 'utf-8');
  
  console.log('📋 Parsing CSV with proper multi-line support...');
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    relax_column_count: true
  });
  
  console.log(`📊 Found ${records.length} records`);
  
  const problems: any[] = [];
  let skipped = 0;
  
  for (const row of records as CSVRow[]) {
    try {
      // Validate it's a real LeetCode problem
      const url = row.url || '';
      if (!url.includes('leetcode.com')) {
        skipped++;
        continue;
      }
      
      const problem = {
        problemId: parseInt(row.id) || 0,
        title: row.title || '',
        description: row.description || '',
        isPremium: row.is_premium?.toLowerCase() === 'true' || row.is_premium === '1',
        difficulty: normalizeDifficulty(row.difficulty || ''),
        solutionLink: row.solution_link || '',
        acceptanceRate: parseFloat(row.acceptance_rate) || 0,
        frequency: parseFloat(row.frequency) || 0,
        url: url,
        discussCount: parseInt(row.discuss_count) || 0,
        accepted: parseFloat(row.accepted?.replace(/K/g, '000').replace(/M/g, '000000')) || 0,
        submissions: parseFloat(row.submissions?.replace(/K/g, '000').replace(/M/g, '000000')) || 0,
        companies: parseArrayField(row.companies || ''),
        relatedTopics: parseArrayField(row.related_topics || ''),
        likes: parseInt(row.likes) || 0,
        dislikes: parseInt(row.dislikes) || 0,
        rating: parseFloat(row.rating) || 0,
        askedByFaang: row.asked_by_faang?.toLowerCase() === 'true' || row.asked_by_faang === '1',
        similarQuestions: row.similar_questions || ''
      };
      
      if (problem.problemId > 0 && problem.title) {
        problems.push(problem);
      } else {
        skipped++;
      }
    } catch (err) {
      skipped++;
    }
  }

  console.log(`📊 Valid problems: ${problems.length} (${skipped} skipped)`);
  
  console.log('🗑️  Clearing existing problems...');
  await Problem.deleteMany({});
  
  console.log('💾 Inserting problems into MongoDB...');
  const batchSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < problems.length; i += batchSize) {
    const batch = problems.slice(i, i + batchSize);
    try {
      await Problem.insertMany(batch, { ordered: false });
      inserted += batch.length;
    } catch (err: any) {
      // Handle duplicate key errors
      if (err.writeErrors) {
        inserted += batch.length - err.writeErrors.length;
      }
    }
    console.log(`   Inserted ${inserted}/${problems.length}...`);
  }
  
  console.log('✅ Import complete!');
  console.log(`   Total problems: ${inserted}`);
  
  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

importData().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
