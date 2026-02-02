# Checkout Components Documentation

This directory contains modular checkout components that recreate the exact HTML structure from the original scheme.html file. Each component maintains the original class names and data attributes for styling and functionality consistency.

## Component Structure

### 1. CheckoutHeader.js
- **Purpose**: Navigation header with back button
- **Props**: `backUrl` (optional, defaults to '/')
- **Features**: Router-based navigation

### 2. OrderSummary.js
- **Purpose**: Displays event information and selected seat details
- **Props**: `eventData`, `selectedSeats`
- **Features**: Dynamic event info, seat listing with categories and positions

### 3. TicketDelivery.js
- **Purpose**: Shows ticket delivery method and email
- **Props**: `email`
- **Features**: Email display with popover support

### 4. CustomerFields.js
- **Purpose**: Additional consent checkboxes
- **Props**: `onConsentChange` (callback)
- **Features**: Controlled checkbox state with validation

### 5. Terms.js
- **Purpose**: Terms and conditions agreement
- **Props**: `onTermsChange` (callback)
- **Features**: Terms popup trigger, checkbox validation

### 6. PaymentMethods.js
- **Purpose**: Credit card payment form
- **Props**: `onPaymentDataChange` (callback)
- **Features**: 
  - Credit card number formatting
  - Expiry date validation
  - CVC validation
  - Real-time form state updates

### 7. AdditionalServices.js
- **Purpose**: Optional services (refund guarantee, WhatsApp notifications)
- **Props**: `onServicesChange` (callback)
- **Features**: 
  - Expandable service descriptions
  - Dynamic pricing updates
  - Service selection state management

### 8. PricingSummary.js
- **Purpose**: Itemized cost breakdown
- **Props**: `ticketPrice`, `refundGuarantee`, `whatsappService`, `serviceFee`, `vatRate`, `currency`, `services`
- **Features**: 
  - Collapsible summary
  - Dynamic total calculation
  - VAT calculation
  - Conditional service display

### 9. TotalBlock.js
- **Purpose**: Final total amount display
- **Props**: `total`, `currency`
- **Features**: Formatted currency display

### 10. NewPaymentForm.js
- **Purpose**: Main container that orchestrates all components
- **Props**: `selectedSeats`, `userData`, `onPaymentSubmit`
- **Features**: 
  - State management for all form sections
  - Form validation
  - Payment processing
  - Complete checkout flow

## Data Flow

```
CheckoutPage (page.js)
    ↓
NewPaymentForm (main container)
    ↓
Individual Components (CheckoutHeader, OrderSummary, etc.)
    ↓
State Updates via Callbacks
    ↓
Form Submission
```

## Usage

```jsx
import NewPaymentForm from '@/components/checkout/NewPaymentForm';

<NewPaymentForm
    selectedSeats={[
        { category: 'STALLS GOLD', row: 'Q', number: '17' }
    ]}
    userData={{ email: 'user@example.com' }}
    onPaymentSubmit={async (formData) => {
        // Handle payment processing
    }}
/>
```

## Styling

All components maintain the original CSS class names from the scheme.html file:
- `container2 padded order checkout material`
- `checkout-header`, `checkout-back`
- `order-summary-block`, `event-info`
- `payment-methods-block`, `form_element`
- `services-block`, `summary-block`
- `total-block`, etc.

## State Management

The form state is managed in `NewPaymentForm` and includes:
- `consent`: Customer communication consent
- `termsAccepted`: Terms and conditions agreement
- `paymentData`: Credit card information
- `services`: Selected additional services

## Validation

- Terms must be accepted to proceed
- Credit card fields have format validation
- Required fields are marked and validated
- Real-time error display

## Integration Notes

- Replace mock `eventData` with real event information
- Integrate with actual payment gateway in `handleSubmit`
- Add proper error handling and user feedback
- Implement modal popups for terms and service descriptions
- Add loading states and progress indicators 