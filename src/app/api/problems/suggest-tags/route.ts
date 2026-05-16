import { NextRequest, NextResponse } from 'next/server';
import { suggestTagsFromQuery } from '@/lib/tagSuggest';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body?.query === 'string' ? body.query : '';
    const limit = body?.limit ? Number(body.limit) : 20;

    if (!query || !query.trim()) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const result = await suggestTagsFromQuery(query, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in suggest-tags:', error);
    return NextResponse.json({ error: 'Failed to suggest tags' }, { status: 500 });
  }
}
