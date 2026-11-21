# Sprint 3 Plan – Final Implementation, Integration and In-Class Demonstration

**Sprint dates:** 23 November 2026 – 10 December 2026
**Final demonstration:** in class [date to be confirmed]
**Repository deadline:** before 14:00 on Thursday 10 December 2026 (no 48-hour late window)

## Sprint goal
Link checkout and payment into one working end-to-end flow in Camunda, automate every alternative and exception path (insufficient stock, payment declined, payment service unavailable), complete the remaining forms, make the i* models, strategic BPMN, operational BPMN and Camunda implementation consistent, evaluate the legal, ethical, social and professional issues, and give a clear final demonstration.

## What Sprint 3 is marked on

Sprint 3 is 50% of the Task 1 group mark.

| Criterion | Weight | Covered by |
|---|---|---|
| End-to-end process automation | 30% | T18, US3, US7, US8, T24, T26, T19, PW9 |
| Camunda Forms and process implementation | 15% | PW6c, PW6d, US11 |
| Service, interface and process integration | 15% | T18, T19, T23, T24 |
| Model consistency and Task 2 integration readiness | 15% | T20, T21, T22, T25 |
| Legal, ethical, social and professional evaluation | 10% | PW7 |
| In-class demonstration, technical understanding and Q&A | 15% | PW8, all members |

## Team and roles

| Member | Role | Sprint 3 focus |
|---|---|---|
| Hamza | Strategic BPMN & integration | Linking checkout to payment, SR model feedback, traceability |
| Tahmid | Business analyst & stock service | Stock service tests and errors, SD refinement, weekly settlement, Task 2 readiness |
| Yunus | Functionality lead – Checkout & Stock Validation | Insufficient-stock path and amend form, checkout exception paths, browse and search |
| Mackenzie | Functionality lead – Payment & Order Processing | Declined and unavailable payment paths, single stock file, end-to-end testing |
| Rohan | Product owner / project management | Payment service responses, payment-declined form, LESP evaluation, sprint tracking |

## Feedback carried into Sprint 3

| Source | Feedback | Item |
|---|---|---|
| Sprint 2 review | Only one actor is expanded in the SR model | T20 |
| T14 traceability check | Findings F1–F9 (names differ between models, two stock files, missing forms, handover scope) | T21, T19, PW6c, PW6d |
| Sprint 2 outcome | Checkout and payment are not linked; payment is started by hand | T18 |

## Sprint 3 items

| ID | Item | Owner | Priority | Points |
|---|---|---|---|---|
| T18 | Link checkout to payment with a call activity, so one order runs end to end without copying variables | Hamza | Must | 5 |
| US3 | Unavailable or insufficient stock: customer amends the basket and the stock check runs again | Yunus | Must | 3 |
| PW6d | Camunda Form – amend basket | Yunus | Must | 2 |
| T26 | Checkout exception paths in Camunda: stock service unavailable and 30-minute timeout | Yunus | Should | 2 |
| US4 | Order grouped by producer with delivery or collection (largely delivered in Sprint 2; check acceptance criteria and close) | Yunus | Should | 3 |
| US11 | Browse and search products | Yunus | Could | 3 |
| T23 | Stock service: unit tests, `STOCK_SERVICE_UNAVAILABLE` error and reason codes | Tahmid | Must | 3 |
| T22 | Refine SD model: collapse actors, add missing dependencies, use agreed names | Tahmid | Should | 2 |
| T25 | Task 2 integration readiness: how the processes, workers and data carry into the final product | Tahmid | Must | 2 |
| US12 | Weekly producer settlement with audit trail | Tahmid | Could | 5 |
| US7 | Payment declined: customer is told and can retry or cancel | Mackenzie | Must | 3 |
| US8 | Payment service unavailable: retry, then flag for admin and tell the customer | Mackenzie | Should | 5 |
| T19 | Single shared stock file: `update-stock` reads and writes `camunda/shared/stock.json`, with a reset copy | Mackenzie | Should | 3 |
| PW9 | End-to-end testing of both processes, including every exception path | Mackenzie | Must | 3 |
| T24 | Simulated payment service returns DECLINED and simulates being unavailable | Rohan | Must | 3 |
| PW6c | Camunda Form – payment declined (retry or cancel) | Rohan | Must | 2 |
| PW7 | Legal, ethical, social and professional evaluation | Rohan | Must | 3 |
| T27 | Sprint 3 planning, board tracking, README and final repository check | Rohan | Must | 1 |
| T20 | Expand Customer, Producer and Payment gateway in the SR model (Sprint 2 review feedback) | Hamza | Must | 3 |
| T21 | Resolve T14 findings and repeat the traceability check on the final models | Hamza | Must | 2 |
| PW8 | Final demonstration and signed Contribution Matrix | All | Must | 3 |

