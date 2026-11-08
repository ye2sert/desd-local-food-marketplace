# desd-local-food-marketplace

UFCFTR-30-3 Distributed and Enterprise Software Development – Task 1
Bristol Regional Food Network – Digital Marketplace

**Project board (Jira):** https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1
**Current sprint:** Sprint 2 – i* models, operational BPMN and initial Camunda automation (29 Oct – 19 Nov 2026)

*Jira access is by invitation. Viewer access has been granted to the module team (Kun Wei, Khoa Phung and Dilshan Jayatilake).*
## Use case

**Use Case 2: Customer Multi-Vendor Order, Checkout and Payment.**
A customer buys products from one or more local producers in a single order. The system checks stock, processes payment through a simulated payment service, updates inventory, notifies producers and calculates the marketplace's 5% commission.

## Proposed functionalities

1. **Checkout & Stock Validation** – covers the multi-vendor basket, stock checks at checkout, amending orders when stock is insufficient, grouping by producer with delivery or collection arrangements, and order confirmation.
2. **Payment & Order Processing** – covers payment through a simulated external service, declined payments with retry, payment service unavailability, splitting the order by producer, inventory updates, producer notification and the 5% commission.

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
| `camunda/` | Executable processes, Forms and service tasks; `payment-service/` contains the simulated payment service worker (Sprint 2 onwards) |
| `docs/` | Analysis and sprint documents |
| `project-management/` | Sprint plans and Jira backlog screenshots |

## Running locally

We use **Camunda 8** for process automation. To run the processes on your own machine:

### 1. Start Camunda
1. Install **Java 21**.
2. Download **Camunda 8 Run 8.10.9** for your OS ([download page](https://docs.camunda.io/docs/self-managed/quickstart/developer-quickstart/c8run/install-start/)) and extract it.
3. In the extracted `c8run-8.10.9` folder, start Camunda with `./start.sh` (Windows: `.\c8run.exe start`). Stop it with `./shutdown.sh` (Windows: `.\c8run.exe stop`).
4. Open **Operate** at http://localhost:8080/operate and **Tasklist** at http://localhost:8080/tasklist. Log in with `demo` / `demo`.

### 2. Open and deploy processes
1. Install **Camunda Desktop Modeler 5.52.0** ([download page](https://camunda.com/download/modeler/)).
2. Open a `.bpmn` file from the `camunda/` folder.
3. Click the **rocket icon** to deploy to the local **c8run** cluster (authentication: None), then the **play icon** to start an instance.

### 3. Run the simulated payment service
The payment service is a Node.js job worker that completes the "Process payment" service task (job type `payment-service`) and returns `paymentStatus = "success"`.

1. Install **Node.js**.
2. In a terminal:
   ```bash
   cd camunda/payment-service
   npm install
   node worker.js
   ```
3. Leave the worker running, then deploy and start `payment-test.bpmn`. The instance should complete in Operate with `paymentStatus` and `transactionId` variables.

## Key documents

- [Sprint 1 plan](project-management/sprint-1-plan.md)
- [Sprint 2 plan](project-management/sprint-2-plan.md)
- [Product backlog (Jira)](https://live-team-oq9nzy44.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)

*AI was used in an assistive role throughout this document. It was reviewed by our team and changes were made.*
