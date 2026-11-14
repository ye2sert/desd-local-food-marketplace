# Payment forms

## enter-payment-details.form (PW6b)
Form shown to the customer at the "Enter payment details" user task in the payment process.

- **Form ID:** `enter-payment-details`
- **Shows:** the order total (from `orderTotal`) formatted as £0.00
- **Fields:**
  - `paymentMethod` – Visa, Mastercard, Apple Pay or Google Pay (required)
  - `paymentToken` – sandbox test token, defaults to `tok_visa_test` (required)

The form deliberately has no card number or cardholder name fields. Only a sandbox token is collected, so no real card data is stored (GDPR / PCI-DSS). This is part of our legal and ethical evaluation.

*AI was used in an assistive role in creating this form. It was reviewed by our team and changes were made.*
