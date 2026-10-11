/**
 * Tag for code and multi-line text in content files:
 *
 *   code: java`
 *     public class Main { ... }
 *   `
 *
 * Backslashes are kept exactly as typed (so "\n" stays a Java escape), the first
 * blank line is dropped, and the common indentation is removed.
 */
export function java(strings: TemplateStringsArray, ...values: unknown[]): string {
  const text = String.raw({ raw: strings.raw }, ...values).replace(/^\r?\n/, '').replace(/\s+$/, '');
  const lines = text.split(/\r?\n/);
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)![0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(cut)).join('\n');
}

/** Same as `java`, for expected program output. */
export const out = java;
