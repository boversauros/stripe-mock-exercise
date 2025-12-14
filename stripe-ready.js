function validateCredit(c) {
  if (c.type === 'fixed') {
    if (!Number.isInteger(c.amountCents) || c.amountCents < 0) {
      throw new Error('fixed credit amountCents must be an integer >= 0');
    }
  } else if (c.type === 'percent') {
    if (typeof c.rate !== 'number' || c.rate < 0 || c.rate > 1) {
      throw new Error('percent credit rate must be a number between 0 and 1');
    }
  } else {
    throw new Error(`unknown credit type: ${c.type}`);
  }
}

function computeSubtotalCents(rawSubtotalCents, credits) {
  if (!Number.isInteger(rawSubtotalCents) || rawSubtotalCents < 0) {
    throw new Error('raw subtotal must be an integer >= 0');
  }
  if (!Array.isArray(credits)) {
    throw new Error('credits must be an array');
  }

  let subtotal = rawSubtotalCents;

  const listedCredits = {
    fixed: 0,
    percent: [],
  };

  for (const credit of credits) {
    if (!credit || typeof credit !== 'object')
      throw new Error('credit must be an object');

    validateCredit(credit);

    if (credit.type === 'fixed') {
      listedCredits.fixed += credit.amountCents;
    } else if (credit.type === 'percent') {
      listedCredits.percent.push(credit.rate);
    }
  }

  subtotal = Math.max(0, subtotal - listedCredits.fixed);

  for (const rate of listedCredits.percent) {
    const discount = Math.round(subtotal * rate);
    subtotal = Math.max(0, subtotal - discount);
  }

  return subtotal;
}

function computeInvoiceTotal(invoice) {
  if (!invoice || typeof invoice !== 'object')
    throw new Error('invoice must be an object');

  const { lineItems, credits = [], taxRate } = invoice;

  if (typeof taxRate !== 'number' || taxRate < 0 || taxRate > 1) {
    throw new Error('taxRate must be a number between 0 and 1');
  }
  if (!Array.isArray(lineItems)) throw new Error('lineItems must be an array');

  const rawSubtotalCents = lineItems.reduce((acc, item) => {
    if (!item || typeof item !== 'object')
      throw new Error('lineItem must be an object');

    const { unitPriceCents, quantity } = item;

    if (!Number.isInteger(unitPriceCents) || unitPriceCents < 0) {
      throw new Error('unitPriceCents must be an integer >= 0');
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      throw new Error('quantity must be an integer >= 0');
    }

    return acc + unitPriceCents * quantity;
  }, 0);

  const subtotalCents = computeSubtotalCents(rawSubtotalCents, credits);
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  return { subtotalCents, taxCents, totalCents };
}

export { computeInvoiceTotal };
