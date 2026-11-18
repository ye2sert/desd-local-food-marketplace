# Payment & Order Processing – Camunda workers

Owner: Mackenzie · Jira: SCRUM-14 (US9), SCRUM-15 (US10) · Process ID: `PaymentOrderProcessing`

This folder contains the Node.js job workers that complete the service tasks in the Payment & Order Processing process. The business rules are in `logic.js` (no Camunda code, so they can be unit tested) and `worker.js` connects them to Camunda.

## Job types

| Job type | Story | What it does | Returns |
|---|---|---|---|
| `create-order` | – | Creates the marketplace order | `orderId` ("ORD-&lt;timestamp&gt;"), `orderStatus` ("CREATED") |
| `split-order-by-producer` | US9 | Splits the order so each producer only gets their own items; adds an id to each part | `producerOrders` with `producerOrderId` ("&lt;orderId&gt;-&lt;producerId&gt;") |
| `send-order-confirmation` | – | Logs the confirmation to the customer | `confirmationSent: true` |
| `update-stock` | US9 | Reduces stock in the shared file `camunda/shared/stock.json` after payment succeeds, so the checkout stock check sees the new levels. Products at 0 become unavailable. Fails the job (incident in Operate) rather than letting stock go negative | `stockUpdates: [{productId, newQuantity, available}]` |
| `calculate-commission` | US10 | Per producer: gross = subtotal, commission = 5% rounded to 2 dp, net = gross − commission. Checks that net amounts plus commission equal the order total to the penny | `producerAmounts`, `marketplaceCommission` |
| `notify-producer` | US9 | Multi-instance (one per `producerOrder`). Logs a message with only that producer's items and a required-by date at least 48 hours ahead | nothing |
| `flag-payment-for-admin` | – | No reply from the payment gateway after 3 tries: the order is held and an administrator checks the payment status (logged; full behaviour in Sprint 3) | `orderStatus: "PAYMENT_PENDING"` |
| `notify-customer-payment-pending` | – | Tells the customer their payment is pending (logged; full behaviour in Sprint 3) | nothing |

`request-payment` is handled by the simulated payment service (`camunda/payment-service/`, owned by Rohan).

## Data contract (agreed with checkout – do not rename)

```text
items:          [{ productId, productName, producerId, producerName, quantity, unitPrice }]   unitPrice in pounds
producerOrders: [{ producerId, producerName, items, subtotal, deliveryMethod }]
orderTotal:     number (pounds)
basketId, customerId: strings
```

All money is rounded to 2 dp. Internally it is handled in whole pence so totals always add up exactly.

Stock levels are shared with checkout in `camunda/shared/stock.json` (the same file the stock check in `camunda/stock-service` reads). `update-stock` reads it, reduces it and saves it back, so the next checkout sees the lower stock. Test runs change this file: run `git restore camunda/shared/stock.json` before committing so the starting levels (PRD-101: 20, PRD-102: 30, PRD-201: 15, PRD-202: 25, PRD-301: 10) stay the same for everyone.

When the payment gateway does not reply, the process never assumes the payment failed (same rule as the strategic BPMN): after 3 tries the order is held, an administrator checks the payment status, and the customer is told the payment is pending.

## How to run

Start Camunda first (see "Running locally" in the main README). Then:

```bash
cd camunda/payment/workers
npm install
npm test          # unit tests for logic.js
node worker.js    # leave running
```

In a second terminal, also run Rohan's payment service worker (`camunda/payment-service`, `node worker.js`), which completes the `request-payment` task.

Then deploy `camunda/payment/payment-order-processing.bpmn` together with `camunda/payment/enter-payment-details.form`, and start an instance with checkout's review-step data: `camunda/checkout/test-data/review-order-variables.json`. These are the same variables checkout hands over (`basketId`, `customerId`, `items`, `producerOrders`, `orderTotal`), so this also tests the hand-off.

With that data the expected results are:

| Variable | Expected |
|---|---|
| `producerOrders` | 3 entries: PROD-01 £19.20, PROD-02 £12.80, PROD-03 £4.25 |
| `stockUpdates` | PRD-101 → 19, PRD-102 → 29, PRD-201 → 13, PRD-202 → 24, PRD-301 → 9 |
| `producerAmounts` | net £18.24, £12.16, £4.04 |
| `marketplaceCommission` | £1.81 (and £18.24 + £12.16 + £4.04 + £1.81 = £36.25, the order total) |

## Open questions

| Question | Current assumption |
|---|---|
| Is the 5% commission deducted from the producer's share or added on top for the customer? | Deducted from the producer (`COMMISSION_MODEL` in `logic.js`). To confirm with the tutor. |
| If stock sells out between the checkout stock check and payment, do we re-check stock before payment or reserve it at checkout? | Not decided with checkout yet. For now `update-stock` fails the job if there is not enough stock. |

*AI was used in an assistive role to write the worker code and this README. Mackenzie reviewed it, tested it and can explain it.*
