# Invoice Email System

## Overview

The invoice email system allows users to send professional-looking invoices to customers via email. The system integrates with SendGrid for reliable email delivery and updates the invoice status in the database.

## Issue & Resolution - February 2024

### Issue Description

There was an issue where attempting to send an invoice email from the preview portal resulted in a 404 error. The specific error was:

```
POST https://www.secured-payment-processing.com/api/email 404 (Not Found)
```

This occurred because the application was attempting to make API requests to the wrong domain due to URL resolution issues.

### Root Causes

1. **Incorrect URL Resolution**: The relative URL `/api/email` was being resolved against the `https://www.secured-payment-processing.com` domain instead of the application's origin, likely caused by the application running in an iframe or after a redirect.

2. **Missing Server Endpoint**: The Express server had a test endpoint (`/api/email/test`) but was missing the production endpoint (`/api/email`).

### Solution Implemented

Several changes were made to fix this issue:

#### 1. URL Resolution Fix in Email Library

Updated `src/lib/email.ts` to explicitly use the correct origin for API requests:

```typescript
// Before
const response = await fetch('/api/email', {
  // request configuration
});

// After
const apiUrl = new URL('/api/email', window.location.origin).toString();
console.log('Making API request to:', apiUrl);
    
const response = await fetch(apiUrl, {
  // request configuration
});
```

This ensures that API requests are always made to the correct server regardless of the current URL context.

#### 2. Consistent API Request in EmailEditor Component

Updated `src/components/EmailEditor.tsx` to use the same URL construction approach for test emails:

```typescript
// Ensure we're using the correct origin for the API request
const apiUrl = new URL('/api/email', window.location.origin).toString();
console.log('Making API request to:', apiUrl);

const response = await fetch(apiUrl, {
  // request configuration
});
```

#### 3. Added Production Email Endpoint to Express Server

Added a new `/api/email` endpoint to `server.js` that mirrors the functionality of the Next.js API route:

```javascript
app.post('/api/email', async (req, res) => {
  try {
    const { invoice, template, subject } = req.body;

    // Validate request data
    if (!invoice || !invoice.companyId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data'
      });
    }

    // Get company settings for SendGrid
    const companyDoc = await db.collection('companies').doc(invoice.companyId).get();
    // ... validation and email sending logic ...

    // Send email using SendGrid
    // ... SendGrid API call ...

    // Create activity record and update invoice status
    // ... database updates ...

    return res.json({ 
      success: true,
      updatedInvoice
    });
  } catch (error) {
    // Error handling
  }
});
```

This endpoint handles:
- Email sending via SendGrid
- Creating an activity record
- Updating the invoice status in the database
- Returning the updated invoice data

## System Architecture

The invoice email flow follows these steps:

1. **User Interface**: The user clicks "Send Invoice" in the `InvoiceEmailDialog` component
2. **Email Preparation**: 
   - The system prepares a template with customer and invoice details
   - Payment links are generated
   - Email subject is created from the template
3. **API Request**: 
   - The `sendInvoiceEmail` function makes a POST request to `/api/email` with:
     - Invoice data
     - Email template
     - Subject
4. **Server Processing**:
   - The server validates the request
   - Gets SendGrid credentials from company settings
   - Sends the email via SendGrid
   - Creates an activity record
   - Updates the invoice status to 'sent'
5. **Response Handling**:
   - Success/failure is reported to the user
   - The invoice preview dialog is closed on success

## Best Practices for Email Integration

1. **Always use absolute URLs** for API endpoints to prevent resolution issues
2. **Include detailed logging** for debugging email sending problems
3. **Validate all input data** before sending emails
4. **Provide clear error messages** to users when email sending fails
5. **Track email activities** to maintain a history of communications

## Testing the Email System

To test the invoice email system:

1. Configure SendGrid API credentials in the company settings
2. Create a draft invoice with valid customer information
3. Preview the invoice and click "Send Invoice"
4. Check the activity timeline to verify the email was sent (click the expand arrow if the timeline is collapsed)
5. For development testing, use the test email feature in the template editor 