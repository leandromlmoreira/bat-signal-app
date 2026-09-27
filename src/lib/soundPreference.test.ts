import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSoundPreference, serializeSoundPreference } from './soundPreference.ts';

test('o som começa desligado quando não há preferência salva', () => {
  assert.equal(parseSoundPreference(null), false);
  assert.equal(parseSoundPreference(undefined), false);
  assert.equal(parseSoundPreference('lixo'), false);
});

test('a preferência de som ida e volta', () => {
  assert.equal(parseSoundPreference(serializeSoundPreference(true)), true);
  assert.equal(parseSoundPreference(serializeSoundPreference(false)), false);
});
