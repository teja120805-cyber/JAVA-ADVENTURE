import { indentWithTab } from '@codemirror/commands';
import { java } from '@codemirror/lang-java';
import { lintGutter, setDiagnostics, type Diagnostic } from '@codemirror/lint';
import { Compartment, EditorState, Prec } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';
import type { JavaError } from '../lib/api-types';
import styles from './CodeEditor.module.css';

interface Props {
  value: string;
  onChange: (code: string) => void;
  errors: JavaError[];
  dark: boolean;
  onRun: () => void;
  onSubmit?: () => void;
  label: string;
  /** Bump this to move the cursor to a line (e.g. clicking an error). */
  focusLine?: { line: number; nonce: number };
}

const baseTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '15px' },
  '.cm-scroller': { fontFamily: 'var(--font-code)', lineHeight: '1.6' },
  '.cm-content': { padding: '10px 0' },
  '.cm-gutters': { border: 'none' },
});

const lightTheme = EditorView.theme({
  '&': { backgroundColor: 'var(--surface)' },
  '.cm-gutters': { backgroundColor: 'var(--surface-2)', color: '#8a93a3' },
  '.cm-activeLine': { backgroundColor: '#f2fbf6' },
  '.cm-activeLineGutter': { backgroundColor: '#e3f5ec' },
});

export function CodeEditor({ value, onChange, errors, dark, onRun, onSubmit, label, focusLine }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const themeSlot = useRef(new Compartment());
  // Keep the latest callbacks without rebuilding the editor.
  const callbacks = useRef({ onChange, onRun, onSubmit });
  callbacks.current = { onChange, onRun, onSubmit };

  useEffect(() => {
    const shortcuts = Prec.highest(
      keymap.of([
        { key: 'Mod-Enter', run: () => (callbacks.current.onRun(), true) },
        { key: 'Shift-Mod-Enter', run: () => (callbacks.current.onSubmit?.(), true) },
      ]),
    );
    view.current = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          shortcuts,
          basicSetup,
          keymap.of([indentWithTab]),
          java(),
          lintGutter(),
          baseTheme,
          themeSlot.current.of(dark ? oneDark : lightTheme),
          EditorView.contentAttributes.of({ 'aria-label': label }),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) callbacks.current.onChange(u.state.doc.toString());
          }),
        ],
      }),
    });
    return () => view.current?.destroy();
    // The editor is created once; later prop changes are pushed in by the effects below.
  }, []);

  // Replace the text when the parent switches to different code.
  useEffect(() => {
    const v = view.current;
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } });
    }
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({ effects: themeSlot.current.reconfigure(dark ? oneDark : lightTheme) });
  }, [dark]);

  // Underline and mark error lines.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const doc = v.state.doc;
    const diagnostics: Diagnostic[] = errors
      .filter((e) => e.line !== null && e.line >= 1 && e.line <= doc.lines)
      .map((e) => {
        const line = doc.line(e.line!);
        return {
          from: line.from,
          to: Math.max(line.to, line.from),
          severity: 'error',
          message: e.hint ? `${e.message}\n${e.hint}` : e.message,
        };
      });
    v.dispatch(setDiagnostics(v.state, diagnostics));
  }, [errors]);

  useEffect(() => {
    const v = view.current;
    if (!v || !focusLine) return;
    const n = Math.min(Math.max(1, focusLine.line), v.state.doc.lines);
    const line = v.state.doc.line(n);
    v.dispatch({ selection: { anchor: line.to }, effects: EditorView.scrollIntoView(line.from, { y: 'center' }) });
    v.focus();
  }, [focusLine]);

  return <div ref={host} className={styles.editor} />;
}
