import { NextRequest, NextResponse } from 'next/server';
import Problem from "@/models/Problem";
import dbConnect from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body?.query === 'string' ? body.query : '';
    const limit = body?.limit ? Number(body.limit) : 20;

    if (!query || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    await dbConnect();

    // Call ML backend to get tags
    const response = await fetch(`${process.env.ML_BACKEND_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query })
    });

    const mlData = await response.json();
    const tags: string[] = mlData.tags || [];

    // Map tags to db tags
    const tagMap: Record<string, string> = {
      array: "Array",
      graph: "Graph",
      dfs: "Depth-First Search",
      bfs: "Breadth-First Search",
      dp: "Dynamic Programming",
      tree: "Tree",
      bst: "Binary Search Tree",
      recursion: "Recursion",
      two_pointer: "Two Pointers",
      sliding_window: "Sliding Window",
      binary_search: "Binary Search",
      heap: "Heap",
      stack: "Stack",
      queue: "Queue",
      linked_list: "Linked List",
      greedy: "Greedy",
      backtracking: "Backtracking"
    };

    const dbTags = tags.map(tag => tagMap[tag] || tag);

    // Fetch related problems
    const problems = await Problem.find({
      relatedTopics: { $in: dbTags }
    }).limit(limit);

    // Rank problems
    const rankedProblems = problems.map((problem: any) => {
      let score = 0;
      for (const tag of dbTags) {
        if (problem.relatedTopics.includes(tag)) {
          score++;
        }
      }
      return { ...problem.toObject(), score };
    }).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      predictedTags: tags,
      problems: rankedProblems
    });
  } catch (error) {
    console.error('Error in suggest-tags:', error);
    return NextResponse.json({ error: 'Failed to suggest tags' }, { status: 500 });
  }
}
