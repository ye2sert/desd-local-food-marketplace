# Product Backlog

**Project:** Bristol Regional Food Network – Digital Marketplace
**Use case:** Use Case 2 – Customer Multi-Vendor Order, Checkout and Payment
**Backlog owner:** Rohan

Priority uses MoSCoW (Must / Should / Could). Story points: 1 = small, 3 = medium, 5 = large.
Each item is tracked as a GitHub issue on the project board.
The **Source** line on each item shows where the requirement comes from in the case study or Use Case 2.

## Roles and contribution plan

Functionality leads stay accountable for their functionality, but the work inside it is shared so that every member contributes equally. Points include Sprint 1 tasks (T1–T13) and backlog items; shared items (T11, T12, PW8) are excluded because everyone does them together.

| Member | Role | Sprint 1 tasks | Backlog items | Points | Share |
|---|---|---|---|---|---|
| Hamza | Strategic BPMN & integration| T5, T6 (8) | PW2, US8, PW7 (13) | 21 | 20% |
| Tahmid | Business analysis | T3, T4 (6) | PW1, US2, US12 (15) | 21 | 20% |
| Yunus | Lead – Checkout & Stock Validation | T7 (3) | PW3, US1, US3, US4, US5, US11 (18) | 21 | 20% |
| Mackenzie | Lead – Payment & Order Processing | T8, T9 (4) | PW4, US7, US9, US10, PW9 (17) | 21 | 20% |
| Rohan | Backlog / project board | T1, T2, T10, T13 (6) | PW5, PW6, US6 (15) | 21 | 20% |
| | | | **Total** | **105** | **100%** |

Story points are estimates. The split is reviewed at the start of each sprint and rebalanced if anyone falls behind or gets ahead, so that the Contribution Matrix reflects real work.

---

## Functionality 1 – Checkout & Stock Validation (lead: Yunus)

### US1 – Multi-vendor basket
**As a** customer, **I want** to add products from different producers to one basket, **so that** I can buy everything in one order.
**Priority:** Must | **Points:** 3 | **Owner:** Yunus
**Source:** Use Case 2 – customer adds products from one or more producers; Case study (Customers) – checkout must handle single and multi-vendor orders seamlessly.

Acceptance criteria:
- Products from two or more producers can be added to the same basket.
- The basket shows each item's producer, price and quantity.
- The basket total updates when items are added, removed or changed.

### US2 – Stock check at checkout
**Owner:** Tahmid  
**Priority:** Must  
**Story Points:** 5  
**Functionality:** Checkout & Stock Validation

## User Story

As a customer, I want the system to check stock when I check out, so that I don't order something that has sold out.

## Description

When a customer proceeds to checkout, the marketplace must check whether every product in their basket is available in the requested quantity.

The system compares the requested quantities against the current stock information.

If all products are available, the customer can continue checkout.

If any product is unavailable or there is insufficient stock, checkout cannot continue until the basket is corrected.

## Acceptance Criteria

1. Every basket item is checked against current stock when checkout starts.
2. Checkout only continues if all items are available in the requested quantities.
3. Products that are out of season or at zero stock count as unavailable.

## Example Scenario

**Scenario 1: Sufficient stock**

Given a customer has added 3 apples to their basket,

And the producer has 10 apples available,

When the customer proceeds to checkout,

Then the system validates the available stock,

And the customer can continue checkout.

**Scenario 2: Insufficient stock**

Given a customer has added 5 apples to their basket,

And the producer only has 2 apples available,

When the customer proceeds to checkout,

Then the system detects insufficient stock,

And checkout cannot continue with the requested quantity.

**Scenario 3: Product unavailable**

Given a customer has added a seasonal product to their basket,

And the product is currently out of season,

When the customer proceeds to checkout,

Then the system identifies the product as unavailable,

And checkout cannot continue with that product.

Acceptance criteria:
- Every basket item is checked against current stock when checkout starts.
- Checkout only continues if all items are available in the requested quantities.
- Products that are out of season or at zero stock count as unavailable.

### US3 – Unavailable or insufficient stock (exception)
**As a** customer, **I want** to be told if an item is unavailable or low on stock, **so that** I can change my order.
**Priority:** Must | **Points:** 3 | **Owner:** Yunus
**Source:** Use Case 2 – if an item is unavailable or stock is insufficient, the customer is informed and asked to amend the order.

Acceptance criteria:
- The customer sees which items are affected and how many are available.
- The customer can reduce the quantity or remove the item.
- The stock check runs again after the order is amended.

### US4 – Order grouped by producer with delivery or collection
**As a** customer, **I want** to see my order grouped by producer with delivery or collection details, **so that** I know who is supplying what and how I will receive it.
**Priority:** Should | **Points:** 3 | **Owner:** Yunus
**Source:** Use Case 2 – system identifies the producers involved and the delivery or collection arrangements; Case study (Customers) – clear communication of supplier responsibilities, delivery and collection.

Acceptance criteria:
- Items are grouped under each producer.
- Each group shows its delivery or collection arrangement.
- Each group shows a subtotal.

