import { Fragment, type ReactNode } from 'react';

// A deliberately tiny formatter for lesson text:
//   blank line → new paragraph, ```fenced``` → code block,
//   lines starting "- " or "1. " → lists, `code` → inline code, **bold**, *italic*.

function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g);
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return <code key={key}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={key}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={key}>{part.slice(1, -1)}</em>;
    return <Fragment key={key}>{part}</Fragment>;
  });
}

const BULLET = /^- /;
const NUMBERED = /^\d+\. /;

/** One paragraph: runs of list lines become <ul>/<ol>, other lines become a <p> with line breaks. */
function paragraph(text: string, key: string): ReactNode[] {
  const blocks: ReactNode[] = [];
  const lines = text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const marker = BULLET.test(lines[i]) ? BULLET : NUMBERED.test(lines[i]) ? NUMBERED : null;
    const start = i;
    const isPlain = (line: string) => !BULLET.test(line) && !NUMBERED.test(line);
    while (i < lines.length && (marker ? marker.test(lines[i]) : isPlain(lines[i]))) i++;
    const group = lines.slice(start, i);
    const k = `${key}-${start}`;

    if (!marker) {
      blocks.push(
        <p key={k}>
          {group.map((line, n) => (
            <Fragment key={n}>
              {n > 0 && <br />}
              {inline(line, `${k}-${n}`)}
            </Fragment>
          ))}
        </p>,
      );
    } else {
      const items = group.map((line, n) => <li key={n}>{inline(line.replace(marker, ''), `${k}-${n}`)}</li>);
      blocks.push(marker === BULLET ? <ul key={k}>{items}</ul> : <ol key={k}>{items}</ol>);
    }
  }
  return blocks;
}

/** Renders lesson text. `inline` keeps everything as phrasing content (for headings, buttons). */
export function Markup({ text, inline: asInline = false }: { text: string; inline?: boolean }) {
  if (asInline) return <>{inline(text.replace(/\s*\n+\s*/g, ' '), 'i')}</>;
  const blocks: ReactNode[] = [];
  const chunks = text.split(/```\n?([\s\S]*?)\n?```/g);
  chunks.forEach((chunk, i) => {
    if (i % 2 === 1) {
      blocks.push(
        <pre key={`pre-${i}`} className="markup-pre">
          <code>{chunk}</code>
        </pre>,
      );
      return;
    }
    chunk
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p, j) => blocks.push(...paragraph(p, `${i}-${j}`)));
  });
  return <div className="markup">{blocks}</div>;
}
