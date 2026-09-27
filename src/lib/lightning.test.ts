import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildBolt, nextStrikeDelay, STRIKE_DELAY } from './lightning.ts';
import { createRandom } from './random.ts';

const options = { seed: 4, startX: 300, startY: 20, endY: 420, spread: 60, segments: 9 };

test('o raio sai do ponto de origem e chega à linha do horizonte', () => {
  const bolt = buildBolt(options);
  assert.deepEqual(bolt.points[0], { x: 300, y: 20 });
  assert.equal(bolt.points.length, options.segments + 1);
  assert.equal(bolt.points.at(-1)?.y, 420);
  assert.ok(bolt.trunk.startsWith('M300 20'));
});

test('o raio desce e não escapa da faixa lateral', () => {
  const bolt = buildBolt(options);
  bolt.points.forEach((point) => {
    assert.ok(Math.abs(point.x - options.startX) <= options.spread);
  });
  assert.ok(bolt.branches.length > 0);
});

test('o intervalo entre relâmpagos fica dentro da janela', () => {
  const random = createRandom(12);
  for (let index = 0; index < 50; index += 1) {
    const delay = nextStrikeDelay(random);
    assert.ok(delay >= STRIKE_DELAY.min && delay <= STRIKE_DELAY.max);
  }
});
