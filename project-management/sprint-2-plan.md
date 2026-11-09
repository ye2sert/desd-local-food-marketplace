# Sprint 2 Plan – Socio-Technical and Operational Modelling with Initial Automation
 
**Sprint dates:** 29 October 2026 – 19 November 2026
**Review:** Thursday 19 November 2026 [format and submission time to be confirmed when announced]
 
## Sprint goal
Complete the i* SD and SR models, build detailed operational BPMN models for checkout and payment (including their exception paths) that trace back to the strategic BPMN and i* models, and get the main path of both processes running in Camunda with Forms and an initial simulated payment service.
 
## What Sprint 2 is marked on
 
| Criterion | Weight | Covered by |
|---|---|---|
| i* Strategic Dependency and Strategic Rationale models | 30% | PW1, PW2 |
| Operational BPMN models (incl. alternative and exception paths) | 35% | PW3, PW4 |
| Initial Camunda automation (Forms, user tasks, service tasks, variables, gateways, business logic) | 25% | PW5, PW6 (part), US1, US2, US5, US6, US9, US10 |
| Sprint progress, traceability and version control | 10% | T14, T15, T17, Jira, commits |

 
## Team and roles
 
| Member | Role | Sprint 2 focus |
|---|---|---|
| Hamza | Strategic BPMN & integration | i* SR model, strategic BPMN refinement, traceability |
| Tahmid | Business analyst | i* SD model, stock check |
| Yunus | Functionality lead – Checkout & Stock Validation | Checkout operational BPMN and main checkout path |
| Mackenzie | Functionality lead – Payment & Order Processing | Payment operational BPMN and order processing logic |
| Rohan | Product owner / project management | Camunda setup, payment service, Forms, sprint tracking |
 
## Sprint 2 items
 
| ID | Item | Owner | Points |
|---|---|---|---|
| PW1 | i* Strategic Dependency (SD) model | Tahmid | 5 |
| PW2 | i* Strategic Rationale (SR) model | Hamza | 5 |
| PW3 | Operational BPMN: Checkout & Stock Validation, including insufficient-stock path | Yunus | 5 |
| PW4 | Operational BPMN: Payment & Order Processing, including declined and unavailable payment paths | Mackenzie | 5 |
| PW5 | Camunda setup and initial simulated payment service (success response) | Rohan | 5 |
| PW6a | Camunda Forms – checkout: basket review and confirm order | Yunus | 2 |
| PW6b | Camunda Form – payment details | Rohan | 1 |
| US1 | Multi-vendor basket | Yunus | 3 |
| US2 | Stock check at checkout | Tahmid | 5 |
| US5 | Review and confirm order | Yunus | 1 |
| US6 | Pay through the payment service | Rohan | 5 |
| US9 | Producer notification and stock update | Mackenzie | 3 |
| US10 | Producer amounts and 5% commission | Mackenzie | 3 |
| T14 | Traceability check: i* → strategic BPMN → operational BPMN → Camunda | Hamza | 3 |
| T15 | Sprint 2 planning, board tracking and review preparation | Rohan | 1 |
| T16 | Plan and rehearse Sprint 2 review | All | 3 |
| T17 | Refine strategic BPMN after the Sprint 1 review | Hamza | 2 |
 
Left for Sprint 3: US3, US4, US7, US8, US11, US12, the amend and retry forms (rest of PW6), PW7, PW8, PW9.
Task status is tracked live on our Jira board: https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1

 
## Contribution plan (updated for Sprint 2)
 
Points by sprint for each member. Shared items (T11, T12, T16, PW8) are excluded because everyone does them together. Sprint 3 is planned and will be confirmed at Sprint 3 planning.
 
| Member | Sprint 1 | Sprint 2 | Sprint 3 (planned) | Total | Share |
|---|---|---|---|---|---|
| Hamza | T5, T6 (8) | PW2, T14, T17 (10) | US8, PW7 (8) | 26 | 23% |
| Tahmid | T3, T4 (6) | PW1, US2 (10) | US12 (5) | 21 | 19% |
| Yunus | T7 (3) | PW3, PW6a, US1, US5 (11) | US3, US4, US11 (9) | 23 | 21% |
| Mackenzie | T8, T9 (4) | PW4, US9, US10 (11) | US7, PW9 (6) | 21 | 19% |
| Rohan | T1, T2, T10, T13 (6) | PW5, PW6b, US6, T15 (12) | PW6 rest (2) | 20 | 18% |
| | | | **Total** | **111** | **100%** |

To rebalance, PW7 (3 points) is planned to move from Hamza to Rohan at Sprint 3 planning, giving 23 / 21 / 23 / 21 / 23.

## Timeline
 
| Date | Activity |
|---|---|
| Week 1 | Sprint planning; refine strategic BPMN; start i* models; draft operational BPMN; set up Camunda |
| Week 2 | Finish i* models; complete operational BPMN with exception paths; deploy main paths to Camunda; first Forms |
| Week 3 | Service tasks, variables and gateways working on the main path; traceability check; rehearse review |
 
## Definition of done
- Work is committed to the repository by the person who did it, or labelled as co-authored.
- Commit messages include the Jira key (e.g. SCRUM-21).
- Another member has reviewed it (pull request or group meeting).
- The item is moved to Done in Jira.
## Risks
 
| Risk | Action | Status |
|---|---|---|
| Camunda setup problems delay the whole team | Rohan starts PW5 in week 1 and adds setup steps to the README | Open |
| Checkout and payment processes overlap | Yunus and Mackenzie agree the handover point before modelling | Open |
| i* and BPMN models must be created by the group (AI-generated models are not allowed) | All models drawn by their owners and reviewed by the group | Open |
| GitHub not yet linked to Jira | Rohan and ye2sert complete the GitHub for Atlassian connection | Open |

   *AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
