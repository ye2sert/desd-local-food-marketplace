# Stock Check Service — US2

## Overview

This service implements **US2 — Stock Check at Checkout** for the Local Food Marketplace project using Camunda 8 and Node.js.

The service checks whether products in a customer's basket are available in the requested quantities before checkout continues.

## Files

- `camunda-worker.js` — Camunda 8 worker that handles `check-stock` jobs.
- `worker.js` — Stock validation logic.
- `package.json` — Node.js dependencies.
- `package-lock.json` — Dependency lock file.

## Stock Validation

The stock-check service:

1. Checks each basket item against available stock.
2. Rejects items with insufficient stock.
3. Rejects unavailable or out-of-season products.
4. Rejects invalid quantities.
5. Returns `allInStock`, `stockAvailable` and `stockIssues`.

## Shared Stock Data

The service reads stock quantities from:

`camunda/shared/stock.json`

This shared file is intended to be used by both checkout and payment workers so stock updates are reflected in subsequent checks.

## Running the Worker

Install dependencies:

```bash
npm install
```

Start the worker:

```bash
node camunda-worker.js
```

The worker connects to a locally running Camunda 8 instance and listens for `check-stock` jobs.

## Testing

The service can be tested using basket items with sufficient stock, insufficient stock, invalid quantities and products marked out of season.

## Jira Reference

**SCRUM-6 — US2: Stock check at checkout**

Owner: Tahmid
