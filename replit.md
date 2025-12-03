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
- **Dashboard**: Career momentum bar, daily quotes, achievements, quick actions
- **My CVs**: CV management with creation and editing
- **CV Editor**: Multi-step form with live preview
- **Job Offers**: Job tracking with status management
- **Templates**: CV template gallery
- **Tailor CV**: AI-powered CV customization with score rings
- **Settings**: User preferences
- **Billing**: Subscription management

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

### Export
- `POST /api/export/cv-pdf` - Export CV to PDF

## Development
- **Dev Server**: `npm run dev` (frontend on 0.0.0.0:5000, backend on 3001)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Environment Variables
- `GEMINI_API_KEY`: Google Gemini API key for AI features

## Recent Changes (December 3, 2025)

### UI Transformation
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
