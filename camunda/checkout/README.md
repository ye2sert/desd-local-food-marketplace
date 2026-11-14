# Checkout & Stock Validation – Camunda files

Owner: Yunus · Jira: SCRUM-39 (PW6a), SCRUM-9 (US5), SCRUM-5 (US1)

| File | What it is |
|---|---|
| `review-order.form` | Camunda Form for the **Review and confirm order** user task (form ID `review-order`) |
| `test-data/sample-basket.json` | A multi-vendor basket (3 producers, 5 items) used to start the checkout process |
| `test-data/review-order-variables.json` | The same basket as it looks at the review step, after producers and delivery have been worked out |

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

*AI was used in an assistive role to create the form and test data. They were reviewed and tested by our team.*
