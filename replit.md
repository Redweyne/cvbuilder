# CVForge - AI-Powered CV Builder

## Overview
CVForge is a revolutionary, breathtaking AI-powered CV builder designed to inspire job seekers and deliver on the promise of career transformation. The application features a visually stunning, motivational user experience that actively encourages users to pursue their dream jobs.

## Project Structure
- **Frontend Framework**: React 18 with Vite
- **Backend**: Express.js with SQLite database
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS with custom animations
- **Animations**: Framer Motion
- **UI Components**: Custom components in `src/components/ui/`
- **Icons**: Lucide React
- **AI**: Google Gemini Flash (gemini-2.5-flash model)

## Key Features
- CV creation and editing with live preview
- Job offer tracking and management
- AI-powered CV tailoring with Gemini
- Multiple professional templates
- ATS optimization scoring
- PDF export functionality
- User subscription management
- Achievement/badge system
- Career momentum tracking

## Design Philosophy
The application emphasizes:
- **Inspirational Messaging**: Career transformation language throughout
- **Micro-interactions**: Delightful animations and feedback
- **Celebration Moments**: Confetti effects on achievements
- **Visual Hierarchy**: Gradient-based design with glassmorphism effects
- **Motivational Elements**: Daily quotes, achievement badges, momentum tracking

## Directory Structure
```
src/
├── api/              # API client for backend communication
├── components/
│   ├── cv/          # CV-specific components (Editor, Preview, Forms)
│   └── ui/          # Reusable UI components (Button, Card, Input, etc.)
├── context/         # React contexts (AuthContext)
├── lib/             # Utility functions
├── pages/           # Application pages
├── App.jsx          # Main app component with routing
├── Layout.jsx       # Protected layout wrapper
├── main.jsx         # Entry point
└── index.css        # Global styles with custom animations

server/
├── index.js         # Express server with API routes
├── db.js            # SQLite database layer
├── ai.js            # Gemini AI integration
└── pdf.js           # PDF generation
```

## Pages

### Public Pages
- **Home**: Cinematic landing with floating particles, typing animation, success stats, testimonials
- **Login**: Beautiful auth page with floating orb animations and inspirational messaging
- **Register**: Career transformation journey onboarding

### Protected Pages
- **Dashboard**: Career momentum bar, daily quotes, achievements, quick actions, AI Career Coaching section
- **My CVs**: CV management with creation and editing
- **CV Editor**: Multi-step form with live preview
- **Job Offers**: Job tracking with status management
- **Templates**: CV template gallery
- **Tailor CV**: AI-powered CV customization with score rings
- **Settings**: User preferences
- **Billing**: Subscription management

### Revolutionary AI Career Coaching Pages
- **CareerDiscovery**: Immersive 5-question career story discovery experience with multi-step reflection questions, AI analysis of user responses to uncover golden threads, hidden superpowers, and professional identity
- **InterviewSimulator**: AI-powered mock interview system with real-time feedback, 5-question interview sessions, scoring on confidence/communication/relevance, personalized action plans
- **CareerMentor**: 24/7 conversational AI career coach with quick prompts, contextual advice, action items, and emotional support for job seekers
- **SuccessRoadmap**: Personalized career journey mapping with phased milestones, skill development tracking, celebration moments, and motivational guidance

## Custom CSS Animations
Located in `src/index.css`:
- `animate-shimmer`: Subtle shine effect
- `animate-float`: Floating particle movement
- `animate-gradient`: Background gradient animation
- `animate-pulse-glow`: Pulsing glow effect
- `text-gradient`: Gradient text effect
- `hero-gradient`: Background gradient patterns
- `glass`: Glassmorphism effect
- `card-hover`: Hover lift animation

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### CVs
- `GET /api/cvs` - List user CVs
- `POST /api/cvs` - Create CV
- `PUT /api/cvs/:id` - Update CV
- `DELETE /api/cvs/:id` - Delete CV

