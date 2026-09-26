const RIGHT_WING: readonly (readonly [number, number])[] = [
  [100, 43],
  [103, 43],
  [106, 17],
  [111, 40],
  [120, 46],
  [148, 34],
  [197, 6],
  [183, 45],
  [168, 41],
  [157, 61],
  [142, 55],
  [132, 73],
  [119, 67],
  [107, 85],
  [100, 98],
];

const LEFT_WING = RIGHT_WING.slice(1, -1)
  .reverse()
  .map(([x, y]) => [200 - x, y] as const);

export const BAT_SYMBOL = {
  width: 200,
  height: 100,
  center: { x: 100, y: 52 },
  path: `M${[...RIGHT_WING, ...LEFT_WING].map(([x, y]) => `${x} ${y}`).join('L')}Z`,
};
