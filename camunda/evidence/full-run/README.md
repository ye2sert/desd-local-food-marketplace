# Full run – 15 November 2026

One order (basket `BASKET-1042`, customer `CUST-207`, 5 items from 3 producers, total £36.25) taken from checkout through to producer notification.

| File | Shows |
|---|---|
| `full-run-01-checkout-at-review.png` | Checkout instance in Operate, waiting at "Review and confirm order" after stock check, producer grouping and delivery |
| `full-run-01b-checkout-diagram.png` | Finished checkout instance – path taken through to "Order ready for payment" |
| `full-run-02-review-form.png` | Review form in Tasklist: items, order by producer with delivery/collection, total £36.25 |
| `full-run-03-payment-form.png` | Payment form in Tasklist: order total, payment method and sandbox token |
| `full-run-04a-payment-completed.png` | Payment instance finished (end date shown), every step completed |
| `full-run-04b-payment-diagram.png` | Path taken through the payment process: successful payment → confirmation → order processing → producers notified |
| `full-run-05a-payment-variables.png` | Final variables: `paymentStatus` SUCCESS, `transactionId`, `producerAmounts`, `stockUpdates` |
| `full-run-05b-final-variables.json` | All final process variables, copied from Operate |
| `full-run-06a-stock-worker.png` | Stock service worker (`check-stock`) |
| `full-run-06b-checkout-workers.png` | Checkout workers (`identify-producers`, `determine-delivery`) |
| `full-run-06c-payment-service.png` | Simulated payment service (`request-payment`) returning SUCCESS |
| `full-run-06d-payment-workers.png` | Payment & order processing workers: order created, split, confirmation, stock update, commission, producer notifications |

## Results

| Producer | Delivery | Gross | 5% commission | Net |
|---|---|---|---|---|
| Hollybush Farm | Home delivery | £19.20 | £0.96 | £18.24 |
| Chew Valley Dairy | Collection from Chew Valley farm shop | £12.80 | £0.64 | £12.16 |
| Stokes Croft Bakery | Home delivery | £4.25 | £0.21 | £4.04 |
| **Total** | | **£36.25** | **£1.81** | **£34.44** |

## Notes

- In Sprint 2 the two processes are not yet linked. Payment was started by hand in the Modeler using the variables copied from the finished checkout instance. Linking them is planned for Sprint 3.
- The stock worker was run with the `allInStock` output and PRD-202 in stock. Tahmid has since committed this fix to `main` and moved the stock data to `camunda/shared/stock.json`.
- This run followed the main (successful) path only. Exception paths were tested separately: insufficient stock in [`../checkout/`](../checkout/) (Yunus) and payment service unavailable in [`../payment/`](../payment/) (Mackenzie). The declined-payment path is planned for Sprint 3.

*AI was used in an assistive role in writing this document. It was reviewed by our team and changes were made.*
