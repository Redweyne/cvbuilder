import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import { users, cvDocuments, jobOffers, subscriptions, templates, coverLetters } from './db.js';
import { 
  enhanceCV, 
  analyzeJobOffer, 
  tailorCVForJob, 
  generateCoverLetter, 
  calculateATSScore,
  discoverCareerStory,
  conductMockInterview,
  generateInterviewSummary,
  careerMentorChat,
  analyzeApplicationReadiness,
  generateSuccessRoadmap
} from './ai.js';
import { generateCVPdf, generateCoverLetterPdf } from './pdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.SESSION_SECRET || 'cvforge-secret-key-change-in-production';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
}));

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.cookies?.token || req.session?.token;
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const existing = users.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = users.create(email, password, fullName || email.split('@')[0]);
    const token = generateToken(user);
    
    req.session.token = token;
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (!users.validatePassword(user, password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const token = generateToken(user);
    req.session.token = token;
    res.cookie('token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    
    res.json({ 
      user: { id: user.id, email: user.email, full_name: user.full_name },
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = users.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/cvs', authMiddleware, (req, res) => {
  try {
    const cvs = cvDocuments.findByUserId(req.user.id);
    res.json(cvs);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    res.status(500).json({ error: 'Failed to fetch CVs' });
  }
});

app.get('/api/cvs/:id', authMiddleware, (req, res) => {
  try {
    const cv = cvDocuments.findById(req.params.id);
    if (!cv || cv.user_id !== req.user.id) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ error: 'Failed to fetch CV' });
  }
});

app.post('/api/cvs', authMiddleware, (req, res) => {
  try {
    const cv = cvDocuments.create(req.user.id, req.body);
    res.status(201).json(cv);
  } catch (error) {
    console.error('Error creating CV:', error);
    res.status(500).json({ error: 'Failed to create CV' });
  }
});

app.put('/api/cvs/:id', authMiddleware, (req, res) => {
  try {
    const cv = cvDocuments.update(req.params.id, req.user.id, req.body);
    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.json(cv);
  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({ error: 'Failed to update CV' });
  }
});

app.delete('/api/cvs/:id', authMiddleware, (req, res) => {
  try {
    const deleted = cvDocuments.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'CV not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ error: 'Failed to delete CV' });
  }
});

app.get('/api/jobs', authMiddleware, (req, res) => {
  try {
    const jobs = jobOffers.findByUserId(req.user.id);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/:id', authMiddleware, (req, res) => {
  try {
    const job = jobOffers.findById(req.params.id);
    if (!job || job.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

app.post('/api/jobs', authMiddleware, (req, res) => {
  try {
    const job = jobOffers.create(req.user.id, req.body);
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

app.put('/api/jobs/:id', authMiddleware, (req, res) => {
  try {
    const job = jobOffers.update(req.params.id, req.user.id, req.body);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

app.delete('/api/jobs/:id', authMiddleware, (req, res) => {
  try {
    const deleted = jobOffers.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

app.get('/api/templates', (req, res) => {
  try {
    const allTemplates = templates.findAll();
    res.json(allTemplates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

app.get('/api/subscription', authMiddleware, (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    res.json(sub || { plan: 'free', ai_credits_used: 0, ai_credits_limit: 5, exports_used: 0, exports_limit: 3 });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

app.post('/api/ai/enhance-cv', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const enhanced = await enhanceCV(req.body.cvData);
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(enhanced);
  } catch (error) {
    console.error('AI enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance CV with AI' });
  }
});

app.post('/api/ai/analyze-job', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const analysis = await analyzeJobOffer(req.body.description);
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(analysis);
  } catch (error) {
    console.error('Job analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze job offer' });
  }
});

app.post('/api/ai/tailor-cv', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const tailored = await tailorCVForJob(req.body.cvData, req.body.jobData);
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(tailored);
  } catch (error) {
    console.error('CV tailoring error:', error);
    res.status(500).json({ error: 'Failed to tailor CV' });
  }
});

app.post('/api/ai/cover-letter', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const coverLetter = await generateCoverLetter(req.body.cvData, req.body.jobData, req.body.tone);
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(coverLetter);
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ error: 'Failed to generate cover letter' });
  }
});

app.post('/api/ai/ats-score', authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const score = await calculateATSScore(req.body.cvData);
    res.json(score);
  } catch (error) {
    console.error('ATS scoring error:', error);
    res.status(500).json({ error: 'Failed to calculate ATS score' });
  }
});

app.post('/api/ai/discover-story', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const story = await discoverCareerStory(req.body.responses);
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(story);
  } catch (error) {
    console.error('Career story discovery error:', error);
    res.status(500).json({ error: 'Failed to discover career story' });
  }
});

app.post('/api/ai/mock-interview', authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const result = await conductMockInterview(
      req.body.cvData, 
      req.body.jobData, 
      req.body.userAnswer, 
      req.body.questionIndex
    );
    
    res.json(result);
  } catch (error) {
    console.error('Mock interview error:', error);
    res.status(500).json({ error: 'Failed to conduct mock interview' });
  }
});

app.post('/api/ai/interview-summary', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const summary = await generateInterviewSummary(
      req.body.cvData, 
      req.body.jobData, 
      req.body.interviewHistory
    );
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(summary);
  } catch (error) {
    console.error('Interview summary error:', error);
    res.status(500).json({ error: 'Failed to generate interview summary' });
  }
});

app.post('/api/ai/mentor-chat', authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const response = await careerMentorChat(
      req.body.message, 
      req.body.context, 
      req.body.conversationHistory
    );
    
    res.json(response);
  } catch (error) {
    console.error('Career mentor error:', error);
    res.status(500).json({ error: 'Failed to get mentor response' });
  }
});

