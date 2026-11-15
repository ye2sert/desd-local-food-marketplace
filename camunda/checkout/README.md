# Checkout & Stock Validation – Camunda files

Owner: Yunus · Jira: SCRUM-19 (PW3), SCRUM-39 (PW6a), SCRUM-9 (US5), SCRUM-5 (US1)

| File | What it is |
|---|---|
| `review-order.form` | Camunda Form for the **Review and confirm order** user task (form ID `review-order`) |
| `test-data/sample-basket.json` | A multi-vendor basket (3 producers, 5 items) used to start the checkout process |
| `test-data/review-order-variables.json` | The same basket as it looks at the review step, after producers and delivery have been worked out |
| `workers/` | Job workers for the checkout service tasks (see **Workers** below) |
| `../shared/producers.json` | Each producer's delivery or collection option, used by `determine-delivery` |

The operational checkout BPMN (PW3, SCRUM-19) will also live in this folder.

## Process data
These names follow the hand-off proposed on SCRUM-19, so checkout connects to Payment & Order Processing.

**Checkout starts with (US1):**

| Variable | Contents |
|---|---|
| `basketId` | Basket reference, e.g. `BASKET-1042` |
| `customerId` | Customer reference |
| `items` | List of `{productId, productName, producerId, producerName, quantity, unitPrice}` |

**Added before the review step (by the producer and delivery service tasks):**

| Variable | Contents |
|---|---|
| `producerOrders` | One entry per producer: `{producerId, producerName, items, subtotal, deliveryMethod}` |
| `orderTotal` | Sum of the producer subtotals, in pounds |

**Set by the review-order form (US5):**

| Variable | Contents |
|---|---|
| `orderConfirmed` | `true` if the customer ticks the confirmation box, otherwise `false`. The "Order confirmed?" gateway uses `=orderConfirmed = true` |

Prices are stored in pounds (e.g. `4.2`) and the form shows them as `£4.20`.

## Using the form
1. In the checkout BPMN, select **Review and confirm order**, open **Details** (Implement tab) → **Form**, choose **Linked Camunda Form** and enter Form ID `review-order`.
2. Deploy `review-order.form` together with the BPMN (in Desktop Modeler, deploy both files).
3. To try the form on its own, start an instance with the variables in `test-data/review-order-variables.json` and open the task in **Tasklist**. It shows the basket, the order grouped by producer with delivery or collection, the order total and the confirmation tick box.

## Workers
`workers/` is a Node.js app that completes the checkout service tasks in Camunda. `check-stock` is handled by the stock service (US2), not here.

| Job type | Service task | Reads | Sets |
|---|---|---|---|
| `identify-producers` | Identify producers involved | `items` | `producerOrders` (one entry per producer with its items and `subtotal`) |
| `determine-delivery` | Determine delivery or collection arrangements | `producerOrders`, `../shared/producers.json` | `producerOrders` (adds `deliveryMethod`), `orderTotal` |
| `notify-stock-issue` | Inform customer of stock issue | `stockIssues` | – (shows one message per problem, e.g. "Mature cheddar 400g: only 1 left, you asked for 2") |
| `notify-checkout-failed` | Ask customer to try later | – | – (shows "Sorry, we can't check stock right now…") |

Money is calculated in whole pence, so totals are exact. A producer missing from `producers.json` gets "Collection from producer". If the basket is empty, the job fails with an incident in Operate instead of retrying.

**Run it** (Camunda 8 Run must be running – see the main README):
```bash
cd camunda/checkout/workers
npm install
node worker.js
```
**Test it:** `npm test`. The tests check that the sample basket gives exactly the data in `test-data/review-order-variables.json`, that each producer only gets their own items, that totals are exact to the penny, the delivery fallback, and the stock-issue messages.

*AI was used in an assistive role to create the form, test data and workers. They were reviewed and tested by our team.*
