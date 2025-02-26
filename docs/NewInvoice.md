# NewInvoice Component Documentation

## Recent Changes (TypeScript Error Fixes)

### 1. Import Optimization
- Removed unused `ChevronsUpDown` import from lucide-react
- Kept `Check` import as it's used in checkbox components throughout the form

### 2. Form State Management
- Added proper handling for `isDirty` state to prevent data loss
- Implemented `beforeunload` event handler to warn users about unsaved changes
- State variables:
  ```typescript
  const [isDirty, setIsDirty] = useState(false);  // Tracks unsaved changes
  const [isSaved, setIsSaved] = useState(false);  // Tracks save state
  ```

### 3. Mutation Success Handling
- Added type annotation for `savedInvoice` in `updateInvoiceMutation`
- Added debug logging for successful invoice updates
- Success callback structure:
  ```typescript
  onSuccess: (savedInvoice: Invoice) => {
    queryClient.invalidateQueries({ queryKey: ['invoices'] });
    showNotification({
      title: "Success",
      message: "Invoice updated successfully",
      type: "success"
    });
    console.debug('Invoice updated:', savedInvoice.id);
  }
  ```

## Key Features

### Form Data Management
- Uses controlled form components
- Implements real-time validation
- Maintains form state with TypeScript interfaces
- Handles both new invoices and editing existing ones

### Line Item Management
- Dynamic addition/removal of line items
- Real-time total calculations
- Support for both product selection and manual entry
- Tax handling per line item

### Customer Integration
- Real-time customer search
- New customer creation capability
- Customer details auto-population

### Payment Methods
- Configurable payment method options
- Integration with company settings
- Support for multiple payment types:
  - Credit Card
  - PayPal
  - ACH
  - Check

### Data Persistence
- Auto-save functionality
- Draft state management
- Unsaved changes detection
- Navigation protection

## Important Notes

1. **Form State**: The component now includes protection against accidental navigation when there are unsaved changes.

2. **Type Safety**: All mutations and state updates are properly typed with TypeScript interfaces.

3. **Performance**: Uses React Query for efficient data fetching and cache management.

4. **User Experience**: Implements proper feedback mechanisms for all user actions.

## Future Considerations

1. Consider implementing auto-save functionality
2. Add form state persistence in localStorage
3. Implement undo/redo functionality
4. Add bulk line item operations 