var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function calculate(order) {
  return {
    invoice: invoice.computeInvoiceFigures(order),
    checkout: pricing.computeTotals(order.items, order.coupon)
  };
}

test('CURRENT BEHAVIOUR: #1001 uses supplied 5% and 12% GST rates without a coupon', function () {
  var result = calculate({
    id: 1001,
    coupon: '',
    items: [
      { name: 'Toor Dal', price: 165, qty: 2, hsn: '0713', gstRate: 5 },
      { name: 'Table Butter', price: 260, qty: 1, hsn: '0405', gstRate: 12 }
    ]
  });

  assert.deepEqual(result.invoice, {
    subtotal: 590, discount: 0, tax: 47.7, cgst: 23.85, sgst: 23.85, total: 637.7,
    rows: [
      { name: 'Toor Dal', sku: '-', hsn: '0713', qty: 2, price: 165, gstPercent: 5, line: 330, lineTax: 16.5 },
      { name: 'Table Butter', sku: '-', hsn: '0405', qty: 1, price: 260, gstPercent: 12, line: 260, lineTax: 31.2 }
    ]
  });
  assert.equal(result.checkout.total, 637.7);
});

test('CURRENT BEHAVIOUR: #1002 SAVE10 applies capped discount before tax', function () {
  var result = calculate({
    id: 1002,
    coupon: 'SAVE10',
    items: [
      { name: 'Basmati Rice', price: 640, qty: 1, hsn: '1006', gstRate: 5 },
      { name: 'Sunflower Oil', price: 190, qty: 2, hsn: '1512', gstRate: 5 }
    ]
  });

  assert.deepEqual(result.invoice, {
    subtotal: 1020, discount: 102, tax: 45.9, cgst: 22.95, sgst: 22.95, total: 963.9,
    rows: [
      { name: 'Basmati Rice', sku: '-', hsn: '1006', qty: 1, price: 640, gstPercent: 5, line: 640, lineTax: 28.8 },
      { name: 'Sunflower Oil', sku: '-', hsn: '1512', qty: 2, price: 190, gstPercent: 5, line: 380, lineTax: 17.1 }
    ]
  });
  assert.equal(result.checkout.discount, 102);
  assert.equal(result.checkout.tax, 45.9);
  assert.equal(result.checkout.total, 963.9);
});

test('CURRENT BEHAVIOUR: #1004 SAVE10 applies the ₹150 cap and discounts before tax', function () {
  var result = calculate({
    id: 1004,
    coupon: 'SAVE10',
    items: [
      { name: 'Groundnut Oil', price: 1120, qty: 2, hsn: '1508', gstRate: 5 }
    ]
  });

  assert.deepEqual(result.invoice, {
    subtotal: 2240, discount: 150, tax: 104.5, cgst: 52.25, sgst: 52.25, total: 2194.5,
    rows: [
      { name: 'Groundnut Oil', sku: '-', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  });
  assert.equal(result.checkout.discount, 150);
  assert.equal(result.checkout.tax, 104.5);
  assert.equal(result.checkout.total, 2194.5);
});

test('CURRENT BEHAVIOUR: #1008 keeps invoice and checkout totals aligned for 18% items without a coupon', function () {
  var result = calculate({
    id: 1008,
    coupon: '',
    items: [
      { name: 'Masala Chai', price: 140, qty: 1, hsn: '0902', gstRate: 18 },
      { name: 'Kokum Sherbet', price: 180, qty: 2, hsn: '2106', gstRate: 18 }
    ]
  });

  assert.deepEqual(result.invoice, {
    subtotal: 500, discount: 0, tax: 90, cgst: 45, sgst: 45, total: 590,
    rows: [
      { name: 'Masala Chai', sku: '-', hsn: '0902', qty: 1, price: 140, gstPercent: 18, line: 140, lineTax: 25.2 },
      { name: 'Kokum Sherbet', sku: '-', hsn: '2106', qty: 2, price: 180, gstPercent: 18, line: 360, lineTax: 64.8 }
    ]
  });
  assert.equal(result.checkout.total, 590);
});

test('correct behaviour: #1004 invoice uses its HSN slab and the capped checkout discount', function () {
  var order = {
    id: 1004,
    coupon: 'SAVE10',
    items: [
      { name: 'Groundnut Oil', price: 1120, qty: 2, hsn: '1508' }
    ]
  };

  assert.deepEqual(invoice.computeInvoiceFigures(order), {
    subtotal: 2240, discount: 150, tax: 104.5, cgst: 52.25, sgst: 52.25, total: 2194.5,
    rows: [
      { name: 'Groundnut Oil', sku: '-', hsn: '1508', qty: 2, price: 1120, gstPercent: 5, line: 2240, lineTax: 104.5 }
    ]
  });
});
