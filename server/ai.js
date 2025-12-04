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

function extractText(response) {
  if (response && response.text) {
    return response.text;
  }
  if (response && response.candidates && response.candidates[0]) {
    const candidate = response.candidates[0];
    if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
      return candidate.content.parts[0].text;
    }
  }
  return null;
}

function parseJsonResponse(text) {
  if (!text) throw new Error('Empty response from AI');
  
  let cleanText = text.trim();
  if (cleanText.startsWith('```json')) {
    cleanText = cleanText.slice(7);
  } else if (cleanText.startsWith('```')) {
    cleanText = cleanText.slice(3);
  }
  if (cleanText.endsWith('```')) {
    cleanText = cleanText.slice(0, -3);
  }
  cleanText = cleanText.trim();
  
  return JSON.parse(cleanText);
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

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('AI enhancement error:', error);
    throw new Error('Failed to enhance CV with AI: ' + (error.message || 'Unknown error'));
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

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Job analysis error:', error);
    throw new Error('Failed to analyze job offer: ' + (error.message || 'Unknown error'));
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

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('CV tailoring error:', error);
    throw new Error('Failed to tailor CV for job: ' + (error.message || 'Unknown error'));
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

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter: ' + (error.message || 'Unknown error'));
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

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('ATS scoring error:', error);
    throw new Error('Failed to calculate ATS score: ' + (error.message || 'Unknown error'));
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

    const text = extractText(response);
    return parseJsonResponse(text);
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

export async function discoverCareerStory(responses) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are a world-class career storyteller and life coach with deep empathy. You MUST respond with valid JSON only.

Your mission: Transform someone's career experiences into a powerful, authentic narrative that reveals their unique value and inspires them to see themselves in a new light.

You have received deeply personal reflections about someone's career journey. Your task is to:
1. Identify the golden thread connecting all their experiences
2. Uncover their hidden superpowers they might not even recognize
3. Craft a compelling professional identity statement
4. Create an emotionally resonant "origin story" for their career
5. Define their unique value proposition in a way that makes them feel seen

Be deeply personal, specific, and transformative. This should feel like a revelation - helping them see themselves clearly for the first time.

Return as JSON:
{
  "golden_thread": "The connecting theme across all their experiences (2-3 sentences)",
  "hidden_superpowers": ["3-5 unique strengths they may not recognize in themselves"],
  "professional_identity": "A powerful 2-3 sentence identity statement that captures who they are and what makes them extraordinary",
  "origin_story": "A 4-5 sentence narrative about their career journey that reads like the opening of an inspiring biography",
  "unique_value_proposition": "A memorable 1-2 sentence statement of their unique value that would make any employer want to learn more",
  "breakthrough_insights": ["3 profound realizations about themselves based on their responses"],
  "recommended_positioning": "How they should position themselves in the job market based on their unique story",
  "emotional_core": "The deep motivation or purpose driving their career (what really matters to them)",
  "transformation_statement": "A before/after statement showing how they should see themselves now vs. before"
}`;

  const userPrompt = `Career Reflection Responses:
${JSON.stringify(responses, null, 2)}

Analyze deeply and create a transformative career story. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Career story discovery error:', error);
    throw new Error('Failed to discover career story: ' + (error.message || 'Unknown error'));
  }
}

export async function conductMockInterview(cvData, jobData, userAnswer, questionIndex) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert interviewer and career coach conducting a realistic mock interview. You MUST respond with valid JSON only.

Your role: Conduct a supportive but realistic interview that helps the candidate improve. Provide genuine feedback that builds confidence while identifying areas for growth.

Guidelines:
1. If this is question 0, start with an opening/rapport question
2. Ask behavioral questions using STAR method expectations
3. Include role-specific technical or situational questions
4. Give constructive, specific feedback on each answer
5. Score based on clarity, relevance, and impact
6. Suggest specific improvements without being discouraging
7. Celebrate what they did well

Return as JSON:
{
  "feedback_on_answer": "Specific, constructive feedback on their answer (if provided)",
  "score": (1-10 score for the answer, null if no answer yet),
  "what_worked_well": ["Specific things they did well"],
  "areas_to_improve": ["Specific, actionable improvements"],
  "sample_better_answer": "An example of how they could strengthen their answer",
  "next_question": "The next interview question to ask",
  "question_type": "behavioral/technical/situational/opener/closer",
  "question_purpose": "What this question is designed to assess",
  "tips_for_next": "Brief coaching tip for the upcoming question",
  "overall_progress": "Encouraging statement about their progress so far",
  "confidence_boost": "Something genuine and specific to boost their confidence"
}`;

  const userPrompt = `Candidate CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Question Number: ${questionIndex}
${userAnswer ? `Candidate's Answer: "${userAnswer}"` : 'Starting the interview - ask the first question.'}

