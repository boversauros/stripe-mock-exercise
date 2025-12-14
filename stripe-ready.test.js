import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  invoice,
  overDiscountInvoice,
  multipleCreditsInvoice,
  malformedInvoice,
  unknownCreditTypeInvoice,
  wrongQuantityInvoice,
  emptyInvoice,
} from './data.js';
import { computeInvoiceTotal } from './stripe-ready.js';

describe('computeInvoiceTotal', () => {
  it('should return expected totals for happy path', () => {
    const result = computeInvoiceTotal(invoice);
    const expectedResult = {
      subtotalCents: 1980,
      taxCents: 416,
      totalCents: 2396,
    };

    assert.deepEqual(result, expectedResult);
  });

  it('should handle empty invoice', () => {
    const result = computeInvoiceTotal(emptyInvoice);
    const expectedResult = {
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
    };

    assert.deepEqual(result, expectedResult);
  });

  it('should handle over-discounted invoice', () => {
    const result = computeInvoiceTotal(overDiscountInvoice);
    const expectedResult = {
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
    };

    assert.deepEqual(result, expectedResult);
  });

  it('should handle multiple credits', () => {
    const result = computeInvoiceTotal(multipleCreditsInvoice);
    const expectedResult = {
      subtotalCents: 5728,
      taxCents: 859,
      totalCents: 6587,
    };

    assert.deepEqual(result, expectedResult);
  });

  it('should throw on malformed invoice', () => {
    assert.throws(() => computeInvoiceTotal(malformedInvoice), {
      name: 'Error',
      message: 'unitPriceCents must be an integer >= 0',
    });
  });

  it('should throw on unknown credit type', () => {
    assert.throws(() => computeInvoiceTotal(unknownCreditTypeInvoice), {
      name: 'Error',
      message: 'unknown credit type: unknown',
    });
  });

  it('should throw on wrong quantity', () => {
    assert.throws(() => computeInvoiceTotal(wrongQuantityInvoice), {
      name: 'Error',
      message: 'quantity must be an integer >= 0',
    });
  });
});
