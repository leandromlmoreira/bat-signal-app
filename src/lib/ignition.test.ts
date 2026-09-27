import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildIgnition, ignitionDuration, IGNITION } from './ignition.ts';

test('a ignição é determinística para a mesma semente', () => {
  assert.deepEqual(buildIgnition(7), buildIgnition(7));
  assert.notDeepEqual(buildIgnition(7), buildIgnition(8));
});

test('a lâmpada gagueja e termina acesa por completo', () => {
  const steps = buildIgnition(1939, 6);
  assert.equal(steps.length, 13);
  assert.equal(steps.at(-1)?.level, 1);
  steps.forEach((step) => {
    assert.ok(step.level >= 0 && step.level <= 1);
    assert.ok(step.duration > 0);
  });
  const peaks = steps.filter((_, index) => index % 2 === 0 && index < steps.length - 1);
  assert.ok(peaks.at(-1)!.level > peaks[0].level);
});

test('a ignição inteira cabe em menos de dois segundos', () => {
  const total = ignitionDuration(IGNITION);
  assert.ok(total > 900 && total < 2000, `duração ${total}`);
});
