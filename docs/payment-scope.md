# T8 – Scope: Payment & Order Processing

**Project:** Bristol Regional Food Network – Digital Marketplace  
**Owner:** Mackenzie  
**Sprint:** 1  
**Points:** 3

## Start and End Points

**Start point:** order ready for payment - the customer has reviewed and confirmed their order at the end of Checkout & Stock Validation (Yunus's functionality).

**End point:** producers notified - payment has succeeded, the order has been split by producer, stock updated, commission recorded and each producer notified of their part of the order.

The process can also end early if the customer cancels after a declined payment, or if the payment service stays unavailable after all retries.

## Main Steps

1. The customer submits one payment for the enitre basket, even if it contains items from multiple producers.
2. The marketplace sends the payment request to the simulated payment service.
3. The payment service returns a successful response, and the customer sees a confirmation with the order number.
4. The order is split into producer-specific parts, so each producer only sees their own items.
5. Stock is reduced for the purchased items. Products reaching zero stock become unavailable.
6. The amount owed to each producer and the marketplace's 5% commission are calculated and recorded.
7. Each producer is notified of their part of the order, with a required date at least 48 hours away.

## Exception Paths

### Payment declined → retry or cancel

1. The payment service returns a declined response.
2. The customer is told the payment was declined. The order is kept and stock is not changed.
3. The customer either retries (back to step 1) or cancels, which closes the order with no stock or commission changes.

### Payment service down → hold and retry

1. The payment service does not respond or returns an error.
2. The order is held, not terminated, and stock is not changed.
3. The marketplace retries automatically a set number of times (proposed: 3).
4. If a retry succeeds, the process continues from step 3 of the main steps.
5. If all retries fail, the customer is informed and the case is flagged for a marketplace administrator.

## Simulated Payment Service

The case study does not allow live payment systems or real financial data, so a fake payment service will be used for development and testing. It will be built in Sprint 2 as part of PW5.

It must be able to return three outcomes, so that every path above can be tested:

| Outcome | Used to test |
|---|---|
| Success | Main steps |
| Declined | Payment declined path |
| No response / error | Payment service down path |

Options are a sandbox such as PayPal Sandbox or Stripe Test Sandbox, or a simple mock service that returns a chosen outcome. The team will decide which in Sprint 2.

## Out of Scope

- Basket, stock check at checkout and amending orders (Checkout & Stock Validation).
- Real payments or real financial data.
- Physical delivery, refunds and paying out real money to producers.

## Open Questions

| # | Question | Status |
|---|---|---|
| Q1 | Is the 5% commission deducted from producer amounts, or added on top for the customer?
| Q2 | How many automatic retries when the payment service is down? (proposed: 3)
| Q3 | If stock sells out between the stock check and payment, do we re-check stock before payment or reserve it at checkout?
| Q4 | Is there a limit on how many times a customer can retry a declined payment, and is stock held while they retry?

*AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
