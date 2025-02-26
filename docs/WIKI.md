# Invoice System Documentation

## Overview
The invoice system allows users to create, customize, and send professional invoices to customers. Invoices can be previewed, downloaded as PDFs, and sent via email.

## Features

### Invoice Management
- Unified invoice creation and editing interface
- Consistent user experience for both new and existing invoices
- Seamless transition between creating and editing modes
- Maintains all invoice data and settings when editing
- Visual status indicators for tracking invoice lifecycle (draft, sent, paid, past due)
- Protection against editing paid invoices
- Automatic detection and marking of past due invoices

### Invoice Customization
- Company logo
- Color schemes
- Multiple templates (modern, classic, minimal)
- Custom watermarks
- Configurable header and footer text

### Invoice Generation
- Preview functionality in settings
- PDF generation using @react-pdf/renderer for consistent styling
- Email sending with customizable templates
- Perfect consistency between preview and downloaded versions

## Technical Implementation

### Invoice Component Architecture
The invoice system uses a unified component approach:
- Single `NewInvoice.tsx` component handles both creation and editing
- Automatic mode detection based on URL parameters
- Seamless state management between modes
- Consistent UI/UX across all invoice operations
- Color-coded status indicators for better visual tracking ([Invoice Status Indicators](./invoice-status-indicators.md))
- Edit protection for paid invoices with graceful redirection to preview mode

### Invoice Lifecycle Management
The system automatically manages invoice state transitions:
- **Draft → Sent**: When an invoice is emailed to a customer
- **Sent → Past Due**: One day after the due date has passed without payment
- **Sent/Past Due → Paid**: When payment is successfully processed
- Past due invoices are automatically detected and marked
- Transaction records are created for past due invoices
- Paid invoices are protected from modification

### Invoice Preview
The preview functionality uses React components with Tailwind CSS for styling. The main component is `InvoicePreview.tsx` which handles the rendering of invoices in the browser.

### PDF Generation
PDF generation is exclusively implemented using @react-pdf/renderer through the Next.js API route. This ensures perfect consistency between the preview and downloaded PDF by:

1. Using the same component (`InvoicePDF.tsx`) for both preview and PDF generation
2. Maintaining consistent styling configurations
3. Applying the same company settings and branding
4. Utilizing shared templates and styling logic

The PDF generation process:
1. Client requests a PDF download
2. Request is handled by `/api/invoices/download` Next.js API route
3. Route fetches invoice and company data
4. InvoicePDF React component renders the PDF
5. PDF is streamed back to the client

### Email System
The invoice email system allows sending invoices directly to customers via email. For detailed information on the implementation and recent fixes, see [Invoice Email System](./invoice-email-system.md).

### API Endpoints
- `/api/invoices/download` - Generates and serves PDF versions of invoices using @react-pdf/renderer
- `/api/email` - Handles sending invoice emails and updating their status
- Company settings and invoice data are fetched server-side to ensure consistency

## Usage
1. Configure invoice settings in the Settings/Invoices section
2. Create new invoices using the invoice creation form
3. Edit existing invoices using the same form interface (except for paid invoices)
4. Preview invoices before sending
5. Download PDF versions that match the preview exactly
6. Send invoices to customers via email
7. Monitor invoice status through color-coded indicators

## Recent Changes
- Unified invoice creation and editing into a single component
- Standardized PDF generation to exclusively use @react-pdf/renderer
- Enhanced template system for better customization
- Improved styling consistency across all formats
- Added support for custom branding and watermarks
- Fixed email sending functionality with proper URL resolution and server-side implementation (see [Invoice Email System](./invoice-email-system.md))
- Added collapsible Invoice Timeline with a toggle arrow, defaulting to collapsed state for better UI organization
- Changed past due styling to solid red for better visibility
- Updated terminology from "OVERDUE" to "PAST DUE" for consistency
- Added automatic detection of past due invoices one day after the due date
- Implemented protection against editing paid invoices
