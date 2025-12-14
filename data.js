const invoice = {
  currency: 'USD',
  taxRate: 0.21, // 21% (can be 0)
  lineItems: [
    { description: 'A', unitPriceCents: 1200, quantity: 2 }, // positive charges
    { description: 'B', unitPriceCents: 500, quantity: 1 },
  ],
  credits: [
    { type: 'fixed', amountCents: 700 }, // subtract from subtotal
    { type: 'percent', rate: 0.1 }, // 10% off subtotal AFTER fixed credits
  ],
};

const multipleCreditsInvoice = {
  currency: 'USD',
  taxRate: 0.15, // 15%
  lineItems: [
    { description: 'Service X', unitPriceCents: 3000, quantity: 1 },
    { description: 'Service Y', unitPriceCents: 1500, quantity: 3 },
  ],
  credits: [
    { type: 'fixed', amountCents: 500 },
    { type: 'fixed', amountCents: 300 },
    { type: 'percent', rate: 0.05 }, // 5%
    { type: 'percent', rate: 0.1 }, // 10%
  ],
};

const malformedInvoice = {
  currency: 'USD',
  taxRate: 0.2,
  lineItems: [
    { description: 'Item 1', unitPriceCents: -1000, quantity: 1 }, // Invalid negative price
  ],
  credits: [{ type: 'fixed', amountCents: 200 }],
};

const unknownCreditTypeInvoice = {
  currency: 'USD',
  taxRate: 0.2,
  lineItems: [{ description: 'Item 1', unitPriceCents: 1000, quantity: 1 }],
  credits: [{ type: 'unknown', amountCents: 200 }], // Invalid credit type
};

const wrongQuantityInvoice = {
  currency: 'USD',
  taxRate: 0.2,
  lineItems: [{ description: 'Item 1', unitPriceCents: 1000, quantity: 1.5 }], // Invalid  quantity
  credits: [{ type: 'fixed', amountCents: 200 }],
};

const overDiscountInvoice = {
  taxRate: 0.21,
  lineItems: [{ unitPriceCents: 500, quantity: 1 }],
  credits: [{ type: 'fixed', amountCents: 10_000 }],
};

const emptyInvoice = {
  currency: 'USD',
  taxRate: 0.21,
  lineItems: [],
  credits: [],
};

export {
  invoice,
  overDiscountInvoice,
  multipleCreditsInvoice,
  malformedInvoice,
  unknownCreditTypeInvoice,
  wrongQuantityInvoice,
  emptyInvoice,
};
