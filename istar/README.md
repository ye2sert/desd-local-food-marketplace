# i* models for Use Case 2: Customer Multi-Vendor Order, Checkout and Payment

## 1. What is in this folder

| File | What it is |
|---|---|
| `SD.png`, `SD.svg` | Strategic Dependency model (who relies on whom, for what) |
| `SR.png`, `SR.svg` | Strategic Rationale model (the Marketplace's reasoning, boundary opened) |
| `source/SD_source.py`, `source/SR_source.py` | Self-contained Python 3 scripts that rebuild each diagram as an SVG |
| `istar-UC2-analysis.md` | Analysis record: inventory, dependency record, vulnerability, trace, alternatives, BPMN comparison, requirements |
| `README.md` | This file |

To change a diagram, edit the matching `_source.py` and run it (`python3 SD_source.py` writes `SD.svg`). The SVG opens in Inkscape, draw.io or Figma.

## 2. Why i* and what it adds to the BPMN

The brief asks for an SD and an SR model showing how stakeholder goals, expectations, responsibilities and dependencies influence the requirements and design. The project path in the brief is: i* models, then strategic BPMN, then operational BPMN, then Camunda automation.

- BPMN says **how work progresses** (sequence, gateways, messages).
- i* says **who needs what from whom, and why an actor chooses one way of working over another**.

An i* dependency is not a BPMN message, and a means-end link is not a BPMN XOR gateway. The diagrams do not show order or timing.

## 3. Scope and sources

- **Scope: Use Case 2 only** (customer multi-vendor order, checkout and payment). No other use case is modelled.
- **Evidence:** the assessment case study and the Task 1 use cases and brief. Used here: secure payment for single and multi-vendor orders, the 5% commission, the sandbox requirement (Stripe and PayPal sandboxes), producers needing at least 48 hours' notice, and some producers using only email or phone.
- **Not invented:** anything the sources do not state is tagged as an assumption on the diagram (A1, A2).
- **Lab note:** the Week 12 lab says to use the ProBuild tutorial case. These models use the group's assessment case (Use Case 2) instead. If the tutor wants ProBuild for the lab itself, the models need redoing.

## 4. Notation used (from the lecture slides)

| Symbol | Meaning |
|---|---|
| Circle | Actor |
| Rounded capsule | Hard goal: an outcome with a clear test of being achieved |
| Hexagon | Task: work to perform, or a specified way to achieve an outcome |
| Rectangle | Resource: a physical or informational entity |
| Wavy outline | Softgoal: a quality whose adequate achievement needs interpretation |
| Line with a D marker | Dependency. Depender, then dependum, then dependee. The D faces the dependee |
| Short bar at the parent task end | Task decomposition: all parts are required |
| Arrow from means to end | Means-end: alternative ways to achieve one end |
| Labelled arrow to a softgoal | Contribution: Make (positive) or Hurt (negative) |
| Dashed boundary with the actor on its rim | SR actor boundary |

Dependency types, by what is expected of the dependee: goal (achieve an outcome), task (perform a specified activity), resource (make an entity available), softgoal (support a quality).

## 5. Strategic Dependency model (SD)

Four actors: **Customer**, **Local Food Marketplace**, **Payment gateway (sandbox)**, **Producer** (one of the 40 SMEs). Internals are hidden. 11 dependencies, all four types:

| Depender | Dependum (type) | Dependee |
|---|---|---|
| Customer | Stock availability confirmed (goal) | Marketplace |
| Customer | Order confirmed (goal) | Marketplace |
| Customer | Delivery or collection time (resource) | Marketplace |
| Marketplace | Payment details (resource) | Customer |
| Marketplace | Payment decision made (goal) | Payment gateway |
| Marketplace | Payment status (resource) | Payment gateway |
| Payment gateway | Payment request (resource) | Marketplace |
| Marketplace | Order prepared for handover (goal) | Producer |
| Marketplace | Hand over order to customer (task) | Producer |
| Producer | Order details (resource) | Marketplace |
| Producer | Adequate notice, 48 hours (softgoal) | Marketplace |

Read each row aloud as: "the depender depends on the dependee for the dependum". The full record with evidence is in `istar-UC2-analysis.md`.

## 6. Strategic Rationale model (SR)

The focal actor is the Local Food Marketplace, with its boundary opened. The root task is Process customer order. It is decomposed into parts that are all required: Check stock, Create and split order, Calculate producer amounts and 5% commission, and Confirm order to customer, plus three goals: Payment taken, Producers notified and Order handed over. Check stock needs the resource Stock levels.

Each of the three goals can be reached in two ways (means-end). Payment taken can be met by taking a card payment or a PayPal payment (A1). Producers notified can be met by showing the order in the producer's list or by emailing or phoning the order. Order handed over can be met by arranging delivery or arranging collection.

Two softgoals sit alongside these choices: "Producer gets adequate notice (48 hours)" and "Every producer can be reached". Showing the order in the producer's list makes notice better (A2) but hurts reachability, because the case says some producers use only email or phone. Emailing or phoning the order makes reachability better but hurts notice (A2). Neither option satisfies both softgoals, so the group needs to decide this trade-off with evidence.

The Customer, Payment gateway and Producer dependencies from the SD attach to the internal element that needs them. For example, the four payment dependencies attach to Payment taken.

## 7. Assumptions to validate

A1 is PayPal as an alternative payment means. The case only names the Stripe and PayPal sandboxes; the alternative itself comes from teacher feedback. A2 is the Make and Hurt effects on the 48-hour notice softgoal. This is the group's judgement, not a case fact.

## 8. Link to the BPMN models

Payment taken and the gateway dependencies correspond to the payment steps in the operational BPMN: the payment request, the status check, and approved or declined. Producers notified and the 48-hour softgoal correspond to the "Notify each producer" drill-down. Producer amounts and the 5% commission correspond to the commission task in the operational BPMN. The files are in `uc2-bpmn-merged/` (operational) and `final-strategic/` (strategic).

## 9. Candidate requirements and questions

The models raise four questions for the group. How is the 48-hour notice enforced when a producer is reachable only by email or phone? Is PayPal in scope, or card only (A1)? What happens to a multi-vendor order if one producer cannot meet the notice period? Who confirms handover, the producer or the customer?

Note: AI was used in an assistive role in preparing this README.
