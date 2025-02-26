# Changelog

This document tracks significant changes to the Invoicing System.

## February 2024

### Past Due Invoice Improvements (March 1, 2024)

**Changes:**
- Updated invoice status display to use "PAST DUE" instead of "OVERDUE" across the application
- Changed past due status styling to solid red (`bg-red-600 text-white`) for better visibility
- Modified past due detection to trigger the day after the due date (not on the due date itself)
- Added transaction record creation for past due invoices
- Ensured consistent display of past due status in all components:
  - Invoice list
  - Transaction list
  - Invoice preview watermark

**Affected Components:**
- `src/pages/Invoices.tsx`
- `src/pages/Transactions.tsx`
- `src/components/InvoicePreview.tsx`

For detailed information, see [Invoice Status Indicators](./invoice-status-indicators.md).

### Invoice Status Visual Enhancements (February 28, 2024)

**Changes:**
- Added distinct blue color for "sent" invoice status (`bg-blue-100 text-blue-800`)
- Improved visual differentiation between invoice statuses (draft, sent, paid, overdue)
- Created comprehensive documentation for status indicators
- Updated invoice status transitions to automatically set "sent" status when emailing invoices

**Affected Components:**
- `src/pages/Invoices.tsx`
- `src/components/InvoiceEmailDialog.tsx`
- `src/pages/NewInvoice.tsx`

For detailed information, see [Invoice Status Indicators](./invoice-status-indicators.md).

### Email System Fixes (February 25, 2024)

**Issue:** Invoice emails were failing with a 404 error when using the "Send Invoice" feature.

**Affected Components:**
- `src/lib/email.ts`
- `src/components/EmailEditor.tsx`
- `server.js`

**Changes:**
1. Fixed URL resolution in email requests by explicitly using window.location.origin
2. Added a production email endpoint to the Express server
3. Improved error handling and logging for email sending
4. Ensured consistent URL construction across components

For detailed information, see [Invoice Email System Documentation](./invoice-email-system.md).

### Invoice Flow Improvements (February 24, 2024)

**Changes:**
- Unified invoice creation and editing interface
- Standardized invoice PDF generation
- Enhanced invoice template system
- Added protection to prevent editing of paid invoices

For detailed information, see [Invoice Payment Flow](./invoice-payment-flow.md).

## Future Planned Improvements

- Further improvements to email templating system
- Enhanced tracking of email delivery and opens
- Better integration with payment processing system
- Automated reminder emails for past due invoices 