### AI Features
- `POST /api/ai/enhance-cv` - AI CV enhancement
- `POST /api/ai/tailor-cv` - Tailor CV for job
- `POST /api/ai/analyze-job` - Analyze job description
- `POST /api/ai/ats-score` - Calculate ATS score
- `POST /api/ai/discover-story` - Career story discovery from user reflections
- `POST /api/ai/mock-interview` - Conduct AI mock interview questions with feedback
- `POST /api/ai/interview-summary` - Generate comprehensive interview performance summary
- `POST /api/ai/mentor-chat` - Conversational AI career mentor chat
- `POST /api/ai/application-readiness` - Analyze job application readiness
- `POST /api/ai/success-roadmap` - Generate personalized career success roadmap

### Export
- `POST /api/export/cv-pdf` - Export CV to PDF

## Development
- **Dev Server**: `npm run dev` (frontend on 0.0.0.0:5000, backend on 3001)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key for AI features

## Recent Changes (December 3, 2025)

### Revolutionary AI Career Coaching Suite
1. **CareerDiscovery Page**: Immersive career story discovery experience
   - 5 carefully crafted reflection questions with themed gradients
   - Animated floating orbs and progress indicators
   - AI-powered analysis to uncover golden thread, hidden superpowers, professional identity
   - Beautiful phased reveal of discovered insights with animation
   - Generates unique value proposition and breakthrough insights

2. **InterviewSimulator Page**: AI-powered mock interview system
   - Select CV and target job for personalized questions
   - Real-time AI interviewer with thinking animations
   - Instant feedback on each answer with what worked well and areas to improve
   - 5-question interview sessions with STAR method tips
   - Comprehensive summary with scores for confidence, communication, relevance
   - Personalized action plan and readiness assessment

3. **CareerMentor Page**: 24/7 AI career coach
   - Conversational chat interface with mentor avatar
   - Quick prompt suggestions for common career concerns
   - Contextual advice based on user's CVs and job applications
   - Action items and encouragement in responses
   - Support for emotional wellbeing during job search

4. **SuccessRoadmap Page**: Personalized career journey mapping
   - Goal input with common goal suggestions
   - AI-generated phased roadmap with milestones
   - Skills to develop and potential challenges per phase
   - Quick wins to start today
   - Celebration milestones and inspiring closing messages

### Dashboard Enhancement
- New AI Career Coaching section with 4 feature cards
- Links to CareerDiscovery, InterviewSimulator, CareerMentor, SuccessRoadmap
- Beautiful gradient cards with hover animations

### AI Functions Added (server/ai.js)
- `discoverCareerStory()` - Analyzes reflection responses
- `conductMockInterview()` - Generates interview questions and feedback
- `generateInterviewSummary()` - Creates comprehensive interview performance report
- `careerMentorChat()` - Conversational career coaching
- `analyzeApplicationReadiness()` - Assesses job application readiness
- `generateSuccessRoadmap()` - Creates personalized career roadmap

### UI Transformation (Previous)
1. **Home Page**: Complete redesign with cinematic hero, floating particles, mouse-following gradients, typing animation for inspirational phrases, success stats, feature cards, testimonials section

2. **Dashboard**: Career momentum bar with levels (Ready to Begin → On Fire!), daily motivational quotes, achievement/badge system, improved stats cards, quick action cards

3. **Login/Register**: Floating orb animations, gradient accents, inspirational messaging, beautiful form styling with enhanced inputs

4. **TailorCV**: Step indicator visualization, animated score rings (SVG), celebration effects, beautiful result cards

### Technical Improvements
1. **AI Migration**: Switched from OpenAI to Google Gemini Flash
2. **Confetti System**: Proper cleanup with useState/useEffect pattern
3. **Performance**: Optimized animations and reduced DOM operations

## User Preferences
- Clean, modern design with gradient accents
- Inspirational and motivational tone
- Celebration moments for achievements
- Mobile-responsive design
- Using Google Gemini Flash (gemini-2.5-flash) for all AI features
