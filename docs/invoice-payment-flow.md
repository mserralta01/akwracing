# Invoice Payment Flow

## Overview
This document describes the invoice payment flow, specifically how customers can view and pay invoices through email links, and how invoice status changes throughout its lifecycle.

## Invoice Lifecycle States

1. **Draft**
   - Initial state when the invoice is created
   - Can be edited freely
   - Not visible to customers yet

2. **Sent**
   - Invoice has been emailed to the customer
   - Can still be edited if needed
   - Payment link is active

3. **Past Due**
   - Invoice due date has passed by at least one day
   - System automatically changes status from 'sent' to 'overdue'
   - Creates a transaction record with 'overdue' status
   - Displays a "PAST DUE" solid red label/watermark in the interface
   - Can still be edited and paid

4. **Paid**
   - Customer has completed payment
   - Cannot be edited (read-only mode)
   - Attempting to edit redirects to preview mode

## Flow Description

1. **Email Generation**
   - When an invoice is sent via email, a unique payment link is generated
   - The link format is: `{APP_URL}/pay/{invoiceId}`
   - The link is embedded in the email template using the `{{paymentLink}}` variable

2. **Invoice Viewing**
   - When a customer clicks the link, they are taken to the payment page
   - The page displays:
     - A preview of the invoice
     - Payment options with associated fees
   - If the invoice is not found, a user-friendly error page is shown

3. **Payment Processing**
   - Customers can choose between:
     - Credit Card payment (with platform fee if enabled)
     - Bank Account payment (no platform fee)
   - Payment is processed securely through the NMI payment gateway
   - After successful payment:
     - The invoice is marked as paid
     - A confirmation email is sent to the customer

4. **Past Due Handling**
   - System automatically checks invoice due dates
   - Invoices past their due date by at least one day are marked as 'overdue'
   - Transaction records are created for tracking
   - The UI displays these invoices with "PAST DUE" labels

5. **Edit Protection**
   - Paid invoices are protected from editing:
     - Edit button is replaced with a View button in the invoice list
     - Directly accessing the edit URL for a paid invoice redirects to preview mode
     - A notification informs the user that paid invoices cannot be edited

## Technical Implementation

### Routes
- `/pay/[invoiceId]` - Main payment page
- `/pay/[invoiceId]/not-found` - 404 error page for invalid invoices
- `/invoices/edit/[invoiceId]` - Edit page with protection for paid invoices

### Components
- `InvoicePreview` - Displays the invoice details
- `PaymentPreview` - Handles payment method selection and processing
- `NewInvoice` - Unified component for creating/editing with paid invoice protection

### Security Considerations
- Invoice IDs are validated server-side
- Payment processing uses secure NMI tokenization
- All sensitive data is handled according to PCI compliance standards
- Paid invoices are protected from unauthorized modifications

## Customization
The payment page respects company settings for:
- Invoice styling and branding
- Platform fee settings
- Available payment methods
- Email templates and notifications

## Error Handling
- Invalid invoice IDs show a user-friendly error page
- Payment processing errors are handled gracefully
- Network errors show appropriate error messages
- Redirect loops are prevented when handling paid invoice edit attempts

## Future Improvements
- Add support for partial payments
- Implement payment plans/installments
- Add support for multiple currencies
- Enhance mobile responsiveness 
- Implement automated reminder emails for past due invoices 