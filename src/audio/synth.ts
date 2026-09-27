import type { FlickerStep } from '../lib/ignition';

type AudioContextClass = typeof AudioContext;

interface Hum {
  output: GainNode;
  sources: OscillatorNode[];
}

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let hum: Hum | null = null;

function contextClass(): AudioContextClass | null {
  if (typeof window === 'undefined') return null;
  const scope = window as typeof window & { webkitAudioContext?: AudioContextClass };
  return scope.AudioContext ?? scope.webkitAudioContext ?? null;
}

export function audioSupported() {
  return contextClass() !== null;
}

function ensureContext() {
  const Context = contextClass();
  if (!Context) return null;
  context ??= new Context();
  if (context.state === 'suspended') context.resume().catch(() => undefined);
  return context;
}

function noiseBuffer(ctx: AudioContext) {
  if (noise) return noise;
  const length = ctx.sampleRate * 3;
  noise = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = noise.getChannelData(0);
  let brown = 0;
  for (let index = 0; index < length; index += 1) {
    const white = Math.random() * 2 - 1;
    brown = (brown + 0.04 * white) / 1.04;
    data[index] = white * 0.55 + brown * 3.2;
  }
  return noise;
}

function output(ctx: AudioContext, level: number) {
  const gain = ctx.createGain();
  gain.gain.value = level;
  gain.connect(ctx.destination);
  return gain;
}

function noiseSource(ctx: AudioContext, at: number, duration: number) {
  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer(ctx);
  source.start(at, Math.random() * Math.max(0, 2.9 - duration), duration);
  return source;
}

function thump(ctx: AudioContext, destination: AudioNode, at: number, weight: number) {
  const body = ctx.createOscillator();
  const gain = ctx.createGain();
  body.type = 'sine';
  body.frequency.setValueAtTime(110, at);
  body.frequency.exponentialRampToValueAtTime(38, at + 0.18);
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(weight, at + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);
  body.connect(gain).connect(destination);
  body.start(at);
  body.stop(at + 0.35);

  const click = noiseSource(ctx, at, 0.05);
  const clickFilter = ctx.createBiquadFilter();
  const clickGain = ctx.createGain();
  clickFilter.type = 'highpass';
  clickFilter.frequency.value = 2400;
  clickGain.gain.setValueAtTime(weight * 0.5, at);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.045);
  click.connect(clickFilter).connect(clickGain).connect(destination);
}

function crackle(ctx: AudioContext, destination: AudioNode, at: number, level: number) {
  const burst = noiseSource(ctx, at, 0.06);
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = 3200 + Math.random() * 2400;
  filter.Q.value = 1.4;
  gain.gain.setValueAtTime(level, at);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05);
  burst.connect(filter).connect(gain).connect(destination);
}

export function playIgnition(steps: readonly FlickerStep[]) {
  const ctx = ensureContext();
  if (!ctx) return;
  const start = ctx.currentTime + 0.02;
  const master = output(ctx, 0.55);

  thump(ctx, master, start, 0.9);

  const arc = ctx.createOscillator();
  const arcLow = ctx.createOscillator();
  const band = ctx.createBiquadFilter();
  const arcGain = ctx.createGain();
  arc.type = 'sawtooth';
  arc.frequency.value = 100;
  arcLow.type = 'square';
  arcLow.frequency.value = 50;
  band.type = 'bandpass';
  band.frequency.value = 1100;
  band.Q.value = 0.7;
  arcGain.gain.setValueAtTime(0, start);
  arc.connect(band);
  arcLow.connect(band);
  band.connect(arcGain).connect(master);

  let at = start;
  steps.forEach((step, index) => {
    const last = index === steps.length - 1;
    arcGain.gain.setValueAtTime(step.level * 0.16, at);
    if (!last && step.level > 0.25) crackle(ctx, master, at, step.level * 0.5);
    at += step.duration / 1000;
  });
  arcGain.gain.setTargetAtTime(0, at, 0.35);

  const swell = noiseSource(ctx, at - 0.5, 2.2);
  const swellFilter = ctx.createBiquadFilter();
  const swellGain = ctx.createGain();
  swellFilter.type = 'lowpass';
  swellFilter.frequency.setValueAtTime(220, at - 0.5);
  swellFilter.frequency.exponentialRampToValueAtTime(900, at);
  swellFilter.frequency.exponentialRampToValueAtTime(160, at + 1.6);
  swellGain.gain.setValueAtTime(0.0001, at - 0.5);
  swellGain.gain.exponentialRampToValueAtTime(0.32, at);
  swellGain.gain.exponentialRampToValueAtTime(0.0001, at + 1.7);
  swell.connect(swellFilter).connect(swellGain).connect(master);

  arc.start(start);
  arcLow.start(start);
  arc.stop(at + 2);
  arcLow.stop(at + 2);
}

export function playShutdown() {
  const ctx = ensureContext();
  if (!ctx) return;
  const start = ctx.currentTime + 0.02;
  const master = output(ctx, 0.5);
  thump(ctx, master, start, 0.6);

  const whine = ctx.createOscillator();
  const gain = ctx.createGain();
  whine.type = 'triangle';
  whine.frequency.setValueAtTime(240, start);
  whine.frequency.exponentialRampToValueAtTime(48, start + 0.7);
  gain.gain.setValueAtTime(0.08, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
  whine.connect(gain).connect(master);
  whine.start(start);
  whine.stop(start + 0.8);
}

export function unlockAudio() {
  ensureContext();
}

export function playThunder(distance: number) {
  const ctx = context;
  if (!ctx || ctx.state !== 'running') return;
  const start = ctx.currentTime + 0.02;
  const near = 1 - Math.min(1, Math.max(0, distance));
  const master = output(ctx, 0.35 + near * 0.35);
  const length = 3.2;

  const rumble = noiseSource(ctx, start, length);
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(420 + near * 900, start);
  filter.frequency.exponentialRampToValueAtTime(90, start + length);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.9, start + 0.12 + distance * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.35, start + 1.1);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  rumble.connect(filter).connect(gain).connect(master);
}

export function startHum() {
  const ctx = ensureContext();
  if (!ctx || hum) return;
  const at = ctx.currentTime;
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 380;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.05, at + 1.4);
  const sources = [60, 120, 180].map((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const partial = ctx.createGain();
    oscillator.type = index === 0 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    partial.gain.value = 1 / (index + 1);
    oscillator.connect(partial).connect(filter);
    oscillator.start(at);
    return oscillator;
  });
  filter.connect(gain).connect(ctx.destination);
  hum = { output: gain, sources };
}

export function stopHum() {
  if (!context || !hum) return;
  const at = context.currentTime;
  const current = hum;
  hum = null;
  current.output.gain.cancelScheduledValues(at);
  current.output.gain.setTargetAtTime(0.0001, at, 0.12);
  current.sources.forEach((source) => source.stop(at + 0.8));
}
