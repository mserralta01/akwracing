# File Structure Guidelines for AKW Racing Academy

This application follows a structured organization to maintain clean code and separation of concerns:

## Directory Structure

- `app/`: Next.js app router pages and layouts
  - Organized by route paths (courses, admin, instructors, etc.)
  - Each route folder contains its own page.tsx and components
  
- `components/`: Reusable UI components
  - Domain-specific components are grouped in subfolders (admin, courses, etc.)
  - General UI components are in the ui/ folder (based on shadcn/ui)
  
- `lib/`: Utilities, services, and business logic
  - `services/`: Contains API service functions for data operations
  - `firebase/`: Firebase configuration and helpers
  - `utils/`: General utility functions
  - `constants/`: Application-wide constants
  
- `types/`: TypeScript type definitions
  - Shared types used throughout the application
  
- `contexts/`: React context providers
  - State management for application-wide state
  
- `hooks/`: Custom React hooks
  - Reusable logic and functionality
  
- `public/`: Static assets
  - Images, icons, and other static files

## File Naming Conventions

- Components: PascalCase (e.g., CourseCard.tsx)
- Utilities/Hooks: camelCase (e.g., useAuth.ts)
- Pages: page.tsx (Next.js app router convention)
- Layouts: layout.tsx (Next.js app router convention)
- Constants: UPPER_SNAKE_CASE for constant values

## Component Structure

Components should follow this structure:
- Import statements
- Type definitions (if not imported)
- Component function declaration
- Return statement with JSX
- Export statement

## Data Fetching

- Use TanStack Query (React Query) for data fetching
- Service functions in lib/services/ handle the actual API calls
- Firebase operations should be abstracted in service functions 