import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSkyline, crownShape, type Crown } from './skyline.ts';

const options = {
  width: 1200,
  bottom: 700,
  minTop: 300,
  maxTop: 560,
  minWidth: 30,
  maxWidth: 90,
  seed: 29,
  litChance: 0.1,
  windowScale: 1,
  blinkChance: 0.1,
};

test('a skyline é determinística para a mesma semente', () => {
  assert.deepEqual(buildSkyline(options), buildSkyline(options));
});

test('a skyline gera janelas acesas fixas e piscando', () => {
  const skyline = buildSkyline(options);
  assert.ok(skyline.path.length > 0);
  assert.ok(skyline.lights.some((light) => light.group === 0));
  assert.ok(skyline.lights.some((light) => light.group > 0));
});

test('sem piscar, todas as janelas ficam no grupo fixo', () => {
  const skyline = buildSkyline({ ...options, blinkChance: 0 });
  assert.ok(skyline.lights.every((light) => light.group === 0));
});

test('as coroas góticas sobem acima do telhado', () => {
  const crowns: Crown[] = ['spire', 'gable', 'cathedral', 'clock', 'setback', 'battlement'];
  crowns.forEach((crown) => {
    const shapes = crownShape(crown, 0, 400, 80, 200);
    assert.ok(shapes.length > 0, crown);
    const ys = shapes.join('').match(/-?\d+(\.\d+)?/g)!.map(Number);
    assert.ok(Math.min(...ys.filter((value) => value > 100)) < 400, crown);
  });
  assert.deepEqual(crownShape('flat', 0, 400, 80, 200), []);
});
