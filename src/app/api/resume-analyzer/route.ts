import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/resume/extractText';
import { analyzeResumeWithGrok } from '@/lib/resume/grokResumeAnalysis';

/**
 * API Route to handle resume analysis.
 * Accepts a PDF file via FormData, extracts text, and gets AI analysis.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No resume file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please upload a valid PDF file' },
        { status: 400 }
      );
    }

    // Convert file to Buffer for extraction
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract text from the PDF. It might be empty or scanned.' },
        { status: 400 }
      );
    }

    // 2. Perform AI analysis
    const analysis = await analyzeResumeWithGrok(text);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Resume Analyzer API Route Error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during resume analysis' },
      { status: 500 }
    );
  }
}