### US5 – Review and confirm order
**As a** customer, **I want** to review my order before confirming, **so that** I can check it is correct.
**Priority:** Must | **Points:** 1 | **Owner:** Yunus
**Source:** Use Case 2 – the customer reviews the order and confirms the purchase.

Acceptance criteria:
- A summary shows all items, producers, delivery arrangements and the total.
- The customer can go back and edit, or confirm and continue to payment.

### US11 – Browse and search products
**As a** customer, **I want** to browse products by category and search for items, **so that** I can find what I want to add to my basket.
**Priority:** Could | **Points:** 3 | **Owner:** Yunus
**Source:** Use Case 2 – the customer browses or searches the marketplace; Case study (Customers) – categories (vegetables, dairy, bakery, preserves, seasonal specialities), search, harvest dates and farm origin.

Acceptance criteria:
- Products can be filtered by category.
- Products can be found by name using search.
- Each product shows its producer, harvest date and seasonal availability.

---

## Functionality 2 – Payment & Order Processing (lead: Mackenzie)

### US6 – Pay through the payment service
As a customer I want to be able to securely pay for my whole basket in a single payment even if there are items from different sellers. This is so my order will go through seamlessly without extra hassle of paying multiple times.
**Priority:** Must | **Points:** 5 | **Owner:** Rohan
**Source:** Use Case 2 – payment submitted to an external or simulated payment service, and the order is separated into producer-specific elements; Case study (Disclaimers) – sandbox or simulated payments only.

Acceptance criteria:
- Payments need to be sent to a simulated payment sandbox environment for example PayPal sandbox. No real money will be used in the functionality testing of the system.
- The order is confirmed and after a successful payment the customer will get a payment confirmation screen with the order number and details present.
- After a payment is made from the customer, which has bought items from multiple stores but made one payment, the store owners will only see their own items that have been purchased.

### US7 – Payment declined (exception)
**As a** customer, **I want** to be told if my payment is declined and be able to retry, **so that** I don't lose my order.
**Priority:** Must | **Points:** 3 | **Owner:** Mackenzie
**Source:** Use Case 2 – if payment is declined, the customer is informed and given the opportunity to retry.

Acceptance criteria:
- A declined payment shows a clear message to the customer.
- The order details are kept.
- The customer can retry payment or cancel the order.

### US8 – Payment service unavailable (exception)
**As a** marketplace admin, **I want** orders to be held and retried if the payment service is down, **so that** sales are not lost.
**Priority:** Should | **Points:** 5 | **Owner:** Hamza
**Source:** Use Case 2 – if the payment service is temporarily unavailable, follow an exception or retry path rather than terminating.

Acceptance criteria:
- If the payment service does not respond, the order is held rather than terminated.
- Payment is retried automatically a set number of times.
- If all retries fail, the customer is informed and the case is flagged for follow-up.

### US9 – Producer notification and stock update
**As a** producer, **I want** to be notified of my part of a confirmed order and have my stock updated, **so that** I can prepare it in time.
**Priority:** Must | **Points:** 3 | **Owner:** Mackenzie
**Source:** Use Case 2 – on successful payment, inventory is updated and producers are notified; Case study (Producers) – visibility of incoming orders with at least 48 hours' lead time; Case study (Quality Assurance) – records linking customers, products and producers.

Acceptance criteria:
- Each producer receives only their own items from the order.
- The notification shows the required date, respecting the 48-hour lead time.
- Stock is reduced only after payment succeeds.
- A product reaching zero stock becomes unavailable for new orders.
- The order record links the customer, products and producers.

### US10 – Producer amounts and 5% commission
**As a** marketplace admin, **I want** the system to work out each producer's share and the 5% commission, **so that** payments are accurate.
**Priority:** Must | **Points:** 3 | **Owner:** Mackenzie
**Source:** Use Case 2 – calculate the amount attributable to each producer and the 5% commission; Case study (Core Functionality) – commission calculated automatically.

Acceptance criteria:
- The amount owed to each producer is calculated from their items.
- The marketplace's 5% commission is calculated and recorded.
- Producer amounts plus commission equal the order total.

### US12 – Weekly producer settlement with audit trail
**As a** producer, **I want** to receive a weekly payment with a clear record of each order, **so that** I can use it for tax and accounting.
**Priority:** Could | **Points:** 5 | **Owner:** Tahmid
**Source:** Case study (Producers) – weekly payment settlements with transparent audit trails for tax reporting; Case study (Core Functionality) – distribute payments to producers according to agreed timeframes.

Acceptance criteria:
- Each producer's amounts are totalled weekly, minus commission.
- A settlement record lists each order, item, amount and commission.
- Settlement records can be viewed by the producer and the marketplace.

---

## Project work items

These cover the modelling, automation, testing and evaluation work required by the module.

### PW1 – i* Strategic Dependency (SD) model
Model the actors (customers, producers, marketplace, payment service, delivery) and their goal, task, resource and softgoal dependencies.
**Sprint:** 2 | **Owner:** Tahmid | **Priority:** Must | **Points:** 5
**Source:** Case study (Stakeholder Requirements) – producers' and customers' needs and dependencies.

