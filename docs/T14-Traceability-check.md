# T14 Traceability check: Use Case 2

Checks that the i* models, the strategic BPMN and the operational BPMN agree for Use Case 2 (customer multi-vendor order, checkout and payment).
The brief asks for "clear traceability between i*, strategic BPMN and operational BPMN" (Sprint 2).

Files checked:
- i*: `SD.png`, `SR.png`
- Strategic BPMN: `final-strategic/strategic-bpmn-FINAL.bpmn` (the whole enterprise; only the Use Case 2 parts are used below)
- Operational BPMN: `uc2-bpmn-merged/UC2-operational-BPMN-MERGED.bpmn`

Method: no lecture defines a traceability procedure, so this uses the brief's wording and the Week 12 lab's instruction to relate the i* models to the BPMN models. Each i* element was looked up by name in both BPMN files. "Traced" means the BPMN has a step that carries out or supports the i* element. It does not mean the dependency is a BPMN message (the Week 12 slides say it is not). IDs in brackets are the element IDs in those files. "Strategic" means the strategic file, "Operational" means the operational file.

## 1. Actors

| i* actor | Strategic BPMN | Operational BPMN | Result |
|---|---|---|---|
| Customer | Pool "Customer" | Pool "Customer" | Match |
| Local Food Marketplace | Pool "Bristol Regional Food Network marketplace" | Pool "Local Food Marketplace" | Name differs (finding F1) |
| Payment gateway (sandbox) | Pool "Payment gateway (sandbox, e.g. Stripe / PayPal)" | Pool "Payment gateway (sandbox)" | Match |
| Producer | Pool "Producers (40 local food SMEs)" | Pool "Local producers (each of the 40 SMEs)" | Match (wording differs only) |

## 2. SD dependencies

| # | Dependency (depender, dependum, dependee) | Strategic BPMN | Operational BPMN | Result |
|---|---|---|---|---|
| 1 | Customer, Stock availability confirmed (goal), Marketplace | "Check each item is in stock" [M_Check__chk]; "Items unavailable" [C_Unav] | "Check basket and stock" [M_Check]; "In stock?" [M_Stk]; "Tell customer items are short" [M_Short] | Traced |
| 2 | Customer, Order confirmed (goal), Marketplace | "Send order confirmation to customer" [M_Confirm__cust]; "Get order confirmation" [C_GetConf] | "Confirm order to customer" [M_Conf2]; "Order confirmed" [C_OrdConf] | Traced |
| 3 | Customer, Delivery or collection time (resource), Marketplace | "Tell customer the delivery day" [M_Deliv__dl]; "Tell customer where and when to collect" [M_Deliv__cl]; "Get delivery or collection time" [C_GetDel] | "Send handover details" [M_SendHO]; "Delivery or collection time" [C_DelivC] | Traced |
| 4 | Marketplace, Payment details (resource), Customer | "Pay by card" [C_PayCard]; message "Card details" | "Enter payment details" [C_Pay]; "Receive payment details" [M_Rcv] | Traced |
| 5 | Marketplace, Payment decision made (goal), Payment gateway | "Send payment request with payment key" [M_TakeCard__send]; gateway "Check card with bank" [G_Check] | "Ask gateway to take payment" [M_Ask]; "Check the payment" [G_Check]; "Approved?" [G_Gw] | Traced |
| 6 | Marketplace, Payment status (resource), Payment gateway | "Ask gateway what happened to the payment" [M_TakeCard__ask]; message "Answer" | "Check payment status" [M_Chk]; gateway "Status enquiry" [G_SStart], "Payment status" [G_SEnd] | Traced |
| 7 | Payment gateway, Payment request (resource), Marketplace | [M_TakeCard__send] | "Send payment request with a payment key" [M_Ask__send]; gateway "Payment request" [G_Start] | Traced |
| 8 | Marketplace, Order prepared for handover (goal), Producer | Producer "Prepare order" [P_Prep]; "Ready" [P_Ready] | "Prepare the products" [P_Prep]; "Ready for handover" [P_Ready]; "Receive producer-ready updates" [M_RR] | Traced |
| 9 | Marketplace, Hand over order to customer (task), Producer | "Deliver to customer" [D_Deliver]; "Hand over at farm" [D_Collect]; "Order handed over" [D_Done] | "Deliver to customer" [P_Deliver]; "Hand over at the farm" [P_Coll]; "Receive hand-over confirmation" [M_RHO] | Traced |
| 10 | Producer, Order details (resource), Marketplace | "Tell each producer (48 hours' notice)" [M_Confirm__notify]; producer "New order" [P_NewOrder] | "Notify each producer" [M_Notify]; producer "Order notice" [P_Start], "Read the order" [P_Read] | Traced |
| 11 | Producer, Adequate notice, 48 hours (softgoal), Marketplace | Label of [M_Confirm__notify] | "Check the 48 hours' notice can be met" [M_Ident__n] | Traced (only as a label and one check; see F5) |

