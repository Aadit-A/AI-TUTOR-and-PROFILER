import { NextResponse } from "next/server";

import { suggestTags } from "@/lib/tagSuggest";

import Problem from "@/models/Problem";

import dbConnect from "@/lib/db";

export async function POST(req: Request) {

  try {

    // ---------------------------------------------------
    // CONNECT DATABASE
    // ---------------------------------------------------

    await dbConnect();

    // ---------------------------------------------------
    // GET USER QUERY
    // ---------------------------------------------------

    const body = await req.json();

    const query = body.query;

    // ---------------------------------------------------
    // PREDICT TAGS USING ML MODEL
    // ---------------------------------------------------

    const tags = await suggestTags(query);

    console.log("Predicted Tags:", tags);

    // ---------------------------------------------------
    // MAP ML TAGS -> DATABASE TAGS
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
    // FETCH MATCHING PROBLEMS
    // ---------------------------------------------------

    const problems = await Problem.find({
      relatedTopics: { $in: dbTags }
    }).limit(10);

    console.log("Problems Found:", problems.length);

    // ---------------------------------------------------
    // OPTIONAL RANKING
    // MORE MATCHING TAGS = HIGHER SCORE
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
    // RESPONSE
    // ---------------------------------------------------

    return NextResponse.json({

      success: true,

      query,

      predictedTags: tags,

      databaseTags: dbTags,

      totalProblems: rankedProblems.length,

      problems: rankedProblems
    });

  } catch (err: any) {

    console.error("API ERROR:");

    console.error(err);

    return NextResponse.json({

      success: false,

      error: err.toString()
    });
  }
}