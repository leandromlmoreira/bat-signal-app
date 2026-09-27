import { test } from 'node:test';
import assert from 'node:assert/strict';
import { webcrypto } from 'node:crypto';
import { AMBIGUOUS, CHARSETS } from './charsets.ts';
import { alphabetSize, clampLength, generatePassword, LENGTH_MAX, LENGTH_MIN, type PasswordOptions } from './password.ts';
import { createRandomIndex } from './random.ts';

const secureIndex = createRandomIndex((buffer) => webcrypto.getRandomValues(buffer));

const allOn: PasswordOptions = { length: 32, uppercase: true, numbers: true, symbols: true, avoidAmbiguous: false };

test('gera senha com o tamanho pedido', () => {
  assert.equal(generatePassword(allOn, secureIndex).length, 32);
});

test('limita o tamanho entre o mínimo e o máximo', () => {
  assert.equal(clampLength(2), LENGTH_MIN);
  assert.equal(clampLength(500), LENGTH_MAX);
  assert.equal(clampLength(Number.NaN), 20);
});

test('inclui pelo menos um caractere de cada classe ativa', () => {
  for (let run = 0; run < 200; run++) {
    const password = generatePassword({ ...allOn, length: 8 }, secureIndex);
    assert.ok([...password].some((char) => CHARSETS.uppercase.includes(char)));
    assert.ok([...password].some((char) => CHARSETS.numbers.includes(char)));
    assert.ok([...password].some((char) => CHARSETS.symbols.includes(char)));
    assert.ok([...password].some((char) => CHARSETS.lowercase.includes(char)));
  }
});

test('usa só minúsculas quando as outras classes estão desligadas', () => {
  const password = generatePassword({ ...allOn, uppercase: false, numbers: false, symbols: false }, secureIndex);
  assert.match(password, /^[a-z]+$/);
});

test('evita caracteres ambíguos quando pedido', () => {
  const options = { ...allOn, length: 64, avoidAmbiguous: true };
  for (let run = 0; run < 100; run++) {
    const password = generatePassword(options, secureIndex);
    assert.ok(![...password].some((char) => AMBIGUOUS.includes(char)));
  }
});

test('calcula o tamanho do alfabeto a partir das opções', () => {
  assert.equal(alphabetSize({ ...allOn, uppercase: false, numbers: false, symbols: false }), 26);
  assert.equal(alphabetSize({ ...allOn, symbols: false }), 62);
});

test('índice aleatório descarta valores enviesados', () => {
  const values = [0xffffffff, 7];
  const index = createRandomIndex((buffer) => {
    buffer[0] = values.shift() ?? 0;
  });
  assert.equal(index(10), 7);
});

test('índice aleatório rejeita limite inválido', () => {
  assert.throws(() => secureIndex(0), RangeError);
});
