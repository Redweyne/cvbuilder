import OpenAI from 'openai';

let openai = null;

function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment.');
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

export async function enhanceCV(cvData) {
  const client = getOpenAI();
  
  const prompt = `You are an expert CV writer and career coach. Enhance this CV to be more professional, impactful, and ATS-optimized.

Current CV Data:
${JSON.stringify(cvData, null, 2)}

Instructions:
1. Improve the professional summary to be compelling and keyword-rich
2. Rewrite experience bullet points using strong action verbs and quantifiable achievements (e.g., "Increased sales by 25%", "Led team of 8 engineers")
3. Optimize for Applicant Tracking Systems by using industry-standard terminology
4. Keep the same structure but enhance the content

Return the enhanced CV data in the exact same JSON structure.`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert CV writer. Return only valid JSON, no markdown or explanation.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw new Error('Failed to enhance CV with AI');
  }
}

export async function analyzeJobOffer(jobDescription) {
  const client = getOpenAI();
  
  const prompt = `Analyze this job offer and extract key information:

Job Description:
${jobDescription}

Extract and return as JSON:
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

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert job market analyst. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Job analysis error:', error);
    throw new Error('Failed to analyze job offer');
  }
}

export async function tailorCVForJob(cvData, jobData) {
  const client = getOpenAI();
  
  const prompt = `You are an expert CV optimizer. Tailor this CV specifically for the job offer while keeping it truthful.

Current CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Instructions:
1. Rewrite the professional summary to highlight relevant experience for this specific role
2. Reorder and emphasize experiences that match the job requirements
3. Highlight skills that match the job posting
4. Use keywords from the job description naturally
5. Make bullet points more relevant to the position
6. Keep all information truthful - only rephrase and emphasize, don't add fake experience

Return the tailored CV in the same JSON structure, plus add:
- "match_score": (0-100 percentage of how well CV matches the job)
- "ats_score": (0-100 ATS compatibility score)
- "improvements_made": ["List of changes made"]
- "missing_qualifications": ["Qualifications from job not in CV"]
- "keywords_to_add": ["Keywords added to improve matching"]`;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert CV optimizer. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('CV tailoring error:', error);
    throw new Error('Failed to tailor CV for job');
  }
}

export async function generateCoverLetter(cvData, jobData, tone = 'professional') {
  const client = getOpenAI();
  
  const prompt = `Write a compelling cover letter for this job application.

Applicant CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Tone: ${tone} (options: professional, enthusiastic, creative, formal)

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

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert cover letter writer. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter');
  }
}

export async function calculateATSScore(cvData) {
  const client = getOpenAI();
  
  const prompt = `Analyze this CV for ATS (Applicant Tracking System) compatibility and provide a score.

CV Data:
${JSON.stringify(cvData, null, 2)}

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

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an ATS optimization expert. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('ATS scoring error:', error);
    throw new Error('Failed to calculate ATS score');
  }
}
