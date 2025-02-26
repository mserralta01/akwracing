#Invoice Management System

## Overview
A comprehensive invoice management system built to be sold as a sAAS platform to handle customer billing, payments, and financial operations. The application provides features for managing customers, creating and sending invoices, processing payments, and tracking transactions.

## Tech Stack

### Frontend
- **React 18.3.1** - Core UI framework
- **TypeScript** - Type safety and developer experience
- **Vite** - Build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Recharts** - Data visualization
- **TipTap** - Rich text editor for email templates

### Backend & Services
- **Firebase**
  - Authentication (Email/Password and Google Sign-In)
  - Firestore (Database)
  - Storage (File storage)
- **SendGrid** - Email service for invoice delivery
- **NMI (Network Merchants Inc)** - Payment processing

## Core Features

### Authentication
- Email/Password login
- Google OAuth integration
- Protected routes
- Session management

### Customer Management
- Customer profiles with detailed information
- Customer type categorization (Owner/Renter)
- Customer payment history
- Notes and preferences tracking

### Invoice Management
- Create, edit, and send invoices
- Line item management
- Tax calculation
- Professional PDF generation using @react-pdf/renderer
- Email delivery with customizable templates
- Payment status tracking

### Payment Processing
- Credit card processing
- ACH/Bank transfer support
- Virtual terminal for manual payments
- Platform fee handling
- Refund processing

### Transaction Management
- Transaction history
- Payment status tracking
- Refund management
- Detailed transaction records

### Email System
- Customizable email templates
- Rich text editor
- Template variables
- Preview functionality
- SendGrid integration

### Settings & Configuration
- Company profile management
- Payment settings
- Email template customization
- Tax rate configuration
- Invoice numbering settings

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   └── ...            # Feature-specific components
├── lib/               # Utility functions and service integrations
├── pages/             # Main application pages
├── types/             # TypeScript type definitions
└── styles/            # Global styles and Tailwind config
```

### Key Components

#### UI Components
- `Button`, `Card`, `Dialog`, `Input`, etc. - Base UI components built on Radix UI
- `EmailEditor` - Rich text editor for email templates
- `PaymentPreview` - Payment form preview
- `Layout` - Main application layout with navigation

#### Pages
- `Dashboard` - Overview and metrics
- `Customers` - Customer management
- `Invoices` - Invoice creation and management
- `VirtualTerminal` - Manual payment processing
- `Transactions` - Transaction history and management
- `Settings` - Application configuration

#### Services
- `firebase.ts` - Firebase configuration and initialization
- `api.ts` - API functions for data operations
- `email.ts` - Email service integration
- `nmi.ts` - Payment processing integration

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Implement proper error handling
- Add appropriate loading states
- Maintain type safety

### Component Guidelines
- Keep components focused and single-responsibility
- Use composition over inheritance
- Implement proper prop validation
- Handle loading and error states
- Use proper semantic HTML
- Ensure accessibility compliance

### State Management
- Use React Query for server state
- Use local state for UI-specific state
- Implement proper loading indicators
- Handle errors gracefully
- Cache data appropriately

### Security Considerations
- Implement proper authentication checks
- Use Firebase security rules
- Validate all user input
- Secure API endpoints
- Handle sensitive data properly
- Use environment variables for secrets

## Environment Setup

Required environment variables:
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_SENDGRID_API_KEY=
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`.
3. Set up environment variables
4. Start development server: `npm run dev`
5. Build for production: `npm run build`

## Future Improvements

### Planned Features
- Recurring invoices
- Batch invoice processing
- Advanced reporting
- Customer portal
- Mobile app integration
- Multi-currency support
- Inventory management
- API documentation
- Webhook integration
- Automated testing

### Technical Debt
- Implement comprehensive testing
- Add error boundaries
- Improve performance optimization
- Enhance accessibility
- Add documentation
- Implement CI/CD
- Add logging system
- Improve error handling

## Contributing

1. Follow the established code style
2. Write meaningful commit messages
3. Document changes and new features
4. Test thoroughly before submitting PRs
5. Keep PRs focused and single-purpose

## License
Proprietary software for Ocean Cruises LLC
