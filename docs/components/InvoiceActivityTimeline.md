# Invoice Activity Timeline Component

## Overview
The InvoiceActivityTimeline component displays a chronological list of activities related to an invoice, such as creation, edits, emails sent, payment status changes, etc. The component is collapsible to save screen space and only shows the most recent activity by default.

## Features
- Collapsible UI with toggle arrow in the top-right corner
- Collapsed by default, showing only the most recent activity
- Expandable to show the complete history
- Visual indicators (icons and colors) for different activity types
- Detailed metadata for each activity when available
- Timestamp display for each activity
- Responsive design that works on various screen sizes

## Usage
```tsx
import { InvoiceActivityTimeline } from '@/components/InvoiceActivityTimeline';

// In your component:
<Card className="p-6 mb-6">
  <InvoiceActivityTimeline activities={invoiceActivities} />
</Card>
```

## Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| activities | InvoiceActivity[] | Yes | Array of activity records to display |
| className | string | No | Optional CSS class names to apply to the component |

## Activity Types
The component supports the following activity types, each with its own icon and color:
- `created` - Blue, FileText icon
- `sent` - Green, Send icon
- `viewed` - Purple, Eye icon
- `paid` - Emerald, CreditCard icon
- `overdue` - Amber, AlertTriangle icon
- `cancelled` - Red, XCircle icon
- `edited` - Gray, PenTool icon

## Interaction
- Click the chevron arrow in the top-right to expand/collapse the timeline
- When collapsed, a "Show X more activities" button appears if there are multiple activities
- Both the chevron and the text button can be used to expand the timeline

## Styling
- Uses Tailwind CSS for styling
- Implements a smooth transition animation when expanding/collapsing
- Shows a gradient fade at the bottom when collapsed to indicate more content
- Activity items are clearly separated with a vertical timeline line

## Accessibility
- Proper ARIA labels on interactive elements
- Maintains good color contrast for readability
- Keyboard navigable for all interactive elements

## Example
When an invoice is created, sent via email, and then paid, the timeline would show these activities in reverse chronological order (newest first). By default, only the payment activity would be visible, with an option to expand and see the email and creation activities. 