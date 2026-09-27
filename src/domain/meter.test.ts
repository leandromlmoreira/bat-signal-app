import { test } from 'node:test';
import assert from 'node:assert/strict';
import { METER_MARKS, METER_MAX_BITS, meterProgress } from './strength.ts';

test('o medidor enche proporcional aos bits e trava no máximo', () => {
  assert.equal(meterProgress(0), 0);
  assert.equal(meterProgress(-5), 0);
  assert.equal(meterProgress(Number.NaN), 0);
  assert.equal(meterProgress(METER_MAX_BITS / 2), 0.5);
  assert.equal(meterProgress(400), 1);
});

test('as marcas do medidor seguem os limiares de força em ordem crescente', () => {
  assert.deepEqual(
    METER_MARKS.map((mark) => mark.bits),
    [50, 72, 100],
  );
  assert.deepEqual(
    METER_MARKS.map((mark) => mark.label),
    ['Razoável', 'Forte', 'Fortaleza'],
  );
  METER_MARKS.forEach((mark) => assert.equal(mark.progress, mark.bits / METER_MAX_BITS));
});
