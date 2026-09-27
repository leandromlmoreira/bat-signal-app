import { useState } from 'react';

export function useVisited<T>(current: T) {
  const [visited, setVisited] = useState<ReadonlySet<T>>(() => new Set([current]));

  if (!visited.has(current)) {
    setVisited(new Set([...visited, current]));
  }

  return visited;
}
