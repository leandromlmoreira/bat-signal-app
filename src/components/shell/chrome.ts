export interface Chrome {
  compact: boolean;
  showClock: boolean;
  top: number;
  gutter: number;
  height: number;
  tabWidth: number;
}

const WIDE_BREAKPOINT = 900;
const LANDSCAPE_BREAKPOINT = 640;
const SHORT_HEIGHT = 600;
const CLOCK_MIN_WIDTH = 440;
const BAR_HEIGHT = 54;
const COMPACT_GUTTER = 16;
const ISLAND_FRAME = 12 + 42 + 10;
const CLOCK_ROOM = 96;
const TAB_RANGE = { min: 96, max: 150 };

export function computeChrome(width: number, height: number, insetTop: number): Chrome {
  const wide = width >= WIDE_BREAKPOINT || (width > height && width >= LANDSCAPE_BREAKPOINT);
  const short = wide && height < SHORT_HEIGHT;

  if (!wide) {
    const showClock = width >= CLOCK_MIN_WIDTH;
    const room = width - COMPACT_GUTTER * 2 - ISLAND_FRAME - (showClock ? CLOCK_ROOM : 0);
    const tabWidth = Math.max(TAB_RANGE.min, Math.min(TAB_RANGE.max, Math.floor(room / 2)));
    return { compact: true, showClock, top: insetTop + 12, gutter: COMPACT_GUTTER, height: BAR_HEIGHT, tabWidth };
  }

  return {
    compact: false,
    showClock: true,
    top: insetTop + (short ? 14 : 28),
    gutter: Math.max(short ? 28 : 48, width * 0.05),
    height: BAR_HEIGHT,
    tabWidth: 124,
  };
}