app.post('/api/ai/application-readiness', authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const analysis = await analyzeApplicationReadiness(req.body.cvData, req.body.jobData);
    
    res.json(analysis);
  } catch (error) {
    console.error('Application readiness error:', error);
    res.status(500).json({ error: 'Failed to analyze application readiness' });
  }
});

app.post('/api/ai/success-roadmap', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.ai_credits_used >= sub.ai_credits_limit) {
      return res.status(403).json({ error: 'AI credits exhausted. Please upgrade your plan.' });
    }
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'AI service not configured. Please add your Gemini API key.' });
    }
    
    const roadmap = await generateSuccessRoadmap(req.body.userData, req.body.goals);
    subscriptions.incrementAICredits(req.user.id);
    
    res.json(roadmap);
  } catch (error) {
    console.error('Success roadmap error:', error);
    res.status(500).json({ error: 'Failed to generate success roadmap' });
  }
});

app.post('/api/export/cv-pdf', authMiddleware, async (req, res) => {
  try {
    const sub = subscriptions.findByUserId(req.user.id);
    if (sub.exports_used >= sub.exports_limit && sub.plan === 'free') {
      return res.status(403).json({ error: 'Export limit reached. Please upgrade your plan.' });
    }
    
    const pdfBytes = await generateCVPdf(req.body.cvData, req.body.templateId);
    subscriptions.incrementExports(req.user.id);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${req.body.cvData?.title || 'cv'}.pdf"`);
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
});

app.post('/api/export/cover-letter-pdf', authMiddleware, async (req, res) => {
  try {
    const pdfBytes = await generateCoverLetterPdf(req.body.content, req.body.applicantName);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="cover-letter.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Cover letter PDF export error:', error);
    res.status(500).json({ error: 'Failed to export cover letter PDF' });
  }
});

app.get('/api/cover-letters', authMiddleware, (req, res) => {
  try {
    const letters = coverLetters.findByUserId(req.user.id);
    res.json(letters);
  } catch (error) {
    console.error('Error fetching cover letters:', error);
    res.status(500).json({ error: 'Failed to fetch cover letters' });
  }
});

app.post('/api/cover-letters', authMiddleware, (req, res) => {
  try {
    const letter = coverLetters.create(req.user.id, req.body);
    res.status(201).json(letter);
  } catch (error) {
    console.error('Error creating cover letter:', error);
    res.status(500).json({ error: 'Failed to create cover letter' });
  }
});

app.put('/api/cover-letters/:id', authMiddleware, (req, res) => {
  try {
    const letter = coverLetters.update(req.params.id, req.user.id, req.body);
    if (!letter) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }
    res.json(letter);
  } catch (error) {
    console.error('Error updating cover letter:', error);
    res.status(500).json({ error: 'Failed to update cover letter' });
  }
});

app.delete('/api/cover-letters/:id', authMiddleware, (req, res) => {
  try {
    const deleted = coverLetters.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Cover letter not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    res.status(500).json({ error: 'Failed to delete cover letter' });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CVForge server running on http://0.0.0.0:${PORT}`);
});
