/**
 * Parses the statercodes.txt file and seeds starterCode (cpp) into MongoDB
 * for problems 1-100.
 */
import mongoose from 'mongoose';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

function parseStarterCodes(filePath: string): Record<number, string> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const blocks: Record<number, string> = {};
  const lines = content.split('\n');

  let currentId: number | null = null;
  let currentCode: string[] = [];

  for (const line of lines) {
    // Match comment like "// 1. Two Sum"
    const headerMatch = line.match(/^\/\/\s*(\d+)\.\s+.+/);
    if (headerMatch) {
      // Save previous block
      if (currentId !== null && currentCode.length > 0) {
        blocks[currentId] = currentCode.join('\n').trim();
      }
      currentId = parseInt(headerMatch[1]);
      currentCode = [];
    } else {
      currentCode.push(line);
    }
  }

  // Save last block
  if (currentId !== null && currentCode.length > 0) {
    blocks[currentId] = currentCode.join('\n').trim();
  }

  return blocks;
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }

  const filePath = 'C:\\Users\\aarus\\OneDrive\\Desktop\\statercodes.txt';
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
  }

  console.log('Parsing starter codes from file...');
  const starterCodes = parseStarterCodes(filePath);
  console.log(`Parsed ${Object.keys(starterCodes).length} starter codes\n`);

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB\n');

  const col = mongoose.connection.collection('problems');
  let updated = 0;
  let notFound = 0;

  for (const [idStr, cppCode] of Object.entries(starterCodes)) {
    const problemId = parseInt(idStr);
    const result = await col.findOneAndUpdate(
      { problemId },
      { $set: { 'starterCode.cpp': cppCode } },
      { returnDocument: 'after' }
    );

    if (result) {
      updated++;
      console.log(`✅ ${problemId}. ${(result as any).title}`);
    } else {
      notFound++;
      console.log(`❌ Problem ${problemId} not found in DB`);
    }
  }

  console.log(`\nDone! Updated: ${updated}, Not found: ${notFound}`);
  await mongoose.disconnect();
}

main().catch(console.error);
