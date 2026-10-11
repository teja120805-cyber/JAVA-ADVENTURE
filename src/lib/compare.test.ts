import { describe, expect, it } from 'vitest';
import { compareOutput, normalizeOutput } from './compare';

describe('normalizeOutput', () => {
  it('turns Windows line endings into \\n', () => {
    expect(normalizeOutput('a\r\nb\r\n')).toBe('a\nb');
  });

  it('removes trailing spaces on each line and blank lines at the ends', () => {
    expect(normalizeOutput('\n  hi   \nthere \t\n\n')).toBe('  hi\nthere');
  });

  it('keeps leading spaces and blank lines in the middle', () => {
    expect(normalizeOutput('  *\n\n ***')).toBe('  *\n\n ***');
  });
});

describe('compareOutput', () => {
  it('passes when only trailing whitespace differs', () => {
    expect(compareOutput('Hello\r\nWorld  \r\n', 'Hello\nWorld').pass).toBe(true);
  });

  it('reports the first line that differs', () => {
    const result = compareOutput('Gold: 10\nGems: 3\n', 'Gold: 10\nGems: 4');
    expect(result).toEqual({ pass: false, firstDiffLine: 2, expectedLine: 'Gems: 4', actualLine: 'Gems: 3' });
  });

  it('notices missing lines', () => {
    const result = compareOutput('one\n', 'one\ntwo');
    expect(result.pass).toBe(false);
    expect(result.firstDiffLine).toBe(2);
    expect(result.actualLine).toBe('(nothing)');
  });

  it('notices extra lines', () => {
    const result = compareOutput('one\ntwo\n', 'one');
    expect(result.pass).toBe(false);
    expect(result.expectedLine).toBe('(nothing)');
  });

  it('is case-sensitive, like Java', () => {
    expect(compareOutput('hello', 'Hello').pass).toBe(false);
  });
});
