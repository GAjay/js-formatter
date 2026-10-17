import {
  compactJson,
  escapeJsonString,
  formatJson,
  minifyJson,
  repairJson,
  sortKeysJson,
  unescapeJsonString,
  validateJson,
} from '../lib/json/operations';
import type { ErrorPosition, FormatOptions, Stats } from '../lib/json/types';

export type WorkerOperation =
  | 'format'
  | 'minify'
  | 'validate'
  | 'repair'
  | 'sortKeys'
  | 'escape'
  | 'unescape'
  | 'compact';

export type WorkerRequest =
  | { id: number; type: 'format'; payload: FormatOptions & { input: string } }
  | { id: number; type: 'minify'; payload: { input: string } }
  | { id: number; type: 'validate'; payload: { input: string } }
  | { id: number; type: 'repair'; payload: { input: string; indent?: number | 'tab' } }
  | { id: number; type: 'sortKeys'; payload: { input: string; indent?: number | 'tab' } }
  | { id: number; type: 'escape'; payload: { input: string } }
  | { id: number; type: 'unescape'; payload: { input: string } }
  | { id: number; type: 'compact'; payload: { input: string } };

export interface WorkerOkResult {
  id: number;
  ok: true;
  result: string;
  stats: Stats;
  type: Exclude<WorkerOperation, 'validate'>;
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
  type: WorkerOperation;
}

export type WorkerResponse = WorkerOkResult | WorkerOkValidate | WorkerError;

type WorkerResultBody =
  | { ok: true; result: string; stats: Stats; type: Exclude<WorkerOperation, 'validate'> }
  | { ok: true; stats: Stats; type: 'validate' }
  | { ok: false; error: string; position?: ErrorPosition; type: WorkerOperation };

function fail(type: WorkerOperation, error: string, position?: ErrorPosition): WorkerResultBody {
  return { type, ok: false, error, position };
}

function runOperation(req: WorkerRequest): WorkerResultBody {
  const { type, payload } = req;

  switch (type) {
    case 'format': {
      const { input, indent, sortKeys } = payload;
      const res = formatJson(input, { indent, sortKeys });
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Format produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    case 'minify': {
      const res = minifyJson(payload.input);
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Minify produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    case 'compact': {
      const res = compactJson(payload.input);
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Compact produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    case 'validate': {
      const res = validateJson(payload.input);
      if (!res.ok) return fail(type, res.error, res.position);
      return { type: 'validate', ok: true, stats: res.stats };
    }
    case 'repair': {
      const res = repairJson(payload.input, payload.indent ?? 2);
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Repair produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    case 'sortKeys': {
      const res = sortKeysJson(payload.input, payload.indent ?? 2);
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Sort produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    case 'escape': {
      const res = escapeJsonString(payload.input);
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Escape produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    case 'unescape': {
      const res = unescapeJsonString(payload.input);
      if (!res.ok) return fail(type, res.error, res.position);
      if (!('result' in res)) return fail(type, 'Unescape produced no output.');
      return { type, ok: true, result: res.result, stats: res.stats };
    }
    default:
      return fail('format', 'Unknown operation.');
  }
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const { id } = e.data;
  const result = runOperation(e.data);
  self.postMessage({ id, ...result } as WorkerResponse);
};

export type { Stats, ErrorPosition };
