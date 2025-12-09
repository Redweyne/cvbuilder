# CVForge - AI-Powered CV Builder

## Overview
CVForge is an AI-powered CV builder designed to inspire job seekers and facilitate career transformation. It offers a visually engaging and motivational user experience to help users create, manage, and optimize their CVs, track job offers, and access AI-driven career coaching. The project aims to empower users to pursue and achieve their dream jobs through advanced AI integration and user-centric design.

## User Preferences
- Clean, modern design with gradient accents
- Inspirational and motivational tone
- Celebration moments for achievements
- Mobile-responsive design
- Using Google Gemini Flash (gemini-2.5-flash) for all AI features
- Stay within Gemini API free tier limits (15 req/min, 1,500 req/day, 1M tokens/min)
- **CRITICAL: All templates must be absolutely identical everywhere in the app - including previews**

## Revolutionary Improvements Roadmap

### Phase 1: Fundamental Excellence ✅ COMPLETED
1. **Smart Guides & Snapping** ✅ COMPLETE
   - Elements snap to other elements, center lines, and edges
   - Visual guide lines appear when elements align
   - Snap to canvas center, edges, and other element edges/centers
   - Toggle button in toolbar + Alt key to temporarily disable

2. **Icon Library** ✅ COMPLETE
   - 100+ categorized professional icons (Lucide) in 10 categories
   - Categories: Contact, Social, Work, Education, Tech, Design, Arrows, Actions, Objects, Misc
   - Easy icon picker with search, integrated into toolbar
   - Icons are resizable and color-customizable

3. **Google Fonts Integration** ✅ COMPLETE
   - 50+ popular fonts from Google Fonts library
   - Font picker with search and category filters (Sans-serif, Serif, Display, Monospace)
   - Live font preview before selection
   - Fonts load on-demand for performance

4. **Alignment Tools** ✅ COMPLETE
   - Align left, center, right, top, middle, bottom
   - Distribute evenly (horizontal/vertical) for 3+ elements
   - Multi-select elements with Shift+Click
   - Works on single elements (align to canvas) or multiple elements

5. **Progress Bars & Skill Indicators** ✅ COMPLETE
   - Visual skill level bars with customizable progress (0-100%)
   - Skill label with optional percentage display
   - Customizable progress color and background color
   - Adjustable border radius for different styles

### Phase 2: Layout & Structure 🚧 IN PROGRESS
1. **Multi-page Support** ✅ COMPLETE
   - Add/remove pages with page navigator at bottom of canvas
   - Navigate between pages with prev/next buttons and page thumbnails
   - Duplicate pages functionality
   - Page management in DesignContext (addPage, deletePage, duplicatePage, goToPage, movePage)

2. **Page Margin Settings** ✅ COMPLETE
   - Configurable margins (top, right, bottom, left)
   - Preset margins: None, Narrow, Normal, Wide
   - Visual margin guides on canvas (blue dashed lines)
   - Toggle margin guides visibility
   - Page Settings dialog accessible from header

3. **Section Containers** ✅ COMPLETE
   - Groupable section containers with title
   - Customizable background color, border, padding
   - Optional section title display
   - "Drop elements here" placeholder

4. **Smart Columns** ✅ COMPLETE
   - Column layout element (1-4 columns)
   - Configurable column gap
   - Visual column placeholders
   - Properties panel controls for column count and gap

5. **Margin & Padding Controls** ⏳ PENDING
   - Add detailed padding controls (top, right, bottom, left) to PropertiesPanel
   - Add margin controls for elements

### Phase 3: Visual Excellence
- Color palette system with global variables
- Gradient backgrounds
- Advanced shapes (circles, arrows, badges, banners)
- Photo placeholders with masking
- Decorative dividers

### Phase 4: Export & UX Polish
- High-quality PDF export with custom DPI
- PNG/JPEG export
- Print preview mode
- Spacebar pan, scroll zoom
- Context menu (right-click)
- Element layers panel
- Keyboard shortcuts

## System Architecture
The application is built with a React 18 frontend using Vite, TanStack React Query for state management, Tailwind CSS with Framer Motion for styling and animations, and Lucide React for icons. The backend is an Express.js server interacting with an SQLite database.

**Key Features:**
- CV creation, editing with live preview, and PDF export.
- AI-powered CV import from PDF/DOCX, parsing content to populate forms.
- AI-driven CV tailoring for specific job descriptions and ATS optimization scoring.
- Comprehensive job offer tracking.
- Multiple professional CV templates.
- User subscription management and an achievement/badge system.
- Career momentum tracking.
- Revolutionary AI Career Coaching Suite including:
    - **CareerDiscovery**: Immersive career story discovery with AI analysis.
    - **InterviewSimulator**: AI-powered mock interviews with real-time feedback and action plans.
    - **CareerMentor**: 24/7 conversational AI career coach.
    - **SuccessRoadmap**: Personalized career journey mapping with milestones and skill development tracking.

**Design Philosophy:**
The design emphasizes inspirational messaging, delightful micro-interactions, celebration moments (e.g., confetti effects), strong visual hierarchy with gradients and glassmorphism, and motivational elements like daily quotes and achievement badges.

**UI/UX Decisions:**
- **Inspirational Messaging:** Language throughout the application promotes career transformation.
- **Micro-interactions & Celebration Moments:** Delightful animations and feedback, including confetti effects for achievements.
- **Visual Hierarchy:** Gradient-based design with glassmorphism effects for a modern look.
- **Custom Animations:** `animate-shimmer`, `animate-float`, `animate-gradient`, `animate-pulse-glow`, `text-gradient`, `hero-gradient`, `glass`, `card-hover` are used for dynamic and engaging UI elements.
- **PDF Export:** Pixel-perfect PDF generation using Puppeteer, rendering actual React templates in a headless browser to ensure consistency with the live preview.

**Core Pages:**
- **Public:** Home, Login, Register, designed with cinematic elements, floating particles, and inspirational messaging.
- **Protected:** Dashboard, My CVs, CV Editor, Job Offers, Templates, Tailor CV, Settings, Billing, and the AI Career Coaching pages (CareerDiscovery, InterviewSimulator, CareerMentor, SuccessRoadmap).

**API Endpoints:**
- **Authentication:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`.
- **CVs:** `GET /api/cvs`, `POST /api/cvs`, `PUT /api/cvs/:id`, `DELETE /api/cvs/:id`.
- **AI Features:** `POST /api/ai/enhance-cv`, `POST /api/ai/tailor-cv`, `POST /api/ai/analyze-job`, `POST /api/ai/ats-score`, `POST /api/ai/discover-story`, `POST /api/ai/mock-interview`, `POST /api/ai/interview-summary`, `POST /api/ai/mentor-chat`, `POST /api/ai/application-readiness`, `POST /api/ai/success-roadmap`, `POST /api/ai/parse-cv`.
- **Export:** `POST /api/export/cv-pdf`.

## External Dependencies
- **AI:** Google Gemini Flash (specifically `gemini-2.5-flash` model) for all AI-powered features.
- **Database:** SQLite for backend data storage.
- **PDF Parsing:** `pdf-parse` library for extracting text from PDF files.
- **DOCX Parsing:** `mammoth` library for extracting text from DOCX files.
- **PDF Generation:** Puppeteer for headless browser-based pixel-perfect PDF export.

## Template Consistency Rule
**CRITICAL:** All CV templates must render identically across the entire application:
- Templates page previews
- CVDesigner template selector
- Actual canvas rendering
- PDF export

Use a single shared template renderer component (`TemplatePreview`) to ensure consistency.