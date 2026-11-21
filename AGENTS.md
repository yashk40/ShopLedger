# ShopLedger

## Stack
- Node.js CommonJS application using Express and body-parser.
- Static HTML, CSS, and browser JavaScript are served from `public/`.
- Application data is persisted in `data/db.json` through synchronous filesystem reads and writes.

## Module map
- `routes/products.js` — product catalog and active-coupon endpoints.
- `routes/orders.js` — list, retrieve, create, and cancel orders.
- `routes/customers.js` — customer/settlement endpoints.
- `routes/reports.js` — dashboard, reconciliation, pricing-preview, and export endpoints.
- `lib/coupons.js` — normalizes, validates, calculates, and lists coupons from config.
- `lib/dates.js` — creates and normalizes dates and derives fiscal years.
- `lib/inventory.js` — finds products and checks, reserves, releases, and summarizes stock.
- `lib/invoice.js` — computes printable invoice figures and renders invoice HTML.
- `lib/ledger.js` — reads customer balances and applies Khata charges, reversals, and settlements.
- `lib/orders.js` — creates, retrieves, cancels, and filters order records.
- `lib/pricing.js` — calculates subtotals, coupon discounts, GST, and checkout totals.
- `lib/reports.js` — builds dashboard data and invoice-versus-ledger GST reconciliation.
- `lib/store.js` — reads, writes, initializes, and audits the JSON datastore.
- `lib/tax.js` — resolves GST rates and splits GST into CGST and SGST.

## Commands
- `npm start` — start the app with `node server.js`.
- `node --test` — run Node's test runner; no test files exist today.

## Rules
1. Write characterization tests before changing behaviour.
2. Change only the module(s) the ticket is about.
3. Tests never read or write `data/db.json`; they use in-memory data.
4. Add no dependencies.
5. Make the smallest fix that works.

## Current ticket
Invoice total and GST breakdown do not match what the customer was billed.

Allowed files: `lib/invoice.js` (`lib/tax.js` only if truly needed).
