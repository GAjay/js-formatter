export function tryRepairJson(input: string): string {
  let s = input.trim();
  s = s.replace(/,\s*([}\]])/g, '$1');
  s = s.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  s = s.replace(/'([^']*)'/g, '"$1"');
  s = s.replace(/\bundefined\b/g, 'null');
  s = s.replace(/\bNaN\b/g, 'null');
  s = s.replace(/\bInfinity\b/g, 'null');
  return s;
}
