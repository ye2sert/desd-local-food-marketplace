# desd-local-food-marketplace

UFCFTR-30-3 Distributed and Enterprise Software Development – Task 1
Bristol Regional Food Network – Digital Marketplace

**Project board (Jira):** https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1
**Current sprint:** Sprint 1 – Strategic Process Analysis and Project Setup (12 Oct – 29 Oct 2026)

*Jira access is by invitation. Viewer access has been granted to the module team (Kun Wei, Khoa Phung and Dilshan Jayatilake).*
## Use case

**Use Case 2: Customer Multi-Vendor Order, Checkout and Payment.**
A customer buys products from one or more local producers in a single order. The system checks stock, processes payment through a simulated payment service, updates inventory, notifies producers and calculates the marketplace's 5% commission.

## Proposed functionalities

1. **Checkout & Stock Validation** – covers the multi-vendor basket, stock checks at checkout, amending orders when stock is insufficient, grouping by producer with delivery or collection arrangements, and order confirmation.
2. **Payment & Order Processing** – covers payment through a simulated external service, declined payments with retry, payment service unavailability, splitting the order by producer, inventory updates, producer notification and the 5% commission. *(Awaiting module team approval.)*

## Team

| Member | Role |
|---|---|
| Hamza | Strategic BPMN & integration|
| Tahmid | Business analysis |
| Yunus | Checkout & Stock Validation |
| Mackenzie | Payment & Order Processing |
| Rohan | Backlog / project board |

## Repository structure

| Folder | Contents |
|---|---|
| `bpmn/` | Strategic and operational BPMN models |
| `istar/` | i* Strategic Dependency and Strategic Rationale models (Sprint 2) |
| `camunda/` | Executable processes, Forms and service tasks (Sprint 2 onwards) |
| `docs/` | Analysis and sprint documents |
| `project-management/` | Sprint plans and Jira backlog screenshots |

## Key documents

- [Sprint 1 plan](project-management/sprint-1-plan.md)
- [Product backlog (Jira)](https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)

*AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