Conduct the interview. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Mock interview error:', error);
    throw new Error('Failed to conduct mock interview: ' + (error.message || 'Unknown error'));
  }
}

export async function generateInterviewSummary(cvData, jobData, interviewHistory) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert interview coach providing a comprehensive session summary. You MUST respond with valid JSON only.

Create an inspiring, actionable summary that helps the candidate feel good about their progress while giving clear next steps.

Return as JSON:
{
  "overall_score": (1-100),
  "performance_summary": "2-3 sentence summary of their overall performance",
  "key_strengths_demonstrated": ["Top 3-5 strengths they showed"],
  "growth_opportunities": ["Top 3-5 areas to work on"],
  "memorable_moments": ["2-3 standout answers or moments"],
  "confidence_rating": (1-10 how confident they came across),
  "communication_rating": (1-10 clarity and articulation),
  "relevance_rating": (1-10 how well answers matched the role),
  "star_method_usage": (1-10 how well they used STAR format),
  "personalized_action_plan": ["5 specific steps to improve"],
  "practice_questions": ["3 questions they should practice more"],
  "encouragement_message": "A genuine, motivating message about their potential",
  "ready_for_real_interview": true/false,
  "days_of_practice_recommended": number
}`;

  const userPrompt = `Candidate CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Interview History:
${JSON.stringify(interviewHistory, null, 2)}

Generate comprehensive summary. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Interview summary error:', error);
    throw new Error('Failed to generate interview summary: ' + (error.message || 'Unknown error'));
  }
}

export async function careerMentorChat(userMessage, context, conversationHistory = []) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an exceptional AI career mentor with deep empathy, wisdom, and practical expertise. You MUST respond with valid JSON only.

Your personality:
- Warm, encouraging, and genuinely caring
- Wise but accessible - avoid jargon
- Practical and action-oriented
- Celebratory of wins, supportive during setbacks
- Honest but kind - give real feedback with compassion

Your expertise:
- Career strategy and planning
- Job search tactics and optimization
- Interview preparation and confidence building
- Resume/CV optimization
- Salary negotiation
- Networking strategies
- Overcoming career blocks and imposter syndrome
- Work-life balance and burnout prevention

Guidelines:
1. Always acknowledge emotions first if the user expresses any
2. Ask clarifying questions when needed
3. Provide specific, actionable advice
4. Reference their CV/profile data to personalize advice
5. Celebrate their progress and strengths
6. Be direct but compassionate about areas to improve
7. End with a clear next step or question

Return as JSON:
{
  "response": "Your conversational response to the user",
  "emotional_acknowledgment": "How you're acknowledging their emotional state (if applicable)",
  "key_insight": "The most important point from your response",
  "action_items": ["Specific actions they could take"],
  "follow_up_question": "A thoughtful question to continue the conversation or null",
  "resource_suggestion": "A type of resource that might help (e.g., 'practice interview questions for PM roles') or null",
  "encouragement": "A specific, personalized word of encouragement",
  "topic_tags": ["career-strategy", "confidence", etc - relevant topics covered]
}`;

  const userPrompt = `User Context:
${JSON.stringify(context, null, 2)}

Conversation History:
${JSON.stringify(conversationHistory.slice(-10), null, 2)}

User's Message: "${userMessage}"

Respond as their career mentor. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Career mentor chat error:', error);
    throw new Error('Failed to get mentor response: ' + (error.message || 'Unknown error'));
  }
}

export async function analyzeApplicationReadiness(cvData, jobData) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert job application strategist. You MUST respond with valid JSON only.

Analyze how ready someone is to apply for a specific job and provide strategic guidance.

Return as JSON:
{
  "readiness_score": (0-100 overall readiness),
  "readiness_level": "Ready to Apply" / "Almost Ready" / "Needs Work" / "Not a Good Fit",
  "match_breakdown": {
    "skills_match": (0-100),
    "experience_match": (0-100),
    "education_match": (0-100),
    "keywords_match": (0-100)
  },
  "strengths_for_role": ["Top 5 qualifications that match well"],
  "gaps_to_address": ["Skills or experiences they're missing"],
  "competitive_advantages": ["What sets them apart from other candidates"],
  "red_flags": ["Potential concerns a recruiter might have"],
  "mitigation_strategies": ["How to address each red flag"],
  "application_strategy": {
    "recommended_approach": "cold-apply/referral-needed/internal-transfer/etc",
    "best_time_to_apply": "timing strategy",
    "customization_priority": ["What to emphasize in application"]
  },
  "cover_letter_focus": ["3 key points to highlight"],
  "networking_targets": ["Types of people to connect with"],
  "confidence_statement": "A statement to boost their confidence",
  "honest_assessment": "Candid but encouraging assessment",
  "success_probability": "low/medium/high with explanation"
}`;

  const userPrompt = `Applicant CV:
