import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coneHalfWidth, motesPath, scatterDust } from './dust.ts';

const options = { width: 300, length: 600, topWidth: 280, baseWidth: 20, count: 120, groups: 3, minRadius: 0.5, maxRadius: 1.6, seed: 3 };

test('a poeira fica sempre dentro do facho do holofote', () => {
  scatterDust(options).forEach((mote) => {
    const half = coneHalfWidth(mote.y, options.length, options.topWidth, options.baseWidth);
    assert.ok(Math.abs(mote.x - options.width / 2) <= half, `mote fora do cone em y=${mote.y}`);
    assert.ok(mote.y > 0 && mote.y < options.length);
  });
});

test('a poeira se divide entre os grupos de cintilação', () => {
  const motes = scatterDust(options);
  assert.equal(motes.length, 120);
  assert.deepEqual([...new Set(motes.map((mote) => mote.group))].sort(), [0, 1, 2]);
});

test('cada partícula vira um círculo no path', () => {
  const path = motesPath(scatterDust({ ...options, count: 4 }));
  assert.equal(path.match(/Z/g)?.length, 4);
});
