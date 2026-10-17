export interface Stats {
  lines: number;
  chars: number;
  keys: number;
  elements: number;
  size: string;
  rootType: string;
  depth: number;
}

export interface ErrorPosition {
  line: number;
  column: number;
}

export type JsonSuccessWithResult = { ok: true; result: string; stats: Stats };
export type JsonSuccessValidate = { ok: true; stats: Stats };
export type JsonFailure = { ok: false; error: string; position?: ErrorPosition };

export type JsonOperationResult = JsonSuccessWithResult | JsonSuccessValidate | JsonFailure;

export type IndentValue = number | 'tab';

export interface FormatOptions {
  indent: IndentValue;
  sortKeys?: boolean;
}
