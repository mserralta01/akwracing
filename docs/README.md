# AKW Racing Academy

## Overview

AKW Racing Academy is a premier karting academy located in Wellington, FL that provides professional race training for aspiring racers of all skill levels. The academy partners with Piquet Race Park to offer a comprehensive racing education environment with state-of-the-art facilities and equipment.

## Application Purpose

This Next.js application serves as the official website and management system for AKW Racing Academy, providing:

1. **Public-facing website** - Showcasing academy offerings, facilities, and instructors
2. **Course management** - Browsing, enrollment, and management of racing courses
3. **Administrative tools** - For managing courses, instructors, facilities, and student data
4. **User authentication** - Secure access for students, parents, and administrators

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4.0
- **UI Components**: Shadcn UI, Radix UI, Framer Motion
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Forms**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Content Editing**: Tiptap Rich Text Editor

## Key Features

### Public Website
- **Homepage**: Hero section, academy information, benefits, programs, facilities, and contact form
- **Courses Directory**: Browse available racing courses by level and date
- **Instructor Profiles**: Information about racing instructors and their expertise
- **Facility Information**: Details about racing tracks and training centers
- **Team Information**: Academy staff and leadership

### Student Experience
- **Course Enrollment**: Registration for available racing programs
- **Equipment Management**: Access to racing equipment and gear
- **Calendar**: Schedule of classes, events, and racing competitions
- **Payment Processing**: Secure payment for courses and equipment

### Admin Portal
- **Course Management**: Create, edit, and delete course offerings
- **Student Management**: View and manage student information and progress
- **Instructor Scheduling**: Assign instructors to courses and sessions
- **Facility Management**: Manage information about training facilities
- **Content Management**: Update website content and information

## Application Structure

### Frontend Structure
- `app/`: Next.js app router pages and layouts
- `components/`: Reusable UI components
  - `admin/`: Administrative interface components
  - `auth/`: Authentication components
  - `courses/`: Course-related components
  - `enrollment/`: Enrollment process components
  - `equipment/`: Equipment management components
  - `facilities/`: Facility information components
  - `layout/`: Layout components
  - `navigation/`: Navigation components
  - `payment/`: Payment processing components
  - `sections/`: Homepage section components
  - `team/`: Team profile components
  - `ui/`: Base UI components from Shadcn UI
- `contexts/`: React context providers
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and services
  - `config/`: Configuration files
  - `constants/`: Application constants
  - `firebase/`: Firebase configuration and helpers
  - `services/`: API service functions
  - `utils/`: Utility helper functions
- `providers/`: React providers
- `public/`: Static assets
- `types/`: TypeScript type definitions

### Backend Services
- Firebase Authentication for user management
- Firestore for database storage
- Firebase Storage for file uploads
- Firebase Functions for serverless backend logic

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation
1. Clone the repository
2. Install dependencies with `npm install` or `yarn`
3. Set up environment variables in `.env.local`
4. Run the development server with `npm run dev` or `yarn dev`
5. Open [http://localhost:3000](http://localhost:3000) to view the application

### Environment Variables
The application requires several environment variables for Firebase and other service configurations:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## Development Guidelines

- Follow the TypeScript best practices for type safety
- Use React Hooks for state management
- Follow the component structure in the existing codebase
- Implement responsive designs using TailwindCSS
- Use Shadcn UI components for consistent UI
- Ensure Firebase security rules are properly configured
- Write comprehensive tests for critical functionality

## Deployment

The application is configured for deployment on Vercel or other Next.js-compatible hosting platforms. Firebase hosting can also be used with appropriate build configurations. 