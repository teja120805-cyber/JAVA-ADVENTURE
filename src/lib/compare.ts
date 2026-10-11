/**
 * Normalises program output so tiny whitespace differences don't fail a test:
 * Windows line endings, spaces at the end of lines, and blank lines at the start or end.
 */
export function normalizeOutput(text: string): string {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/^\n+|\n+$/g, '');
}

export interface CompareResult {
  pass: boolean;
  /** 1-based line of the first difference, if any. */
  firstDiffLine?: number;
  expectedLine?: string;
  actualLine?: string;
}

export function compareOutput(actual: string, expected: string): CompareResult {
  const a = normalizeOutput(actual);
  const e = normalizeOutput(expected);
  if (a === e) return { pass: true };

  const aLines = a.split('\n');
  const eLines = e.split('\n');
  const max = Math.max(aLines.length, eLines.length);
  for (let i = 0; i < max; i++) {
    if (aLines[i] !== eLines[i]) {
      return {
        pass: false,
        firstDiffLine: i + 1,
        expectedLine: eLines[i] ?? '(nothing)',
        actualLine: a === '' ? '(nothing)' : (aLines[i] ?? '(nothing)'),
      };
    }
  }
  return { pass: false };
}