### PW2 – i* Strategic Rationale (SR) model
Model the internal goals, tasks and softgoals of the key actors, including tensions such as low fees vs. secure payment, or fast checkout vs. accurate stock.
**Sprint:** 2 | **Owner:** Hamza | **Priority:** Must | **Points:** 5
**Source:** Case study (Stakeholder Requirements) – varying producer technical skills, customer convenience, financial transparency.

### PW3 – Operational BPMN: Checkout & Stock Validation
Detailed end-to-end model with pools, lanes, user and service tasks, gateways and the insufficient-stock exception path.
**Sprint:** 2 | **Owner:** Yunus | **Priority:** Must | **Points:** 5
**Source:** Use Case 2 – browse, basket, stock check, amend, review and confirm.

### PW4 – Operational BPMN: Payment & Order Processing
Detailed end-to-end model with message flows to the payment service, boundary events, the declined and unavailable payment paths, order splitting, commission and producer notification.
**Sprint:** 2 | **Owner:** Mackenzie | **Priority:** Must | **Points:** 5
**Source:** Use Case 2 – payment, exceptions, order confirmation, inventory update, notification, commission.

### PW5 – Camunda setup and simulated payment service
Set up Camunda on a local machine and add the checkout and payment processes so they can execute in camunda. Also create a fake payment service such as a PayPal sandbox link so testing can be completed easier. 
**Sprint:** 2 | **Owner:** Rohan | **Priority:** Must | **Points:** 5
**Source:** Use Case 2 and Case study (Disclaimers) – sandbox or simulated payment service only.

### PW6 – Camunda Forms for checkout and payment
Make the Camunda forms so they can be used by customers for each stage in the process of checkout and payments which are reviewing the basket, editing the order, confirming the order payment details and retry payment feature. Each form must send the customers input, for example updated quantities or retry choice, back to the process. Each form will be built with Yunus and Mackenzie so the forms match their BPMN diagrams.
**Sprint:** 2–3 | **Owner:** Rohan | **Priority:** Must | **Points:** 5
**Source:** Use Case 2 – customer interactions at each stage.

### PW7 – Legal, ethical, social and professional evaluation
Evaluate GDPR (customer and order data), food safety and allergen information, payment and financial regulations (sandbox only), and accessibility for producers with limited technical skills.
**Sprint:** 3 | **Owner:** Hamza | **Priority:** Must | **Points:** 3
**Source:** Case study (Core Functionality) – data protection and financial services regulations; Case study (Producers) – varying technical capabilities.

### PW8 – Final demonstration and Contribution Matrix
Prepare the Sprint 3 demo, Q&A preparation, and the signed Contribution Matrix.
**Sprint:** 3 | **Owner:** All | **Priority:** Must | **Points:** 3

### PW9 – End-to-end testing
Test both processes in Camunda, including every exception path: insufficient stock, payment declined, payment service unavailable.
**Sprint:** 3 | **Owner:** Mackenzie | **Priority:** Must | **Points:** 3
**Source:** Use Case 2 – alternative and exception flows.

---

## Summary

| ID | Item | Area | Owner | Priority | Points |
|---|---|---|---|---|---|
| US1 | Multi-vendor basket | Checkout | Yunus | Must | 3 |
| US2 | Stock check at checkout | Checkout | Tahmid | Must | 5 |
| US3 | Unavailable / insufficient stock | Checkout | Yunus | Must | 3 |
| US4 | Order grouped by producer | Checkout | Yunus | Should | 3 |
| US5 | Review and confirm order | Checkout | Yunus | Must | 1 |
| US11 | Browse and search products | Checkout | Yunus | Could | 3 |
| US6 | Pay through payment service | Payment | Rohan | Must | 5 |
| US7 | Payment declined | Payment | Mackenzie | Must | 3 |
| US8 | Payment service unavailable | Payment | Hamza | Should | 5 |
| US9 | Producer notification and stock update | Payment | Mackenzie | Must | 3 |
| US10 | Producer amounts and 5% commission | Payment | Mackenzie | Must | 3 |
| US12 | Weekly producer settlement | Payment | Tahmid | Could | 5 |
| PW1 | i* SD model | Modelling | Tahmid | Must | 5 |
| PW2 | i* SR model | Modelling | Hamza | Must | 5 |
| PW3 | Operational BPMN – Checkout | Modelling | Yunus | Must | 5 |
| PW4 | Operational BPMN – Payment | Modelling | Mackenzie | Must | 5 |
| PW5 | Camunda setup and payment service | Automation | Rohan | Must | 5 |
| PW6 | Camunda Forms | Automation | Rohan | Must | 5 |
| PW7 | LESP evaluation | Evaluation | Hamza | Must | 3 |
| PW8 | Final demo and Contribution Matrix | Delivery | All | Must | 3 |
| PW9 | End-to-end testing | Testing | Mackenzie | Must | 3 |
| | | | | **Total** | **81** |

User stories and project work items are delivered from Sprint 2 onwards. Sprint 1 tasks are listed in `sprint-1-plan.md`.

*AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
