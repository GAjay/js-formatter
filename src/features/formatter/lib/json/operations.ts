import { buildStats } from './stats';
import { tryRepairJson } from './repair';
import { sortObjectKeys } from './sort-keys';
import { emptyInputError, parseErrorPosition } from './parse-error';
import type { FormatOptions, JsonOperationResult, IndentValue } from './types';

function indentSpace(indent: IndentValue): string | number {
  return indent === 'tab' ? '\t' : indent;
}

function stringifyValue(parsed: unknown, indent: IndentValue): string {
  const space = indentSpace(indent);
  return JSON.stringify(parsed, null, space);
}

export function formatJson(input: string, options: FormatOptions): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  try {
    let parsed: unknown = JSON.parse(trimmed);
    if (options.sortKeys) parsed = sortObjectKeys(parsed);
    const result = stringifyValue(parsed, options.indent);
    return { ok: true, result, stats: buildStats(result, parsed) };
  } catch (err) {
    const msg = (err as Error).message;
    return { ok: false, error: msg, position: parseErrorPosition(msg) };
  }
}

export function minifyJson(input: string): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  try {
    const parsed = JSON.parse(trimmed);
    const result = JSON.stringify(parsed);
    return { ok: true, result, stats: buildStats(result, parsed) };
  } catch (err) {
    const msg = (err as Error).message;
    return { ok: false, error: msg, position: parseErrorPosition(msg) };
  }
}

export function validateJson(input: string): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  try {
    const parsed = JSON.parse(trimmed);
    return { ok: true, stats: buildStats(trimmed, parsed) };
  } catch (err) {
    const msg = (err as Error).message;
    return { ok: false, error: msg, position: parseErrorPosition(msg) };
  }
}

export function repairJson(input: string, indent: IndentValue = 2): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  try {
    const parsed = JSON.parse(trimmed);
    const result = stringifyValue(parsed, indent);
    return { ok: true, result, stats: buildStats(result, parsed) };
  } catch {
    try {
      const repaired = tryRepairJson(trimmed);
      const parsed = JSON.parse(repaired);
      const result = stringifyValue(parsed, indent);
      return { ok: true, result, stats: buildStats(result, parsed) };
    } catch (err2) {
      return { ok: false, error: (err2 as Error).message };
    }
  }
}

export function sortKeysJson(input: string, indent: IndentValue = 2): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  try {
    const parsed = sortObjectKeys(JSON.parse(trimmed));
    const result = stringifyValue(parsed, indent);
    return { ok: true, result, stats: buildStats(result, parsed) };
  } catch (err) {
    const msg = (err as Error).message;
    return { ok: false, error: msg, position: parseErrorPosition(msg) };
  }
}

export function escapeJsonString(input: string): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  const result = JSON.stringify(trimmed);
  return { ok: true, result, stats: buildStats(result, trimmed) };
}

export function unescapeJsonString(input: string): JsonOperationResult {
  const trimmed = input.trim();
  if (!trimmed) return emptyInputError();
  try {
    let parsed: unknown;
    if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
      parsed = JSON.parse(trimmed.replace(/^'/, '"').replace(/'$/, '"'));
    } else {
      parsed = JSON.parse(`"${trimmed.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
    }
    if (typeof parsed !== 'string') {
      return { ok: false, error: 'Input is not a JSON string value.' };
    }
    return { ok: true, result: parsed, stats: buildStats(parsed, parsed) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export function compactJson(input: string): JsonOperationResult {
  return minifyJson(input);
}