${JSON.stringify(cvData, null, 2)}

Target Job:
${JSON.stringify(jobData, null, 2)}

Analyze application readiness. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Application readiness error:', error);
    throw new Error('Failed to analyze application readiness: ' + (error.message || 'Unknown error'));
  }
}

export async function parseUploadedCV(fileContent, fileType) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are an expert CV parser and data extractor. You MUST respond with valid JSON only.

Your task: Extract all information from the uploaded CV/resume content and structure it into a standardized format.

Instructions:
1. Extract personal information (name, email, phone, location, LinkedIn, website)
2. Create a professional summary from the profile/objective section or synthesize one from the content
3. Extract all work experiences with company, title, dates, location, and bullet points
4. Extract education history with institution, degree, field, dates, and achievements
5. Extract all skills mentioned (technical and soft skills)
6. Extract certifications, languages, and projects if present
7. If dates are partial, make reasonable assumptions (e.g., "2020-Present" becomes start_date: "2020-01", end_date: null, current: true)
8. Clean and normalize the data for professional presentation

Return as JSON with this exact structure:
{
  "personal_info": {
    "full_name": "Full Name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/username",
    "website": "personal-website.com",
    "summary": "Professional summary paragraph"
  },
  "experiences": [
    {
      "id": "exp_1",
      "company": "Company Name",
      "title": "Job Title",
      "location": "City, Country",
      "start_date": "2020-01",
      "end_date": "2023-06",
      "current": false,
      "description": "Brief role description",
      "achievements": ["Achievement 1 with metrics if available", "Achievement 2"]
    }
  ],
  "education": [
    {
      "id": "edu_1",
      "institution": "University Name",
      "degree": "Bachelor's/Master's/PhD",
      "field": "Field of Study",
      "start_date": "2016-09",
      "end_date": "2020-06",
      "gpa": "3.8",
      "achievements": ["Dean's List", "Relevant coursework"]
    }
  ],
  "skills": [
    {
      "id": "skill_1",
      "name": "Skill Name",
      "category": "Technical/Soft/Language/Tool",
      "level": "Expert/Advanced/Intermediate/Beginner"
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "2023-01",
      "expires": "2025-01"
    }
  ],
  "languages": [
    {
      "id": "lang_1",
      "name": "Language Name",
      "proficiency": "Native/Fluent/Professional/Basic"
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["Tech1", "Tech2"],
      "url": "project-url.com"
    }
  ],
  "parsing_confidence": 95,
  "parsing_notes": ["Any notes about unclear data or assumptions made"]
}`;

  const userPrompt = `CV Content (${fileType}):
${fileContent}

Extract all CV data and return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('CV parsing error:', error);
    throw new Error('Failed to parse CV: ' + (error.message || 'Unknown error'));
  }
}

export async function generateSuccessRoadmap(userData, goals) {
  const client = getGeminiAI();
  
  const systemPrompt = `You are a strategic career planner creating personalized success roadmaps. You MUST respond with valid JSON only.

Create an inspiring, achievable roadmap that breaks down big career goals into manageable milestones.

Return as JSON:
{
  "vision_statement": "A compelling vision of where they're heading",
  "timeline_weeks": number (estimated weeks to reach goal),
  "phases": [
    {
      "phase_number": 1,
      "phase_name": "Name of this phase",
      "duration_weeks": number,
      "theme": "The focus of this phase",
      "milestones": [
        {
          "title": "Milestone title",
          "description": "What this milestone involves",
          "success_criteria": "How they'll know it's complete",
          "estimated_hours": number,
          "difficulty": "easy/medium/hard",
          "celebration_suggestion": "How to celebrate completing this"
        }
      ],
      "skills_to_develop": ["Skills to work on"],
      "potential_challenges": ["Challenges they might face"],
      "motivation_tip": "Encouragement for this phase"
    }
  ],
  "quick_wins": ["3 things they can do TODAY to start"],
  "accountability_suggestions": ["Ways to stay on track"],
  "support_resources": ["Types of resources or support to seek"],
  "contingency_plans": ["What to do if things don't go as planned"],
  "celebration_milestones": ["Major moments to celebrate"],
  "inspiring_closing": "A motivating message about their journey ahead"
}`;

  const userPrompt = `User Profile:
${JSON.stringify(userData, null, 2)}

Career Goals:
${JSON.stringify(goals, null, 2)}

Create a personalized success roadmap. Return ONLY valid JSON.`;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
      contents: userPrompt,
    });

    const text = extractText(response);
    return parseJsonResponse(text);
  } catch (error) {
    console.error('Success roadmap error:', error);
    throw new Error('Failed to generate success roadmap: ' + (error.message || 'Unknown error'));
  }
}
