# T14 Traceability check: Use Case 2
 
Checks that the i* SR model, the strategic BPMN, the operational BPMN and the Camunda files agree for Use Case 2 (customer multi-vendor order, checkout and payment).
Sprint 2 plan, T14: "i* → strategic BPMN → operational BPMN → Camunda".
 
## Files checked (all in this repo)
 
| Level | File | Note |
|---|---|---|
| i* | `istar/SR.txt` (PW2) | The 14 dependencies are inside the SR model. |
| Strategic BPMN | `bpmn/BPMN sprint 2.bpmn` | Called strategic in the root README. IDs in [brackets]. |
| Operational BPMN | `camunda/checkout/checkout-stock-validation.bpmn` (PW3), `camunda/payment/payment-order-processing.bpmn` (PW4) | IDs in [brackets]. |
| Camunda | job types in the two BPMN files; workers in `camunda/stock-service/`, `camunda/checkout/workers/`, `camunda/payment/workers/`, `camunda/payment-service/`; forms `review-order.form` and `enter-payment-details.form`; evidence in `camunda/evidence/` | Job type names in `code`. |
 
 
 
Method: no lecture defines a traceability procedure, so this uses the brief's wording and the Week 12 lab's instruction to relate the i* models to the BPMN models. Each i* element was looked up by name in each file. "Traced" means a step, job, form or data file carries out or supports the i* element. It does not mean a dependency is a BPMN message (the Week 12 slides say it is not). I read the files and the evidence folder.
 
## 1. Actors
 
| i* actor | Strategic BPMN | Operational BPMN | Result |
|---|---|---|---|
| Customer | Pool "Customer" | No pool. Customer steps are user tasks, for example [Task_ConfirmOrder], [Task_EnterPaymentDetails] | Match, shown as user tasks |
| Local Food Marketplace | Pool "Local Food Marketplace" | Pools "Marketplace – Checkout & Stock Validation" and "Marketplace – Payment & Order Processing" | Match (two processes, not linked yet) |
| Payment gateway (sandbox) | Pool "Payment gateway (sandbox)" | Pool "Payment gateway (sandbox)" | Match (fixed, F1) |
| Producer (one of 40 SMEs) | Pool "Local producers (each of the 40 SMEs)" | Pool "Producer" (payment only) | Match, wording differs only |
 
## 2. Dependencies in the SR (14)
 
