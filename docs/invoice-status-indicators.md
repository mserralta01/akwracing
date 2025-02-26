# Invoice Status Indicators

## Overview
This document describes the visual indicators used for different invoice statuses in the invoice system.

## Status Types

The invoice system uses the following statuses to track the lifecycle of an invoice:

| Status | Description | Visual Indicator |
|--------|-------------|------------------|
| `draft` | Invoice has been created but not yet sent to the customer | Yellow badge |
| `sent` | Invoice has been emailed to the customer but not yet paid | Blue badge |
| `paid` | Invoice has been paid by the customer | Green badge |
| `overdue` | Invoice payment deadline has passed without payment | Solid Red badge (displays as "PAST DUE") |
| `cancelled` | Invoice has been cancelled and is no longer valid | Gray badge (when implemented) |

## Color Coding

The system uses consistent color coding across the application to provide visual cues about invoice status:

### In the Invoices Table

- **Draft**: `bg-yellow-100 text-yellow-800` - Yellow background with dark yellow text
- **Sent**: `bg-blue-100 text-blue-800` - Blue background with dark blue text
- **Paid**: `bg-green-100 text-green-800` - Green background with dark green text
- **Past Due**: `bg-red-600 text-white` - Solid red background with white text

### In the Transaction Table
- **Past Due**: `bg-red-600 text-white` - Solid red background with white text
- **Paid**: `bg-green-100 text-green-800` - Green background with dark green text
- **Failed**: `bg-red-100 text-red-800` - Light red background with dark red text
- **Refunded**: `bg-yellow-100 text-yellow-800` - Yellow background with dark yellow text

### Color Meaning

The color scheme follows standard visual conventions:

- **Yellow**: Attention needed - the invoice is in progress and requires action (sending)
- **Blue**: In process - the invoice has been sent and is awaiting payment
- **Green**: Success - the invoice has been successfully paid
- **Red**: Warning - the invoice is past due and requires immediate attention

## Implementation Details

The status indicators are implemented as rounded badges with appropriate color schemes using Tailwind CSS classes. The current implementation can be found in:
- `src/pages/Invoices.tsx` - Status badges in the invoice listing
- `src/pages/Transactions.tsx` - Status badges in the transactions listing
- `src/components/InvoicePreview.tsx` - Watermark for past due invoices

## Past Due Detection

Invoices are automatically flagged as past due when:
1. The current date is at least one day after the invoice due date
2. The invoice status is currently 'sent' or 'draft'

When an invoice is marked as past due:
1. Its status is updated to 'overdue' in the database
2. A transaction record is created with the 'overdue' status
3. The UI displays "PAST DUE" instead of "OVERDUE" for consistency

## Related Documentation

- [Database Documentation](./db.md) - Contains full details of invoice status fields
- [Invoice Payment Flow](./invoice-payment-flow.md) - Details the flow from sending to payment
- [Invoice Email System](./invoice-email-system.md) - Explains how invoices are sent via email 