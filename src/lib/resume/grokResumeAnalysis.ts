const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL;

export interface ResumeAnalysis {
  name: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendedTopics: string[];
  atsScore: number;
  summary: string;
}

/**
 * Sends resume text to Groq API and returns a structured analysis.
 * @param text - Extracted text from the resume.
 * @returns Structured analysis as ResumeAnalysis object.
 */
export async function analyzeResumeWithGrok(text: string): Promise<ResumeAnalysis> {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key not configured');
  }

  const prompt = `
    Analyze the following resume text and provide a structured JSON response.
    
    Resume Text:
    ${text}
    
    The response MUST be a valid JSON object with the following fields:
    {
      "name": "Candidate Name",
      "skills": ["List", "of", "technical", "skills"],
      "strengths": ["Key", "strengths"],
      "weaknesses": ["Areas", "for", "improvement"],
      "missingSkills": ["Skills", "common", "for", "the", "role", "that", "are", "missing"],
      "recommendedTopics": ["DSA", "topics", "or", "interview", "topics", "to", "study"],
      "atsScore": 85, (a number between 0 and 100)
      "summary": "A brief overall summary of the candidate profile"
    }

    Return ONLY the JSON object. Do not include any other text.
    Give the atsScore as a number between 0 and 100, where 100 means the resume is perfectly optimized for ATS systems.
    If it seems like the resume is missing key information or is poorly formatted, give it a lower score. If it is well-structured and contains relevant keywords, give it a higher score.
    If the format seems like it might be a scanned PDF with little extractable text, give it a very low score and mention in the summary that the resume may be unreadable by ATS systems.
    If the resume does not feel like resume but more like a cover letter or something else, give it a low score and mention that in the summary as well.
    Give suggestion on what dsa topics or interview topics the candidate should study based on the content of the resume and the skills they have or are missing.
    Do not hesitate to give a low score if the resume is not up to par, and be honest in the analysis. The goal is to provide actionable feedback to help the candidate improve their resume and interview preparation.
    Make it hard to score high in the resume analysis. Only well-optimized resumes with strong content should get scores above 80. Many resumes will likely score in the 40-70 range, and some may be below 40 if they are missing key information or are poorly formatted.
  `;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume analyzer and career coach. Your goal is to provide deep insights and actionable feedback on resumes. You always output valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      throw new Error('Groq API failed to respond');
    }

    const data = await response.json();
    const analysisStr = data.choices[0].message.content;
    
    try {
      return JSON.parse(analysisStr) as ResumeAnalysis;
    } catch (parseError) {
      console.error('Failed to parse AI response:', analysisStr);
      throw new Error('Invalid AI response format');
    }
  } catch (error) {
    console.error('Error in analyzeResumeWithGrok:', error);
    throw error;
  }
}
