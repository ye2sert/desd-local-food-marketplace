# Payment & Order Processing – Camunda workers

Owner: Mackenzie · Jira: SCRUM-14 (US9), SCRUM-15 (US10) · Process ID: `PaymentOrderProcessing`

The `workers/` folder contains the Node.js job workers that complete the service tasks in the Payment & Order Processing process. The business rules are in `logic.js` (no Camunda code, so they can be unit tested) and `worker.js` connects them to Camunda.

## Job types

| Job type | Story | What it does | Returns |
|---|---|---|---|
| `create-order` | – | Creates the marketplace order | `orderId` ("ORD-&lt;timestamp&gt;"), `orderStatus` ("CREATED") |
| `split-order-by-producer` | US9 | Splits the order so each producer only gets their own items; adds an id to each part | `producerOrders` with `producerOrderId` ("&lt;orderId&gt;-&lt;producerId&gt;") |
| `send-order-confirmation` | – | Logs the confirmation to the customer | `confirmationSent: true` |
| `update-stock` | US9 | Reduces the simulated stock after payment succeeds. Products at 0 become unavailable. Fails the job (incident in Operate) rather than letting stock go negative | `stockUpdates: [{productId, newQuantity, available}]` |
| `calculate-commission` | US10 | Per producer: gross = subtotal, commission = 5% rounded to 2 dp, net = gross − commission. Checks that net amounts plus commission equal the order total to the penny | `producerAmounts`, `marketplaceCommission` |
| `notify-producer` | US9 | Multi-instance (one per `producerOrder`). Logs a message with only that producer's items and a required-by date at least 48 hours ahead | nothing |
| `flag-payment-for-admin` | – | Logs that the payment was flagged (full behaviour in Sprint 3) | nothing |
| `notify-customer-payment-failure` | – | Logs that the customer was told the payment failed (full behaviour in Sprint 3) | nothing |

`request-payment` is handled by the simulated payment service (`camunda/payment-service/`, owned by Rohan).

## Data contract (agreed with checkout – do not rename)

```text
items:          [{ productId, productName, producerId, producerName, quantity, unitPrice }]   unitPrice in pounds
producerOrders: [{ producerId, producerName, items, subtotal, deliveryMethod }]
orderTotal:     number (pounds)
basketId, customerId: strings
```

All money is rounded to 2 dp. Internally it is handled in whole pence so totals always add up exactly.

Simulated stock is seeded from `workers/stock.json` (PRD-101: 20, PRD-102: 30, PRD-201: 15, PRD-202: 25, PRD-301: 10) and reset each time the worker starts.

## How to run

Start Camunda first (see "Running locally" in the main README). Then:

```bash
cd camunda/payment/workers
npm install
npm test          # unit tests for logic.js
node worker.js    # leave running
```

In a second terminal, also run Rohan's payment service worker (`camunda/payment-service`, `node worker.js`) so the payment step is completed. Then deploy the Payment & Order Processing process and start an instance with variables such as:

```json
{
  "basketId": "B-1",
  "customerId": "C-1",
  "orderTotal": 22.87,
  "items": [
    { "productId": "PRD-101", "productName": "Free-range eggs", "producerId": "P1", "producerName": "Hillside Farm", "quantity": 2, "unitPrice": 3.20 },
    { "productId": "PRD-201", "productName": "Sourdough loaf", "producerId": "P2", "producerName": "Avon Bakery", "quantity": 1, "unitPrice": 4.50 },
    { "productId": "PRD-202", "productName": "Strawberry jam", "producerId": "P2", "producerName": "Avon Bakery", "quantity": 3, "unitPrice": 3.99 }
  ],
  "producerOrders": [
    { "producerId": "P1", "producerName": "Hillside Farm", "subtotal": 6.40, "deliveryMethod": "collection",
      "items": [{ "productId": "PRD-101", "productName": "Free-range eggs", "producerId": "P1", "producerName": "Hillside Farm", "quantity": 2, "unitPrice": 3.20 }] },
    { "producerId": "P2", "producerName": "Avon Bakery", "subtotal": 16.47, "deliveryMethod": "delivery",
      "items": [
        { "productId": "PRD-201", "productName": "Sourdough loaf", "producerId": "P2", "producerName": "Avon Bakery", "quantity": 1, "unitPrice": 4.50 },
        { "productId": "PRD-202", "productName": "Strawberry jam", "producerId": "P2", "producerName": "Avon Bakery", "quantity": 3, "unitPrice": 3.99 }
      ] }
  ]
}
```

## Open questions

| Question | Current assumption |
|---|---|
| Is the 5% commission deducted from the producer's share or added on top for the customer? | Deducted from the producer (`COMMISSION_MODEL` in `logic.js`). To confirm with the tutor. |
| If stock sells out between the checkout stock check and payment, do we re-check stock before payment or reserve it at checkout? | Not decided with checkout yet. For now `update-stock` fails the job if there is not enough stock. |

*AI was used in an assistive role to write the worker code and this README. Mackenzie reviewed it, tested it and can explain it.*
