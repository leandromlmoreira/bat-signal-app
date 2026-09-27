import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeChrome } from './chrome.ts';

test('celular em pé usa a barra compacta com abas que ocupam a largura', () => {
  const chrome = computeChrome(375, 812, 0);
  assert.equal(chrome.compact, true);
  assert.equal(chrome.showClock, false);
  assert.equal(chrome.gutter, 16);
  assert.ok(chrome.tabWidth * 2 + 64 <= 375 - chrome.gutter * 2);
});

test('desktop alinha a barra à mesma margem da cena', () => {
  const chrome = computeChrome(1440, 900, 0);
  assert.equal(chrome.compact, false);
  assert.equal(chrome.gutter, 72);
  assert.equal(chrome.top, 28);
});

test('celular deitado usa o layout largo e respeita a área segura', () => {
  const chrome = computeChrome(812, 375, 20);
  assert.equal(chrome.compact, false);
  assert.equal(chrome.top, 34);
});
