import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculatePlate,
  calculateRequiredArea,
  calculateSquarePad,
  comparePressure,
  soilReferences,
  roundUpToHundredth,
} from '../lib/support-calculations.ts';
import { parseLengthInput } from '../lib/length-input.ts';
import {
  changeSupportUnit,
  dimensionUnits,
  forceUnits,
  pressureUnits,
  usesNativeUnitPicker,
} from '../lib/support-units.ts';

test('square manual example: 500 mm, 720 kN, 80% bearing area', () => {
  const result = calculatePlate(720, 500, 'square');
  assert.equal(result.area, 0.25);
  assert.equal(result.bearingArea, 0.2);
  assert.equal(result.pressure, 3600);
});

test('octagonal formula retains precision instead of using rounded 0.21 and 0.20', () => {
  const result = calculatePlate(720, 500, 'octagonal');
  assert.equal(result.area, 0.2075);
  assert.ok(Math.abs(result.bearingArea - 0.197125) < 1e-12);
  assert.ok(Math.abs(result.pressure - 3652.504755865567) < 1e-9);
  assert.notEqual(result.pressure, 3600);
});

test('required surface is per support and does not reuse the plate factors', () => {
  assert.equal(calculateRequiredArea(720, 200), 3.6);
  assert.equal(calculateRequiredArea(100, 4000), 0.025);
});

test('both decimal separators are usable for force, dimensions and soil pressure', () => {
  for (const separator of [',', '.']) {
    const result = calculatePlate(
      parseLengthInput(`720${separator}5`),
      parseLengthInput(`500${separator}5`),
      'square',
    );
    assert.ok(result.pressure > 0);
    assert.equal(
      calculateRequiredArea(
        parseLengthInput(`720${separator}5`),
        parseLengthInput(`200${separator}5`),
      ),
      720.5 / 200.5,
    );
  }
});

test('required area display rounds upward without an extra hundredth on exact decimals', () => {
  for (const value of [3.6, 0.28, 0.07, 1, 200])
    assert.equal(roundUpToHundredth(value), value);
  assert.equal(roundUpToHundredth(0.025), 0.03);
  assert.equal(roundUpToHundredth(3.600001), 3.61);
  assert.equal(roundUpToHundredth(1e-7), 0.01);
  assert.equal(roundUpToHundredth(1e307), 1e307);
});

test('notebook example uses the unrounded bearing area to get a 1 m square pad', () => {
  const pad = calculateSquarePad(calculateRequiredArea(784.5, 980.665));
  assert.ok(pad.totalArea > 0.9999 && pad.totalArea < 1);
  assert.ok(pad.sideM < 1);
  assert.equal(roundUpToHundredth(pad.sideM), 1);
});

test('the square pad result requires valid force and allowable pressure', () => {
  assert.equal(calculateSquarePad(calculateRequiredArea(784.5, 0)), null);
  assert.equal(calculateSquarePad(Number.MAX_VALUE), null);
});

test('mixed units reproduce the notebook pressure and pad size', () => {
  const force = 784.5 * forceUnits.kN;
  const plate = calculatePlate(force, 0.6 * dimensionUnits.m, 'square');
  const limit = 10 * pressureUnits['kgf/cm²'];
  assert.equal((plate.pressure / pressureUnits['kgf/cm²']).toFixed(2), '27.78');
  assert.equal(comparePressure(plate.pressure, limit), 'exceeds');
  assert.equal(
    roundUpToHundredth(
      calculateSquarePad(calculateRequiredArea(force, limit)).sideM,
    ),
    1,
  );
  assert.ok(Math.abs(80 * forceUnits.tf - 784.532) < 1e-9);
});

test('switching pressure units preserves the exact base value and blank input', () => {
  const original = {
    text: '10',
    unit: 'kgf/cm²',
    baseValue: 10 * pressureUnits['kgf/cm²'],
  };
  const inKn = changeSupportUnit(original, 'kN/m²', pressureUnits);
  assert.equal(inKn.text, '980,665');
  const inTf = changeSupportUnit(inKn, 'tf/m²', pressureUnits);
  assert.equal(inTf.text, '100');
  assert.deepEqual(
    changeSupportUnit(inTf, original.unit, pressureUnits),
    original,
  );
  const empty = { text: '', unit: 'mm', baseValue: 0 };
  assert.deepEqual(changeSupportUnit(empty, 'm', dimensionUnits), {
    ...empty,
    unit: 'm',
  });
});

test('the native unit picker is selected on iPhone and the custom menu remains the fallback', () => {
  const iphone =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148';
  const desktopSafari =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15';
  const android =
    'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36';
  assert.equal(usesNativeUnitPicker(iphone, ''), true);
  assert.equal(usesNativeUnitPicker(desktopSafari, 'iPhone'), true);
  assert.equal(usesNativeUnitPicker(desktopSafari, 'MacIntel'), false);
  assert.equal(usesNativeUnitPicker(android, 'Linux armv8l'), false);
});

test('empty, zero, negative and non-finite values cannot produce valid results', () => {
  for (const invalid of [null, 0, -1, NaN, Infinity, -Infinity]) {
    assert.equal(calculatePlate(invalid, 500, 'square'), null);
    assert.equal(calculatePlate(720, invalid, 'square'), null);
    assert.equal(calculateRequiredArea(720, invalid), null);
    assert.equal(calculateRequiredArea(invalid, 200), null);
    assert.equal(comparePressure(3600, invalid), null);
  }
  assert.equal(calculatePlate(720, 500, null), null);
  assert.equal(calculatePlate(720, 500, 'triangle'), null);
  assert.equal(calculatePlate(720, Number.MIN_VALUE, 'square'), null);
  assert.equal(calculatePlate(720, Number.MAX_VALUE, 'square'), null);
  assert.equal(calculateRequiredArea(Number.MAX_VALUE, Number.MIN_VALUE), null);
});

test('comparison uses unrounded values and is not a safety certification', () => {
  assert.equal(comparePressure(3600, 200), 'exceeds');
  assert.equal(comparePressure(200, 200), 'within');
  assert.equal(comparePressure(199, 200), 'within');
  assert.equal(comparePressure(200.00001, 200), 'exceeds');
  assert.equal(comparePressure(null, 200), null);
});

test('all reference rows are transcribed, including zero and a range, not an assumed maximum', () => {
  assert.equal(soilReferences.length, 13);
  assert.equal(soilReferences[0].pressure, '0');
  assert.equal(soilReferences[1].pressure, '0 hasta 100');
  assert.deepEqual(
    soilReferences.slice(2).map((row) => row.pressure),
    [
      '200',
      '120',
      '130',
      '90',
      '140',
      '200',
      '150',
      '220',
      '330',
      '1.500',
      '4.000',
    ],
  );
});
