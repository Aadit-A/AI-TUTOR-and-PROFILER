import { NextResponse } from "next/server";

import Problem from "@/models/Problem";

import dbConnect from "@/lib/db";

export async function POST(req: Request) {

  try {

    // ---------------------------------------------------
    // CONNECT DB
    // ---------------------------------------------------

    await dbConnect();

    // ---------------------------------------------------
    // GET USER QUERY
    // ---------------------------------------------------

    const body = await req.json();

    const query = body.query;

    // ---------------------------------------------------
    // CALL FASTAPI ML BACKEND
    // ---------------------------------------------------

    const response = await fetch(

      `${process.env.ML_BACKEND_URL}/predict`,

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

    const mlData = await response.json();

    const tags = mlData.tags || [];

    console.log("Predicted Tags:", tags);

    // ---------------------------------------------------
    // MAP ML TAGS -> DB TAGS
    // ---------------------------------------------------

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

    console.log("Database Tags:", dbTags);

    // ---------------------------------------------------
    // FETCH PROBLEMSs
    // ---------------------------------------------------

    const problems = await Problem.find({

      relatedTopics: {
        $in: dbTags
      }

    }).limit(10);

    // ---------------------------------------------------
    // RANK PROBLEMS
    // ---------------------------------------------------

    const rankedProblems = problems.map((problem: any) => {

      let score = 0;

      for (const tag of dbTags) {

        if (problem.relatedTopics.includes(tag)) {
          score++;
        }
      }

      return {
        ...problem.toObject(),
        score
      };
    });

    rankedProblems.sort(
      (a, b) => b.score - a.score
    );

    // ---------------------------------------------------
    // RETURN RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({

      success: true,

      predictedTags: tags,

      problems: rankedProblems
    });

  } catch (err: any) {

    console.error(err);

    return NextResponse.json({

      success: false,

      error: err.toString()
    });
  }
}