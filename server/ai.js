import { GoogleGenAI } from '@google/genai';

// Using Gemini AI - the newest model is "gemini-2.5-flash"
// Do not change this unless explicitly requested by the user

let ai = null;

function getGeminiAI() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to your environment.');
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export async function enhanceCV(cvData) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert CV writer and career coach. You MUST respond with valid JSON only, no markdown or explanation.

Your task: Enhance this CV to be more professional, impactful, and ATS-optimized.

Instructions:
1. Improve the professional summary to be compelling and keyword-rich
2. Rewrite experience bullet points using strong action verbs and quantifiable achievements (e.g., "Increased sales by 25%", "Led team of 8 engineers")
3. Optimize for Applicant Tracking Systems by using industry-standard terminology
4. Keep the same structure but enhance the content

Return the enhanced CV data in the exact same JSON structure as the input.`;

  const userPrompt = `Current CV Data:
${JSON.stringify(cvData, null, 2)}

Return ONLY valid JSON with the enhanced CV data.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw new Error('Failed to enhance CV with AI');
  }
}

export async function analyzeJobOffer(jobDescription) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert job market analyst. You MUST respond with valid JSON only.

Analyze job offers and extract key information in this exact format:
{
  "title": "Job title",
  "company": "Company name if mentioned",
  "location": "Location if mentioned",
  "requirements": ["List of key requirements and qualifications"],
  "skills": ["List of required skills"],
  "experience_level": "Entry/Mid/Senior/Executive",
  "salary_range": "If mentioned",
  "key_responsibilities": ["Main responsibilities"],
  "keywords": ["ATS keywords to include in CV"],
  "culture_hints": ["Company culture indicators"]
}`;

  const userPrompt = `Job Description:
${jobDescription}

Analyze and return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('Job analysis error:', error);
    throw new Error('Failed to analyze job offer');
  }
}

export async function tailorCVForJob(cvData, jobData) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert CV optimizer. You MUST respond with valid JSON only.

Tailor CVs specifically for job offers while keeping them truthful.

Instructions:
1. Rewrite the professional summary to highlight relevant experience for this specific role
2. Reorder and emphasize experiences that match the job requirements
3. Highlight skills that match the job posting
4. Use keywords from the job description naturally
5. Make bullet points more relevant to the position
6. Keep all information truthful - only rephrase and emphasize, don't add fake experience

Return the tailored CV in the same JSON structure, plus add these fields:
- "match_score": (0-100 percentage of how well CV matches the job)
- "ats_score": (0-100 ATS compatibility score)
- "improvements_made": ["List of changes made"]
- "missing_qualifications": ["Qualifications from job not in CV"]
- "keywords_added": ["Keywords added to improve matching"]`;

  const userPrompt = `Current CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Return ONLY valid JSON with the tailored CV.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('CV tailoring error:', error);
    throw new Error('Failed to tailor CV for job');
  }
}

export async function generateCoverLetter(cvData, jobData, tone = 'professional') {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert cover letter writer. You MUST respond with valid JSON only.

Write compelling cover letters for job applications.

Requirements:
1. Address specific job requirements with relevant experience
2. Show enthusiasm for the company/role
3. Highlight 2-3 key achievements relevant to the position
4. Keep it concise (300-400 words)
5. Include a strong opening and call to action

Return as JSON:
{
  "cover_letter": "The full cover letter text",
  "highlights": ["Key points emphasized"],
  "personalization_tips": ["Suggestions for further customization"]
}`;

  const userPrompt = `Applicant CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Tone: ${tone} (options: professional, enthusiastic, creative, formal)

Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter');
  }
}

export async function calculateATSScore(cvData) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an ATS optimization expert. You MUST respond with valid JSON only.

Analyze CVs for ATS (Applicant Tracking System) compatibility.

Evaluate based on:
1. Clear section headers
2. Standard date formats
3. Keyword optimization
4. Readable formatting
5. Contact information completeness
6. Quantified achievements
7. Action verbs usage
8. Skills relevance and specificity

Return as JSON:
{
  "ats_score": (0-100),
  "breakdown": {
    "formatting": (0-100),
    "keywords": (0-100),
    "structure": (0-100),
    "content_quality": (0-100)
  },
  "strengths": ["What's good"],
  "improvements": ["What needs improvement"],
  "suggested_keywords": ["Keywords to add based on common job searches"]
}`;

  const userPrompt = `CV Data:
${JSON.stringify(cvData, null, 2)}

Analyze and return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('ATS scoring error:', error);
    throw new Error('Failed to calculate ATS score');
  }
}

export async function generateMotivationalInsight(userData) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an inspiring career coach. You MUST respond with valid JSON only.

Generate personalized motivational content for job seekers based on their profile and progress.

Return as JSON:
{
  "daily_motivation": "A personalized, inspiring message (2-3 sentences)",
  "career_tip": "A practical, actionable career tip",
  "strength_highlight": "One strength to celebrate from their profile",
  "next_step_suggestion": "A specific, encouraging next action"
}`;

  const userPrompt = `User Profile:
${JSON.stringify(userData, null, 2)}

Generate personalized motivation. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from AI');
    return JSON.parse(text);
  } catch (error) {
    console.error('Motivation generation error:', error);
    return {
      daily_motivation: "Every application brings you closer to your dream role. Keep pushing forward!",
      career_tip: "Update your LinkedIn profile to match your CV for consistent branding.",
      strength_highlight: "Your dedication to improvement sets you apart.",
      next_step_suggestion: "Consider tailoring your CV for a specific job today."
    };
  }
}
