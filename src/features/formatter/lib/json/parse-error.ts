import type { ErrorPosition } from './types';

export function parseErrorPosition(msg: string): ErrorPosition | undefined {
  const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    return { line: parseInt(lineColMatch[1], 10), column: parseInt(lineColMatch[2], 10) };
  }
  return undefined;
}

export function emptyInputError(): { ok: false; error: string } {
  return { ok: false, error: 'Input is empty.' };
}
