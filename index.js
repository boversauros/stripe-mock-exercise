import invoice from './data.js';

function calculateSubTotal(rawTotal, credits) {
  if (typeof rawTotal !== 'number') {
    throw new Error('Raw total has to be a number');
  }

  if (!Array.isArray(credits)) {
    throw new Error('Credits has to be a list');
  }

  let result = rawTotal;

  const [fixed, percent] = credits.map(credit => {
    if (credit.type === 'fixed' && credit.amountCents <= 0) {
      throw new Error("Credit fixed can't be below 0");
    }

    if ((credit.type === 'percent' && credit.rate < 0) || credit.rate > 1) {
      throw new Error('Credit percent must be between 0 and 1');
    }

    return credit;
  });

  result -= fixed.amountCents;
  result = result - result * percent.rate;

  if (result < 0) throw new Error("Total can't go below 0");

  return result;
}

function computeInvoiceTotal(invoice) {
  const { lineItems, credits, taxRate } = invoice;
  if ((typeof taxRate !== 'number' && taxRate < 0) || taxRate > 1) {
    throw new Error('TaxRate has to be a number and has to be between 0 and 1');
  }

  const rawTotal = lineItems.reduce((acc, item) => {
    const { unitPriceCents, quantity } = item;
    if (typeof quantity !== 'number' && quantity <= 0) {
      throw new Error("Quantity can't be 0 or negative");
    }

    if (typeof unitPriceCents !== 'number' && unitPriceCents <= 0) {
      throw new Error("unitPriceCents can't be 0 or negative");
    }

    acc += unitPriceCents * quantity;
    return acc;
  }, 0);

  const subtotalCents = calculateSubTotal(rawTotal, credits);
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  return {
    subtotalCents,
    taxCents,
    totalCents,
  };
}

console.log(computeInvoiceTotal(invoice));
