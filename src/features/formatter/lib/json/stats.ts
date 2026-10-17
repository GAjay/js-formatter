import type { Stats } from './types';

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
  if (Array.isArray(obj)) return obj.length + obj.reduce((acc, v) => acc + countElements(v), 0);
  return Object.values(obj as Record<string, unknown>).reduce(
    (acc: number, v) => acc + countElements(v),
    0
  );
}

function rootTypeOf(parsed: unknown): string {
  if (Array.isArray(parsed)) return 'array';
  if (parsed === null) return 'null';
  return typeof parsed;
}

function maxDepth(value: unknown, level = 0): number {
  if (typeof value !== 'object' || value === null) return level;
  if (Array.isArray(value)) {
    if (value.length === 0) return level + 1;
    return Math.max(level + 1, ...value.map((item) => maxDepth(item, level + 1)));
  }
  const vals = Object.values(value as Record<string, unknown>);
  if (vals.length === 0) return level + 1;
  return Math.max(level + 1, ...vals.map((v) => maxDepth(v, level + 1)));
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export function buildStats(text: string, parsed: unknown): Stats {
  const lines = text.split('\n').length;
  const chars = text.length;
  const keys = countKeys(parsed);
  const elements = countElements(parsed);
  const bytes = new TextEncoder().encode(text).length;
  const size = formatByteSize(bytes);
  return {
    lines,
    chars,
    keys,
    elements,
    size,
    rootType: rootTypeOf(parsed),
    depth: maxDepth(parsed),
  };
}
