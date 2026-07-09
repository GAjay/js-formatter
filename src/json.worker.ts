export type WorkerRequest =
  | { id: number; type: 'format'; payload: { input: string; indent: number | string } }
  | { id: number; type: 'minify'; payload: { input: string } }
  | { id: number; type: 'validate'; payload: { input: string } }
  | { id: number; type: 'repair'; payload: { input: string } };

export interface Stats {
  lines: number;
  chars: number;
  keys: number;
  elements: number;
  size: string;
}

export interface ErrorPosition {
  line: number;
  column: number;
}

export interface WorkerOkResult {
  id: number;
  ok: true;
  result: string;
  stats: Stats;
  type: 'format' | 'minify' | 'repair';
}

export interface WorkerOkValidate {
  id: number;
  ok: true;
  stats: Stats;
  type: 'validate';
}

export interface WorkerError {
  id: number;
  ok: false;
  error: string;
  position?: ErrorPosition;
  type: 'format' | 'minify' | 'validate' | 'repair';
}

export type WorkerResponse = WorkerOkResult | WorkerOkValidate | WorkerError;

function countKeys(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((acc, v) => acc + countKeys(v), 0);
  return Object.keys(obj as Record<string, unknown>).reduce(
    (acc, k) => acc + 1 + countKeys((obj as Record<string, unknown>)[k]),
    0
  );
}

function countElements(obj: unknown): number {
  if (typeof obj !== 'object' || obj === null) return 0;
  if (Array.isArray(obj))
    return obj.length + obj.reduce((acc, v) => acc + countElements(v), 0);
  return Object.values(obj as Record<string, unknown>).reduce(
    (acc: number, v) => acc + countElements(v),
    0
  );
}

function buildStats(text: string, parsed: unknown): Stats {
  const lines = text.split('\n').length;
  const chars = text.length;
  const keys = countKeys(parsed);
  const elements = countElements(parsed);
  const bytes = new TextEncoder().encode(text).length;
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`;
  return { lines, chars, keys, elements, size };
}

function parseErrorPosition(msg: string): ErrorPosition | undefined {
  const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return { line: parseInt(lineColMatch[1], 10), column: parseInt(lineColMatch[2], 10) };
  }
  return undefined;
}

function tryRepair(input: string): string {
  let s = input.trim();
  s = s.replace(/,\s*([}\]])/g, '$1');
  s = s.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  s = s.replace(/'([^']*)'/g, '"$1"');
  return s;
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id, type, payload } = e.data;

  if (type === 'format') {
    const { input, indent } = payload;
    const trimmed = input.trim();
    if (!trimmed) {
      self.postMessage({ id, type, ok: false, error: 'Input is empty.' } satisfies WorkerResponse);
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      const space = indent === 'tab' ? '\t' : (indent as number);
      const result = JSON.stringify(parsed, null, space);
      self.postMessage({ id, type, ok: true, result, stats: buildStats(result, parsed) } satisfies WorkerResponse);
    } catch (err) {
      const msg = (err as Error).message;
      self.postMessage({ id, type, ok: false, error: msg, position: parseErrorPosition(msg) } satisfies WorkerResponse);
    }
    return;
  }

  if (type === 'minify') {
    const { input } = payload;
    const trimmed = input.trim();
    if (!trimmed) {
      self.postMessage({ id, type, ok: false, error: 'Input is empty.' } satisfies WorkerResponse);
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      const result = JSON.stringify(parsed);
      self.postMessage({ id, type, ok: true, result, stats: buildStats(result, parsed) } satisfies WorkerResponse);
    } catch (err) {
      const msg = (err as Error).message;
      self.postMessage({ id, type, ok: false, error: msg, position: parseErrorPosition(msg) } satisfies WorkerResponse);
    }
    return;
  }

  if (type === 'validate') {
    const { input } = payload;
    const trimmed = input.trim();
    if (!trimmed) {
      self.postMessage({ id, type, ok: false, error: 'Input is empty.' } satisfies WorkerResponse);
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      self.postMessage({ id, type, ok: true, stats: buildStats(trimmed, parsed) } satisfies WorkerResponse);
    } catch (err) {
      const msg = (err as Error).message;
      self.postMessage({ id, type, ok: false, error: msg, position: parseErrorPosition(msg) } satisfies WorkerResponse);
    }
    return;
  }

  if (type === 'repair') {
    const { input } = payload;
    const trimmed = input.trim();
    if (!trimmed) {
      self.postMessage({ id, type, ok: false, error: 'Input is empty.' } satisfies WorkerResponse);
      return;
    }
    try {
      const parsed = JSON.parse(trimmed);
      const result = JSON.stringify(parsed, null, 2);
      self.postMessage({ id, type, ok: true, result, stats: buildStats(result, parsed) } satisfies WorkerResponse);
    } catch {
      try {
        const repaired = tryRepair(trimmed);
        const parsed = JSON.parse(repaired);
        const result = JSON.stringify(parsed, null, 2);
        self.postMessage({ id, type, ok: true, result, stats: buildStats(result, parsed) } satisfies WorkerResponse);
      } catch (err2) {
        self.postMessage({ id, type, ok: false, error: (err2 as Error).message } satisfies WorkerResponse);
      }
    }
    return;
  }
};