Changes from the backlog, to be confirmed at Sprint 3 planning:
- PW6 is split into PW6c (payment declined form, Rohan) and PW6d (amend basket form, Yunus), because each form belongs to that person's part of the process.
- PW7 moves from Hamza to Rohan, as planned in the Sprint 2 contribution plan.
- US8 moves from Hamza to Mackenzie, because the retry and flag path is in her BPMN and workers. Hamza takes T18 instead.
- US12 moves to Tahmid.

## Sprint 3 points by member

| Member | Items | Points |
|---|---|---|
| Hamza | T18, T20, T21 | 10 |
| Tahmid | T22, T23, T25, US12 | 12 |
| Yunus | US3, US4, US11, PW6d, T26 | 13 |
| Mackenzie | US7, US8, T19, PW9 | 14 |
| Rohan | PW6c, PW7, T24, T27 | 9 |
| | **Total** | **58** |

PW8 is shared by everyone and not counted.

## Contribution plan (all sprints)

Shared items (T11, T12, T16, PW8) are excluded because everyone does them together.

| Member | Sprint 1 | Sprint 2 | Sprint 3 (planned) | Total | Share |
|---|---|---|---|---|---|
| Hamza | 8 | 10 | 10 | 28 | 20% |
| Tahmid | 6 | 10 | 12 | 28 | 20% |
| Yunus | 3 | 11 | 13 | 27 | 19% |
| Mackenzie | 4 | 11 | 14 | 29 | 21% |
| Rohan | 6 | 12 | 9 | 27 | 19% |
| | | | **Total** | **139** | **100%** |

Planned points are only a guide. The signed Contribution Matrix (PW8) will reflect the work each member actually delivered, as shown by the repository and Jira.

## Decisions needed at Sprint 3 planning
- **One name for each actor** across i*, strategic BPMN, operational BPMN and Camunda (T14 finding F1): the marketplace and the payment service.
- **Physical handover** (delivery and collection by producers): automate in Camunda, or mark as strategic-only and out of scope (T14 finding F5).
- **Commission model:** confirm with the module team that the 5% commission is deducted from the producer's amount.

## Dependencies
- T24 (payment service responses) comes before US7 and US8 can be tested.
- T23 (stock service error) comes before T26 (checkout stock-service-unavailable path).
- T18 (call activity) comes before PW9, which tests the linked flow.
- US3 and PW6d are built together: the form sends the amended basket back to the stock check.
- T19 is agreed between Mackenzie and Tahmid, because both workers use the same stock file.
- T20 and T22 come before T21 repeats the traceability check.

## Timeline

| Dates | Activity |
|---|---|
| 23 – 29 Nov | Sprint planning and decisions; T24 and T23 first; T18 call activity; start US3, US7, US8 and the forms; start T20 and T22 |
| 30 Nov – 6 Dec | Exception paths and forms working; T19 single stock file; PW7 evaluation; T21 traceability re-check; T25 Task 2 note |
| 7 – 10 Dec | PW9 end-to-end testing and evidence; rehearse the final demonstration; agree and sign the Contribution Matrix; final README and repository check before 14:00 on 10 Dec |

## Definition of done
- Work is committed to the repository by the person who did it, or labelled as co-authored.
- Commit messages include the Jira key (e.g. SCRUM-7).
- Another member has reviewed it (pull request or group meeting).
- It runs from `main` with the steps in the README, and evidence is added to `camunda/evidence/`.
- The item is moved to Done in Jira.

## Risks

| Risk | Action | Status |
|---|---|---|
| Linking the two processes breaks the working flow before the demo | Do T18 in week 1 on its own branch; keep the Sprint 2 manual flow as a fallback | Open |
| i* and BPMN models must be the group's own work (AI-generated models are not allowed) | Models drawn by their owners in piStar and the Camunda Modeler, with source files committed | Open |
| Two workers writing the shared stock file use up stock during rehearsals | Keep a reset copy of the starting stock and reset it before the demo | Open |
| Contribution is uneven and lowers individual marks | Track work honestly in Jira; review points at each stand-up | Open |
| Repository not final by 14:00 on 10 Dec (no late window) | Finish features by 7 Dec; only fixes and evidence after that | Open |
| GitHub not yet linked to Jira | Rohan and ye2sert complete the GitHub for Atlassian connection | Open |

*AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