## 3. SR elements

| i* element | Strategic BPMN | Operational BPMN | Result |
|---|---|---|---|
| Check stock (task) | [M_Check__chk] | [M_Check] | Traced |
| Stock levels (resource) | Data store "Products" [DS_Products] | Data store "Stock levels" [DS_Stock] | Traced |
| Create and split order (task) | "Create order and split by producer" [M_Create] | "Create and split order" [M_Order] | Traced |
| Calculate producer amounts and 5% commission (task) | [M_Create__am], [M_Create__c], before payment | [M_Upd__sh], [M_Upd__co], after payment approved | Traced, but timing differs (F2) |
| Confirm order to customer (task) | [M_Confirm__cust] | [M_Conf2] | Traced |
| Payment taken (goal) | "Take card payment" [M_TakeCard] and "Take PayPal payment" [M_TakePP] | "Ask gateway to take payment" [M_Ask]; "Approved?" [M_Appr] | Traced |
| Means: take card payment | [M_TakeCard] | [M_Ask] (one generic path) | Partly (F3) |
| Means: take PayPal payment (A1) | [M_TakePP], "Pay with PayPal instead?" [M_PPQ] | No PayPal element; only "Choose another payment method" [C_New] | Partly (F3) |
| Producers notified (goal) | [M_Confirm__notify], with boundary "Producer not reachable" and "Phone or email the producer" [M_Confirm__call] | [M_Notify] | Traced |
| Means: show order in producer's list | [M_Confirm__notify] | [M_Notify__a] | Traced |
| Means: email or phone the order | [M_Confirm__call] | [M_Notify__b] | Traced |
| Order handed over (goal) | [M_Deliv], [D_Done] | [M_HG], [M_Rec] | Traced |
| Means: arrange delivery / arrange collection | [M_Deliv__dl], [M_Deliv__cl]; [D_Deliver], [D_Collect] | [M_Del], [M_Col]; [P_Deliver], [P_Coll] | Traced |
| Softgoal: Producer gets adequate notice (48 hours) | Label on [M_Confirm__notify] | [M_Ident__n]; [M_Notify] | Traced |
| Softgoal: Every producer can be reached | Boundary event [M_Confirm__bx] "Producer not reachable" | The email/phone branch [M_Notify__b] | Traced |

## 4. Reverse check: Use Case 2 BPMN steps with no i* element

These are process steps only, so not having an i* element is fine. Listed so nothing is missed.
- Customer browsing, basket and review steps ([C_Browse], [C_Basket], [C_Review]): process steps; the customer's reliance is captured by dependencies 1 to 3.
- "Reserve the stock" [M_Check__res] and "Release the stock" [M_Release] (strategic only): no i* element and nothing in the operational file (F4).
- Timers: 30 minutes, 10 minutes, 2 days, 7 days (strategic); 1 day and 30 seconds (operational): no i* element and none in the brief (F6).
- Producer "Confirm order received" [P_Ack] (operational): no i* dependency.

## 5. Findings and what to do

| # | Finding | Why it matters | Suggested action |
|---|---|---|---|
| F1 | The Marketplace pool is named differently in each model: "Bristol Regional Food Network marketplace" (strategic), "Local Food Marketplace" (operational and i*). | The brief wants clear traceability; names should match. | Agree one name and use it in all three. |
| F2 | The 5% commission and producer amounts are calculated before payment in the strategic BPMN and after payment approval in the operational BPMN. | The use case does not fix the order, but the two models contradict each other. | Pick one place, change the other model, and record the decision. |
| F3 | The strategic BPMN has separate card and PayPal subprocesses. The operational BPMN has one generic payment path and no PayPal. The i* SR shows both as alternatives (A1). | The alternative is in i* and strategic but not traceable in operational. | Either add a PayPal option to the operational model, or mark PayPal out of scope in all three. |
| F4 | The strategic BPMN reserves and releases stock. The operational BPMN only updates stock after payment, so it has no reserve or release. | Behaviour differs between the two levels. | Add reserve/release to the operational model, or remove it from the strategic one. |
| F5 | The 48-hour notice softgoal appears in BPMN only as a label and one check. Nothing shows what happens if notice cannot be met. | The softgoal is hard to trace to real behaviour. | Group decision; see question 3 in the i* analysis record. |
| F6 | Durations in the BPMN models (30 minutes, 10 minutes, 2 days, 7 days, 1 day, 30 seconds) are not in the brief. The operational ones are tagged "(assumed)"; the strategic ones are not. | Unstated rules should not look like requirements. | Tag the strategic timers as assumed too, or remove them. |

## 6. Summary

- All 4 i* actors, all 11 SD dependencies and every SR element trace into both BPMN files, apart from the PayPal and softgoal gaps above.
- 6 inconsistencies to fix or decide: F1 to F6.
- Not verified: I checked names and structure by reading the files. I did not run the models in Camunda.
