 ```markdown                                                                                                                                                                                                                
# Functionality 1 – Checkout & Stock Validation

Owner: Yunus Sert · Jira: SCRUM-32 (T7) · Use case: Use Case 2 – Customer Multi-Vendor Order, Checkout and Payment
Related diagrams: strategic BPMN sub-process *Checkout & Stock Validation*; draft operational BPMN `bpmn/checkout-stock-validation-draft.bpmn`

## 1. Purpose
Before a customer pays, we check their basket is still valid. Stock can change while they shop, so we check every item again at checkout. If something has run out, the customer fixes their basket and we check again.
When everything is in stock, we work out which producers are involved and how each part will be delivered or collected. The customer then confirms the order.

## 2. Why this is a major functionality
The brief says a major functionality needs six things. Checkout has all six:

| Brief requirement | In our checkout |
|---|---|
| User interaction | Customer amends the basket and confirms the order |
| Automated processing | The system checks stock and finds the producers by itself |
| Business decisions | "All items in stock?" decides what happens next |
| Service interaction | The stock check reads from the product and stock records |
| Data processing | Basket, quantities, stock and producer details are combined into one order |
| Exception flows | Out of stock, not enough stock, customer changes or cancels, timeout, stock check fails |

## 3. Actors and responsibilities
| Actor | Responsibility in this functionality |
|---|---|
| Customer | Starts checkout, amends the basket when told about stock problems, reviews and confirms the order |
| Marketplace platform | Checks stock for every item, informs the customer, identifies producers, determines delivery/collection arrangements, passes the confirmed order to payment |
| Product & stock records | Provide current stock levels, seasonal availability and producer details |
| Registered producers | Not active in this process; their products and stock are read. They are notified later in Payment & Order Processing |

## 4. Trigger, inputs and outputs
**Trigger:** the customer proceeds to checkout with a non-empty basket.

**Inputs:** basket items · requested quantities · product availability and stock levels · producer details (including delivery/collection options)

**Outputs:** validated basket/order · list of producers involved · delivery or collection arrangement per producer · confirmation that the order can move to payment

## 5. Main flow
1. Customer goes to checkout.
2. System checks stock for every item.
3. Is everything in stock?
   - **No:** customer is told and amends the basket, then back to step 2.
   - **Yes:** carry on.
4. System finds which producers are involved.
5. System works out delivery or collection for each producer.
6. Customer reviews and confirms the order.
7. Order is ready for payment (Payment & Order Processing takes over).

## 6. What can go wrong
| Problem | What happens | In the diagram? |
|---|---|---|
| Item out of stock | Customer removes or swaps it, stock is checked again | Yes |
| Not enough stock | Customer lowers the quantity, stock is checked again | Yes |
| Customer changes their mind at review | Back to amend the basket | Sprint 2 |
| Customer cancels | Checkout ends, no order | Sprint 2 |
| Customer doesn't respond | Checkout times out (e.g. after 30 min) | Sprint 2 |
| Stock check fails | Try again, then ask the customer to come back later | Sprint 2 |

## 7. Business rules
- Stock must be checked again when the customer checks out (Use Case 2).
- The order cannot continue while any item is unavailable or short of stock.
- Products out of season or at zero stock count as unavailable.
- Stock is **not** reduced in this functionality; inventory is only updated after successful payment, in Payment & Order Processing.
- One basket can contain products from several producers; the order is grouped by producer.

## 8. Where my part starts and ends
- **Starts:** customer clicks checkout.
- **Ends:** order confirmed and ready for payment.
- **Not my part:** payment, splitting the order by producer, reducing stock, telling producers, the 5% commission. These are all in Payment & Order Processing (Mackenzie).

## 9. Traceability
| Use Case 2 requirement | Step | User story | BPMN element |
|---|---|---|---|
| "adds products from one or more producers to their basket" | before 1 | US1, US11 | Customer pool: Fill basket (strategic BPMN) |
| "the system checks that all selected products are still available in the requested quantities" | 2–3 | US2 | Check stock for each item, All items in stock? |
| "the customer is informed and asked to amend the order" | 3 (No) | US3 | Inform customer of stock issue, Amend basket |
| "identifies the producers involved" | 4 | US4 | Identify producers involved |
| "determines the relevant delivery or collection arrangements" | 5 | US4 | Determine delivery or collection arrangements |
| "the customer reviews the order and confirms the purchase" | 6 | US5 | Review and confirm order |
| Strategic BPMN | 1–7 | – | Sub-process *Checkout & Stock Validation* in the Orders & Payments lane |

## 10. Next steps for Sprint 2
In Sprint 2 the draft diagram becomes the full operational BPMN and starts running in Camunda.

| What we'll add | Why |
|---|---|
| "Order confirmed?" decision after review | Lets the customer go back and change the basket |
| "Continue with order?" decision and a "Checkout cancelled" end | Lets the customer give up cleanly |
| Timers on Amend basket and Review and confirm | Ends checkout if the customer stops responding |
| Error event on the stock check | Handles the stock check failing |
| Product & stock records data store | Shows where stock data comes from |
| Hand-off message to Payment & Order Processing | Shows exactly where Mackenzie's part takes over |
| Camunda Forms for Amend basket and Review and confirm (with Rohan) | The screens the customer uses in the running process |

## 11. Questions and dependencies
- We still need the module team to approve our use case and the two functionalities.
- Stock only goes down after payment, so it could change between checkout and payment. Should checkout hold the stock for a short time, or should payment check it again?

---
 ```  
