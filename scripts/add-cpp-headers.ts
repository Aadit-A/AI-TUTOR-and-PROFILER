/**
 * Prepends #include, using namespace std, and required struct definitions
 * (ListNode, TreeNode) to all C++ starter codes in MongoDB.
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const BASE_HEADER = `#include <bits/stdc++.h>
using namespace std;`;

const LISTNODE_DEF = `struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};`;

const TREENODE_DEF = `struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};`;

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) { console.error('MONGODB_URI not set'); process.exit(1); }

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB\n');

  const col = mongoose.connection.collection('problems');
  const problems = await col.find(
    { 'starterCode.cpp': { $exists: true } },
    { projection: { problemId: 1, title: 1, 'starterCode.cpp': 1 } }
  ).sort({ problemId: 1 }).toArray();

  console.log(`Found ${problems.length} problems with C++ starter code\n`);

  let updated = 0;
  for (const p of problems) {
    const code = (p.starterCode as any)?.cpp as string;
    if (!code) continue;

    // Skip if already has #include (already processed)
    if (code.includes('#include')) {
      console.log(`⏭️  ${p.problemId}. ${p.title} (already has includes)`);
      continue;
    }

    const needsListNode = code.includes('ListNode');
    const needsTreeNode = code.includes('TreeNode');

    let header = BASE_HEADER + '\n';
    if (needsListNode) header += '\n' + LISTNODE_DEF + '\n';
    if (needsTreeNode) header += '\n' + TREENODE_DEF + '\n';

    const fullCode = header + '\n' + code;

    await col.updateOne(
      { problemId: p.problemId },
      { $set: { 'starterCode.cpp': fullCode } }
    );

    const tags = [needsListNode && 'ListNode', needsTreeNode && 'TreeNode'].filter(Boolean);
    console.log(`✅ ${p.problemId}. ${p.title}${tags.length ? ` (+ ${tags.join(', ')})` : ''}`);
    updated++;
  }

  console.log(`\nDone! Updated ${updated} problems.`);
  await mongoose.disconnect();
}

main().catch(console.error);