| # | Dependency (depender, dependum, dependee) | Strategic BPMN | Operational BPMN | Camunda | Result |
|---|---|---|---|---|---|
| 1 | Customer, Stock availability confirmed (goal), Check stock | [C_Unav] "Items unavailable"; [M_Stk] "In stock?" | [Gateway_StockCheck]; [Task_InformCustomer] | `notify-stock-issue`; evidence `checkout-06-out-of-stock.png` | Traced |
| 2 | Check stock, Amend the order (task), Customer | [C_Amend] "Amend basket"; [C_Resub] | [Task_AmendBasket]; [Gateway_0asiv9h] "Continue with order?" | User task with no form yet (amend form is Sprint 3) | Traced; no form (F8) |
| 3 | Customer, Delivery or collection time (resource), Order handed over | [C_DelivC] "Delivery or collection time"; [M_SendHO] | [Task_DetermineArrangements] gives a method, no time | `determine-delivery` sets `deliveryMethod`; shown in `review-order.form` | Partly: method only, no time (F5) |
| 4 | Create and split order, Confirm the purchase (task), Customer | [C_Confirm] "Confirm purchase" | [Task_ConfirmOrder] "Review and confirm order"; [Gateway_10guzpw] | `review-order.form`, variable `orderConfirmed` | Traced |
| 5 | Customer, Order confirmed (goal), Confirm order to customer | [C_OrdConf]; [M_Conf2] | [Task_SendConfirmation] | `send-order-confirmation` (logs the message only) | Traced; log only |
| 6 | Take card payment, Payment details (resource), Customer | [C_Pay] "Enter payment details"; [M_Rcv] | [Task_EnterPaymentDetails] | `enter-payment-details.form`: `paymentMethod`, sandbox `paymentToken` | Traced |
| 7 | Take card payment, Payment decision made (goal), Payment gateway | [G_Check]; [G_Gw] "Approved?" | [Task_RequestPayment]; [Gateway_PaymentResult] | `request-payment`; the service returns SUCCESS only in Sprint 2 | Partly: no declined result yet (F6) |
| 8 | Take card payment, Payment status (resource), Payment gateway | [M_Chk] "Check payment status"; [G_SStart], [G_SEnd] | [Task_FlagForAdmin] "Flag for administrator to check payment status"; [Task_NotifyCustomerFailure] "Tell customer payment is pending" | `flag-payment-for-admin`, `notify-customer-payment-pending` | Partly: an administrator checks the status, there is no automated status call (F6) |
| 9 | Payment gateway, Payment request (resource), Take card payment | [M_Ask__send]; [G_Start] | [Task_RequestPayment] | `request-payment` | Traced |
| 10 | Producer, Adequate notice (48 hours) (quality), Producer gets adequate notice | [M_Ident__n] "Check the 48 hours' notice can be met" | Text annotation on [Task_NotifyProducers]: "Producers get at least 48 hours' notice" | `notify-producer` sets a required-by date at least 48 hours ahead (`LEAD_TIME_HOURS` in `logic.js`) | Traced |
| 11 | Producer, Order details (resource), Show order in producer's list | [M_Notify__a]; [P_Read] | [Task_NotifyProducers]; [Task_SplitOrder] | `split-order-by-producer`; `notify-producer` message holds only that producer's items | Traced |
| 12 | Arrange delivery, Order prepared for handover (goal), Producer | [P_Prep]; [P_Ready]; [M_RR] | None | None | Not traced (F5) |
| 13 | Arrange collection (A3), Hand over order to customer (task), Producer | [P_Coll] "Hand over at the farm"; [P_Deliver]; [M_RHO] | None | None | Not traced (F5) |
| 14 | Stock levels, Up-to-date stock levels (resource), Producer | None in Sprint 2 (the producer's "Update stock" task is only in the Sprint 1 file) | None | Stock is read and updated in `camunda/shared/stock.json`; nothing models the producer updating it | Not traced |
 
## 3. SR elements
 
| i* element | Strategic BPMN | Operational BPMN | Camunda | Result |
|---|---|---|---|---|
| Process customer order (root task) | Marketplace pool | Two processes, checkout then payment | Started by hand; linking is planned for Sprint 3 (main README) | Traced, not linked (F10) |
| Check stock (task) | [M_Check] | [Task_CheckStock] | `check-stock` (`camunda/stock-service/camunda-worker.js`) | Traced |
| Stock levels (resource) | [DS_Stock] | [DataStoreReference_1fzlofz] "Stock levels" (checkout), [DataStore_Products] "Stock levels" (payment) | One file, `camunda/shared/stock.json`, used by `check-stock` and `update-stock` | Traced |
| Create and split order (task) | [M_Order] with [M_Order__o], [M_Order__sp] | [Task_CreateOrder], [Task_SplitOrder] | `create-order`, `split-order-by-producer` | Traced |
| Calculate producer amounts and 5% commission (task) | [M_Upd__r], after payment | [Task_CalculateCommission], after payment | `calculate-commission`; `COMMISSION_RATE` 0.05; evidence `full-run-05a-payment-variables.png` | Traced |
| Confirm order to customer (task) | [M_Conf2] | [Task_SendConfirmation] | `send-order-confirmation` | Traced |
| Update stock (task) | [M_Upd__st] | [Task_UpdateStock] | `update-stock` (`camunda/payment/workers/worker.js`) | Traced |
| Payment taken (goal) | [M_Ask]; [M_Appr] | [Task_RequestPayment]; [Gateway_PaymentResult] | `request-payment` | Traced |
| Take card payment (task) | [M_Ask__send] | [Task_EnterPaymentDetails], [Task_RequestPayment] | Form takes Visa, Mastercard, Apple Pay or Google Pay as a sandbox token | Traced |
| Take PayPal payment (A1) | None | None | Not in the form | Not traced (F2) |
| Producers notified (goal) | [M_Notify] | [Task_NotifyProducers]; [End_ProducersNotified] | `notify-producer` | Traced |
| Show order in producer's list (task) | [M_Notify__a] | [Task_NotifyProducers] (one path, no list) | `notify-producer` logs a message | Partly (F3) |
| Email or phone the order (task) | [M_Notify__b] | None | None | Not traced (F3) |
| Order handed over (goal) | [M_HG]; [M_Rec] | None | None | Not traced (F5) |
| Arrange delivery (task) | [M_Del] | [Task_DetermineArrangements] | `determine-delivery`: "Home delivery" | Partly (F5) |
| Arrange collection (A3) (task) | [M_Col]; [P_Coll] | [Task_DetermineArrangements] | `determine-delivery`: "Collection from Chew Valley farm shop" | Partly (F5) |
| Producer gets adequate notice, 48 hours (quality) | [M_Ident__n] | Text annotation on [Task_NotifyProducers] | `notify-producer` (48 hours) | Traced |
| Every producer can be reached (quality) | [M_Notify__g] "Producer uses the platform?" | None | None | Not traced (F3) |
 
## 4. Reverse check: operational and Camunda steps with no i* element
 
These are process steps, so having no i* element is fine. Listed so nothing is missed.
 
- Payment retry and cancel steps [Task_RetryOrCancel] and [Task_IncrementRetryCount], and "Stock service unavailable" [Event_03qj9y1]: error handling, no SR element. [Task_FlagForAdmin] and [Task_NotifyCustomerFailure] are traced to dependency #8. The administrator has no i* actor.
- Timers: 30 minutes (checkout), 30 seconds and 10 seconds (payment), 1 day and 30 seconds (strategic, tagged "assumed"). None is in the brief.
- Payment retry count: the payment scope proposes 3. It is a team proposal, not a case fact.
## 5. Findings and what to do
 
| # | Finding | Why it matters | Suggested action | Status |
|---|---|---|---|---|
| F1 | The gateway has two names. i* and the strategic BPMN say "Payment gateway (sandbox)". The payment BPMN says "Payment Service (simulated)". The README and Camunda files also say simulated. | Traceability needs one name. | Group picks one name and updates the other files. | Fixed. Payment pool renamed to "Payment gateway (sandbox)" (Mackenzie, PR #47). |
| F2 | PayPal (A1) is only in the i* SR. The strategic BPMN, the payment BPMN and the payment form have no PayPal. The payment scope says the sandbox choice (PayPal or Stripe) is for the team to decide. | An i* alternative that nothing else shows. | Mark PayPal out of scope in the SR, or add it to the BPMN and form. | Recorded. PayPal (A1) is strategic/i* only for Sprint 2; the card sandbox is the implemented path. |
| F3 | The email-or-phone branch and "Every producer can be reached" are only in the strategic BPMN. The payment BPMN has one "Notify producer" path. | The reachability trade-off in the SR has no operational behaviour. | Say in the SR or the README that Sprint 2 only models the platform path, or add the branch. | Recorded. The email/phone branch and "Every producer can be reached" are strategic-only for Sprint 2. |
| F4 | The 48-hour notice is in the strategic BPMN as a check and in `logic.js` as `LEAD_TIME_HOURS`. The payment BPMN task does not mention it. | A reader of the BPMN cannot see it. | Name it in the task, or add a note to the BPMN. | Fixed. A text annotation on "Notify producer" shows the 48-hour notice (`LEAD_TIME_HOURS`) (Mackenzie, PR #47). |
| F5 | Handover is not in the operational or Camunda models. Checkout only picks a method per producer. The payment scope puts physical delivery out of scope. SR items affected: Order handed over, Customer's delivery or collection time, and the two producer handover dependencies (#12, #13). | Four SR items trace only to the strategic BPMN. | Group decision: keep them as strategic-only, or mark them out of scope for Camunda in the SR notes. | Recorded. Handover is strategic-only; physical delivery is out of scope for Camunda in Sprint 2. |
| F6 | The strategic BPMN has a payment status check and a pending path. The payment BPMN uses retries and no status check. The simulated service returns SUCCESS only (declined is Sprint 3). | Dependencies #7 and #8 are only partly or not traced. | Record as known gaps until Sprint 3, or change the SR to match. | Partly fixed. The payment BPMN retries 3 times, then "Flag for administrator to check payment status", "Tell customer payment is pending", and ends at "Order held until payment is confirmed", matching the strategic pending path (Mackenzie, PR #47). Open for Sprint 3: the simulated service only returns SUCCESS (no declined result), and the status check is done by an administrator, not an automated status call. |
| F7 | Two stock files exist (`camunda/shared/stock.json` and `camunda/payment/workers/stock.json`). Nothing models the producer updating stock. The README says unifying them is Sprint 3. | Dependency #14 has no operational step. | Unify the files in Sprint 3. Decide if "Up-to-date stock levels" stays in the SR. | Fixed. `update-stock` now reads and writes `camunda/shared/stock.json`, the same file as the stock check; the old `payment/workers/stock.json` was removed (Mackenzie, PR #47). Tested: after a paid order, the next checkout sees the reduced stock. Still open: nothing models the producer updating stock (Sprint 3 / Task 2). |
| F8 | The SR has no "Update stock" task, but both BPMN levels and Camunda do it. The amend step is a user task with no form, and the payment BPMN uses a `payment-declined` form that is not in the repo. | The SR and the models do not match. Two forms are not built. | Add "Update stock" to the SR. Forms are already Sprint 3 items. | Partly fixed. "Update stock" task added to the SR (Hamza). The amend-basket form and the `payment-declined` form are Sprint 3. |
| F9 | `istar/` still has the old SD (`strategic-dependency.txt/.svg`, PW1) with different actors ("Digital Marketplace", "Payment Service", "Inventory System", "Local Producer") and 7 dependencies. `istar/README.md` lists files that are not in the folder (`SD.png`, `source/`, `istar-UC2-analysis.md`). | Two SD models blur who did PW1, and the SD does not match the SR or the BPMN names. | Group decides which SD stays. Fix the README to list only what exists. | Fixed. New SD with the 4 agreed actors and the same 14 dependencies as the SR (Tahmid, PR #46). Old SD removed. `istar/README.md` lists only existing files (Hamza). |
| F10 | The root README calls `bpmn/BPMN sprint 2.bpmn` strategic, but it contains service tasks, timers and retries, which is operational detail. The checkout and payment files are not linked. The `bpmn/README.md.` file name has a trailing dot and `BPML sprint 1.bpmn` looks like a typo. | The level names are unclear. | Group confirms the labels. Rename the two files. | Fixed. Renamed `bpmn/README.md.` to `README.md` and `BPML sprint 1.bpmn` to `BPMN sprint 1.bpmn`, and linked T14 in the root README (Rohan). |
| F11 | Data store names differed between the BPMN levels ("Orders" and "Products" in the payment and checkout BPMN, "Stock levels" in the strategic BPMN). | Traceability needs one name per store. | Use "Order records" and "Stock levels" everywhere. | Fixed. All levels now use "Order records" and "Stock levels" (Mackenzie PR #47, Yunus SCRUM-19 PR). |
 
## 6. Summary
 
- All 4 i* actors trace into the BPMN and Camunda files, with matching names.
- Of the 14 SR dependencies: 8 traced (#1, #2, #4, #5, #6, #9, #10, #11), 3 partly (#3, #7, #8) and 3 not traced (#12, #13, #14).
- Of the 11 findings: 6 fixed (F1, F4, F7, F9, F10, F11), 2 partly fixed (F6, F8) and 3 recorded as strategic-only for Sprint 2 (F2, F3, F5).
- Left for Sprint 3: a declined payment result and an automated payment status call (F6), the amend-basket and `payment-declined` forms (F8), and modelling the producer updating stock (F7).
AI was used in an assistive role in preparing this document.
 
