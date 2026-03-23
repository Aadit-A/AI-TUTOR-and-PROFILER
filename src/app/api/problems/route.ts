import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Problem from '@/models/Problem';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    
    // Filters
    const difficulty = searchParams.get('difficulty');
    const faang = searchParams.get('faang');
    const search = searchParams.get('search');
    const company = searchParams.get('company');
    const topic = searchParams.get('topic');
    const sortBy = searchParams.get('sortBy') || 'problemId';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;
    
    // Build query
    const query: any = {};
    
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      query.difficulty = difficulty;
    }
    
    if (faang === 'true') {
      query.askedByFaang = true;
    }
    
    if (company) {
      query.companies = { $regex: company, $options: 'i' };
    }
    
    if (topic) {
      query.relatedTopics = { $regex: topic, $options: 'i' };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await Problem.countDocuments(query);
    
    // Get problems
    const problems = await Problem.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-description -similarQuestions') // Exclude large fields in list view
      .lean();
    
    return NextResponse.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    });
    
  } catch (error) {
    console.error('Error fetching problems:', error);
    return NextResponse.json(
      { error: 'Failed to fetch problems' },
      { status: 500 }
    );
  }
}
