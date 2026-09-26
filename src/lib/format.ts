const two = (value: number) => String(value).padStart(2, '0');

export function formatClock(timestamp: number) {
  const date = new Date(timestamp);
  return `${two(date.getHours())}:${two(date.getMinutes())}:${two(date.getSeconds())}`;
}

export function formatHourMinute(timestamp: number) {
  const date = new Date(timestamp);
  return `${two(date.getHours())}:${two(date.getMinutes())}`;
}

export function formatElapsed(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${two(Math.floor(totalSeconds / 60))}:${two(totalSeconds % 60)}`;
}

export function formatCallCount(count: number) {
  return String(count).padStart(3, '0');
}
