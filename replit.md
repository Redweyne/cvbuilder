# CVForge - AI-Powered CV Builder

## Overview
CVForge is a React-based web application that helps users create stunning, ATS-optimized CVs tailored to specific job applications. The application uses AI to transform experience into interview-winning content.

## Project Structure
- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: TanStack React Query
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: Custom components in `src/components/ui/`
- **Icons**: Lucide React

## Key Features
- CV creation and editing
- Job offer tracking
- AI-powered CV tailoring
- Multiple professional templates
- ATS optimization
- Export functionality
- User subscription management

## Directory Structure
```
src/
├── api/              # Base44 client and API layer
├── components/
│   ├── cv/          # CV-specific components
│   └── ui/          # Reusable UI components
├── entities/        # Data models (JSON schemas)
├── lib/             # Utility functions
├── pages/           # Application pages
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Pages
- **Home**: Landing page with features and CTAs
- **Dashboard**: User overview with stats
- **My CVs**: CV management
- **CV Editor**: CV creation/editing interface
- **Job Offers**: Job tracking and management
- **Templates**: CV template gallery
- **Tailor CV**: AI-powered CV customization
- **Settings**: User preferences
- **Billing**: Subscription management

## Data Storage
The application uses localStorage for data persistence via a custom Base44 client implementation that mimics an ORM-like interface.

## Development
- **Dev Server**: `npm run dev` (runs on 0.0.0.0:5000)
- **Build**: `npm run build`
- **Preview**: `npm run preview`

## Deployment
Configured for static site deployment:
- Build command: `npm run build`
- Output directory: `dist`
- Deployment type: Static

## Environment Setup
The project is configured to run in the Replit environment with:
- Vite configured for host 0.0.0.0:5000
- Proper HMR settings for iframe preview
- Tailwind CSS for styling

## Recent Changes (December 3, 2025)
- Set up complete Base44 React application structure
- Created custom Base44 client with localStorage persistence
- Implemented all required UI components
- Configured Vite for Replit environment
- Fixed file naming issues (PersonalInfoForm)
- Added all missing dependencies (date-fns, sonner)
- Configured deployment settings
- Successfully tested application startup
