# Checkout & Stock Validation – tested on its own (15 November 2026)

The operational checkout BPMN (`camunda/checkout/checkout-stock-validation.bpmn`) and the `review-order` form were deployed to Camunda 8 Run 8.10.9 and run with the real workers from `main`: Tahmid's stock service (`check-stock`) and the checkout workers (`identify-producers`, `determine-delivery`, `notify-stock-issue`, `notify-checkout-failed`). Stock levels come from `camunda/shared/stock.json`.

Two orders were run:

| Order | Basket | Result |
|---|---|---|
| **A – everything in stock** | `BASKET-1042` from `camunda/checkout/test-data/sample-basket.json` (5 items, 3 producers) | Reached the review form, the customer confirmed, ended at **Order ready for payment** |
| **B – not enough stock** | Same basket as `BASKET-1043`, but 16 × Mature cheddar 400g (15 in stock) | Customer told about the problem, did not continue, ended at **Checkout cancelled** |

| File | Shows |
|---|---|
| `checkout-01-at-review.png` | Order A in Operate, waiting at "Review and confirm order" after the stock check (`allInStock` true), producer grouping and delivery |
| `checkout-02-order-total.png` | Order A: `orderTotal` 36.25 set by `determine-delivery` |
| `checkout-03-producer-orders.png` | Order A: `producerOrders` – items grouped by producer with subtotal and delivery or collection |
| `checkout-04-review-form.png` | Review form in Tasklist: basket, order by producer, total £36.25, confirmation box ticked |
| `checkout-05-completed.png` | Order A finished: path through "Order confirmed?" Yes to "Order ready for payment", `orderConfirmed` true |
| `checkout-06-out-of-stock.png` | Order B: "All items in stock?" No → "Inform customer of stock issue" → waiting at "Amend basket"; `stockIssues` lists the cheddar (16 requested, 15 available) |
| `checkout-07-amend-basket-cancel.png` | Order B in Tasklist: "Amend basket" completed with `continueCheckout` = false (the amend form itself is planned for Sprint 3) |
| `checkout-08-cancelled.png` | Order B finished: "Continue with order?" No → "Checkout cancelled" |
| `checkout-09-worker-logs.png` | Console output of the stock service and the checkout workers during both orders |
| `checkout-10-unit-tests.png` | `npm test` in `camunda/checkout/workers`: 6 of 6 tests pass |

## Results

| Producer | Items | Subtotal | Delivery or collection |
|---|---|---|---|
| Hollybush Farm | Seasonal vegetable box, Free-range eggs (12) | £19.20 | Home delivery |
| Chew Valley Dairy | Mature cheddar 400g × 2, Whole milk 2L | £12.80 | Collection from Chew Valley farm shop |
| Stokes Croft Bakery | Sourdough loaf | £4.25 | Home delivery |
| **Order total** | | **£36.25** | |

These values are identical to `camunda/checkout/test-data/review-order-variables.json`, the data the review form was built and tested with.

## Notes

- Checkout is not yet linked to Payment & Order Processing; the call activity is planned for Sprint 3 (see `full-run/` for both processes run one after the other).
- Timeouts (30 minutes) and "stock service unavailable" are modelled but were not run: the stock service does not yet raise the `STOCK_SERVICE_UNAVAILABLE` error the BPMN listens for. Planned for Sprint 3.
- The stock service reports reasons as text (e.g. "Insufficient stock"), so the customer message is the general one ("not available in the quantity requested"). With reason codes such as `INSUFFICIENT_STOCK` the message would say "only 15 left, you asked for 16".

*AI was used in an assistive role in producing this evidence and document. It was reviewed by our team and changes were made.*
