import { test } from "node:test";
import assert from "node:assert/strict";
import { entropyBits, evaluateStrength, formatDuration } from "./strength.ts";
import { formatRelativeTime, maskPassword, parseHistory, pushEntry, type HistoryEntry } from "./history.ts";

test("entropia é comprimento vezes log2 do alfabeto", () => {
  assert.equal(entropyBits(16, 64), 96);
  assert.equal(entropyBits(0, 64), 0);
});

test("classifica a força pelos bits", () => {
  assert.equal(evaluateStrength(8, 26).level, "weak");
  assert.equal(evaluateStrength(13, 62).level, "strong");
  assert.equal(evaluateStrength(20, 88).level, "fortress");
});

test("formata a duração em português", () => {
  assert.equal(formatDuration(0.2), "menos de 1 segundo");
  assert.equal(formatDuration(7200), "2 horas");
  assert.equal(formatDuration(86_400), "1 dia");
});

const entry = (id: string, password: string): HistoryEntry => ({ id, password, bits: 80, createdAt: 0 });

test("histórico coloca o mais recente no topo e remove duplicadas", () => {
  const history = pushEntry([entry("1", "a"), entry("2", "b")], entry("3", "a"));
  assert.deepEqual(history.map((item) => item.id), ["3", "2"]);
});

test("histórico respeita o limite", () => {
  const history = pushEntry([entry("1", "a"), entry("2", "b")], entry("3", "c"), 2);
  assert.deepEqual(history.map((item) => item.id), ["3", "1"]);
});

test("histórico ignora dados corrompidos", () => {
  assert.deepEqual(parseHistory("{quebrado"), []);
  assert.deepEqual(parseHistory(JSON.stringify([{ id: 1 }, entry("ok", "x")])), [entry("ok", "x")]);
});

test("mascara o meio da senha", () => {
  assert.equal(maskPassword("abcdefghijklmnop"), "abcd••••••mnop");
});

test("tempo relativo", () => {
  assert.equal(formatRelativeTime(0, 10_000), "agora");
  assert.equal(formatRelativeTime(0, 5 * 60_000), "há 5 min");
  assert.equal(formatRelativeTime(0, 26 * 3_600_000), "ontem");
});
