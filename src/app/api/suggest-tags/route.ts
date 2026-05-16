import { NextResponse } from "next/server";

import Problem from "@/models/Problem";

import dbConnect from "@/lib/db";

export async function POST(req: Request) {

  try {

    await dbConnect();

    const body = await req.json();

    const query = body.query;

    // --------------------------------------------
    // CALL PYTHON API
    // --------------------------------------------

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const mlResponse = await fetch(
      `${baseUrl}/api/predict`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          query
        })
      }
    );

    const mlData = await mlResponse.json();

    const tags = mlData.tags || [];

    // --------------------------------------------
    // TAG MAP
    // --------------------------------------------

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

    const dbTags = tags.map(
      tag => tagMap[tag] || tag
    );

    // --------------------------------------------
    // FETCH PROBLEMS
    // --------------------------------------------

    const problems = await Problem.find({
      relatedTopics: {
        $in: dbTags
      }
    }).limit(10);

    return NextResponse.json({

      success: true,

      predictedTags: tags,

      problems
    });

  } catch (err: any) {

    console.error(err);

    return NextResponse.json({

      success: false,

      error: err.toString()
    });
  }
}