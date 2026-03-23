import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Problem from '@/models/Problem';

export async function GET() {
  try {
    await connectDB();
    
    // Get unique topics
    const topics = await Problem.aggregate([
      { $unwind: '$relatedTopics' },
      { $group: { _id: '$relatedTopics' } },
      { $sort: { _id: 1 } }
    ]);
    
    // Get unique companies
    const companies = await Problem.aggregate([
      { $unwind: '$companies' },
      { $group: { _id: '$companies', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 100 } // Top 100 companies
    ]);
    
    // Get difficulty counts
    const difficultyCounts = await Problem.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    
    // Get total counts
    const totalProblems = await Problem.countDocuments();
    const faangProblems = await Problem.countDocuments({ askedByFaang: true });
    
    return NextResponse.json({
      topics: topics.map(t => t._id).filter(Boolean),
      companies: companies.map(c => ({ name: c._id, count: c.count })).filter(c => c.name),
      difficultyCounts: difficultyCounts.reduce((acc, d) => {
        acc[d._id] = d.count;
        return acc;
      }, {} as Record<string, number>),
      stats: {
        total: totalProblems,
        faang: faangProblems
      }
    });
    
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}
