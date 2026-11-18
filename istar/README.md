# i* models for Use Case 2: Customer Multi-Vendor Order, Checkout and Payment
 
## 1. What is in this folder
 
| File | What it is |
|---|---|
| `SD.svg`, `SD.txt` | Strategic Dependency model (who relies on whom, for what) |
| `SR.svg`, `SR.txt` | Strategic Rationale model (the Marketplace's reasoning, boundary opened) |
| `README.md` | This file |
 
Both models were drawn in the piStar tool (iStar 2.0): https://www.cin.ufpe.br/~jhcp/pistar/tool/. The `.svg` files are the exported pictures. The `.txt` files are the saved models. To open one, go to the piStar tool, choose Load Model and pick the `.txt` file. To change a model, edit it in piStar, then save it and export the SVG again.
 
## 2. Why i* and what it adds to the BPMN
 
The brief asks for an SD and an SR model showing how stakeholder goals, expectations, responsibilities and dependencies influence the requirements and design. The project path in the brief is: i* models, then strategic BPMN, then operational BPMN, then Camunda automation.
 
- BPMN says **how work progresses** (sequence, gateways, messages).
- i* says **who needs what from whom, and why an actor chooses one way of working over another**.
An i* dependency is not a BPMN message, and an OR-refinement is not a BPMN XOR gateway. The diagrams do not show order or timing.
 
## 3. Scope and sources
 
- **Scope: Use Case 2 only** (customer multi-vendor order, checkout and payment). No other use case is modelled.
- **Evidence:** the assessment case study and the Task 1 use cases and brief. Used here: secure payment for single and multi-vendor orders, the 5% commission, the sandbox requirement (Stripe and PayPal sandboxes), producers needing at least 48 hours' notice, some producers using only email or phone, and producers setting and updating stock quantities.
- **Not invented:** anything the sources do not state is tagged as an assumption on the diagram (A1 to A3, section 7).
- **Lab note:** the Week 12 lab says to use the ProBuild tutorial case. These models use the group's assessment case (Use Case 2) instead.
## 4. Notation: iStar 2.0 (piStar) and how it differs from the lecture
 
The Week 12 lecture teaches classic i*. The lab says piStar uses iStar 2.0, so the models use iStar 2.0 throughout and the differences are recorded here.
 
| Idea | Lecture (classic i*) | piStar (iStar 2.0), as used here |
|---|---|---|
| Quality to achieve | Softgoal | Quality (wavy shape) |
| Splitting a task into parts | Task decomposition | AND-refinement link (all parts are required) |
| Alternative ways to reach an end | Means-end | OR-refinement link |
| Resource a task needs | Resource linked to the task | Needed-by link |
| Contribution to a quality | Make, Hurt | Make, Hurt (the tool also offers Help and Break; not used) |
| Dependency | Depender, dependum, dependee, D marker toward the dependee | Same idea |
 
Shapes: circle is an actor, rounded capsule is a goal, hexagon is a task, rectangle is a resource, wavy shape is a quality.
 
One iStar 2.0 rule changes the SR: an element that is refined cannot be the depender in a dependency. So dependencies where the Marketplace relies on someone attach to the lowest-level tasks, for example "Take card payment" rather than "Payment taken".
 
## 5. Strategic Dependency model (SD)
 
Four actors: **Customer**, **Local Food Marketplace**, **Payment gateway (sandbox)**, **Producer** (one of the 40 SMEs). Internals are hidden. 14 dependencies, all four types:
 
| Depender | Dependum (type) | Dependee |
|---|---|---|
| Customer | Stock availability confirmed (goal) | Marketplace |
| Marketplace | Amend the order (task) | Customer |
| Customer | Delivery or collection time (resource) | Marketplace |
| Marketplace | Confirm the purchase (task) | Customer |
| Customer | Order confirmed (goal) | Marketplace |
| Marketplace | Payment details (resource) | Customer |
| Marketplace | Payment decision made (goal) | Payment gateway |
| Marketplace | Payment status (resource) | Payment gateway |
| Payment gateway | Payment request (resource) | Marketplace |
| Producer | Adequate notice, 48 hours (quality) | Marketplace |
| Producer | Order details (resource) | Marketplace |
| Marketplace | Order prepared for handover (goal) | Producer |
| Marketplace | Hand over order to customer (task) | Producer |
| Marketplace | Up-to-date stock levels (resource) | Producer |
 
Read each row as: "the depender depends on the dependee for the dependum".
 
## 6. Strategic Rationale model (SR)
 
The focal actor is the Local Food Marketplace, with its boundary opened. The root task is Process customer order. It is AND-refined into parts that are all required: Check stock, Create and split order, Calculate producer amounts and 5% commission, and Confirm order to customer, plus three goals: Payment taken, Producers notified and Order handed over. Check stock needs the resource Stock levels, and the Marketplace depends on the Producer to keep those stock levels up to date.
 
Each of the three goals is OR-refined into two ways of reaching it. Payment taken can be met by taking a card payment or a PayPal payment (A1). Producers notified can be met by showing the order in the producer's list or by emailing or phoning the order. Order handed over can be met by arranging delivery or arranging collection, which can be straight from the producer (A3).
 
Two qualities sit alongside these choices: "Producer gets adequate notice (48 hours)" and "Every producer can be reached". Showing the order in the producer's list makes notice better (A2) but hurts reachability, because the case says some producers use only email or phone. Emailing or phoning the order makes reachability better but hurts notice (A2). Neither option satisfies both qualities, so the group needs to decide this trade-off with evidence.
 
The Customer, Payment gateway and Producer dependencies attach to the internal element that needs them (see the rule in section 4).
 
## 7. Assumptions to validate
 
A1 is PayPal as an alternative payment means. The case only names the Stripe and PayPal sandboxes; the alternative itself comes from teacher feedback. A2 is the Make and Hurt effects on the 48-hour notice quality. This is the group's judgement, not a case fact. A3 is that the customer can collect straight from the producer. This comes from teacher feedback, and the case does not state it.
 
## 8. Link to the BPMN and Camunda models
 
The full element-by-element check is in `docs/T14-Traceability-check.md`. In short: Payment taken and the gateway dependencies correspond to the payment steps in `camunda/payment/payment-order-processing.bpmn`. Check stock and the amend step correspond to `camunda/checkout/checkout-stock-validation.bpmn`. Producers notified, Create and split order and the 5% commission correspond to the payment process. The strategic model is `bpmn/BPMN sprint 2.bpmn`. PayPal (A1), the email or phone branch and the handover steps are in the i* and strategic models only, not in Camunda for Sprint 2.
 
## 9. Candidate requirements and questions
 
The models raise four questions for the group. How is the 48-hour notice enforced when a producer is reachable only by email or phone? Is PayPal in scope, or card only (A1)? What happens to a multi-vendor order if one producer cannot meet the notice period? Who confirms handover, the producer or the customer?
 
Note: AI was used in an assistive role in preparing this README.
