import assert from 'node:assert/strict';
import test from 'node:test';
import { parseLengthInput } from '../lib/length-input.ts';

test('empty fields and zero stay usable without forcing text into the input', () => {
  for (const value of ['', ' ', '0', '0,0', '0.00']) {
    assert.equal(parseLengthInput(value), 0);
  }
});

test('comma and dot decimals produce the same numeric length', () => {
  for (const value of ['12,5', '12.5', ' 12,5 ', '012,50']) {
    assert.equal(parseLengthInput(value), 12.5);
  }
  assert.equal(parseLengthInput('70,25'), 70.25);
  assert.equal(parseLengthInput('0,125'), 0.125);
  assert.equal(parseLengthInput(',5'), 0.5);
  assert.equal(parseLengthInput('.5'), 0.5);
});

test('a trailing separator does not prevent typing the next decimal digit', () => {
  for (const value of ['12,', '12.']) assert.equal(parseLengthInput(value), 12);
  for (const value of [',', '.']) assert.equal(parseLengthInput(value), null);
});

test('rejects negative, ambiguous, malformed and infinite inputs', () => {
  for (const value of ['-1', '12,3,4', '12.3.4', '1.234,5', '1,234.5', '1 234', '2e3', 'abc', 'Infinity', '9'.repeat(400)]) {
    assert.equal(parseLengthInput(value), null, value);
  }
});
