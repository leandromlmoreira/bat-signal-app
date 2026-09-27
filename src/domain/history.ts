export interface HistoryEntry {
  id: string;
  password: string;
  bits: number;
  createdAt: number;
}

export const HISTORY_LIMIT = 10;

export function pushEntry(history: HistoryEntry[], entry: HistoryEntry, limit = HISTORY_LIMIT): HistoryEntry[] {
  const withoutDuplicate = history.filter((item) => item.password !== entry.password);
  return [entry, ...withoutDuplicate].slice(0, limit);
}

function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.password === 'string' &&
    typeof candidate.bits === 'number' &&
    typeof candidate.createdAt === 'number'
  );
}

export function parseHistory(raw: string | null): HistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function maskPassword(password: string, visible = 4): string {
  if (password.length <= visible * 2) return password;
  return `${password.slice(0, visible)}${'•'.repeat(6)}${password.slice(-visible)}`;
}

export function formatRelativeTime(timestamp: number, now: number): string {
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 45) return 'agora';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.round(hours / 24);
  return days === 1 ? 'ontem' : `há ${days} dias`;
}
