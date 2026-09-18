"use client";

import { Fragment, useMemo } from "react";

/**
 * Dependency-free markdown renderer covering the subset DataLens emits:
 * headings, bold/italic/code, bullets/numbered lists, blockquotes, tables,
 * links, and horizontal rules. Escapes HTML first — safe by construction.
 */

export default function Markdown({ text, className = "" }: { text: string; className?: string }) {
  const blocks = useMemo(() => parseBlocks(text), [text]);
  return (
    <div className={`dl-md ${className}`}>
      {blocks.map((b, i) => (
        <Fragment key={i}>{renderBlock(b, i)}</Fragment>
      ))}
    </div>
  );
}

/* ────────────────────────── Block parsing ────────────────────────── */

type Block =
  | { kind: "h"; level: number; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "quote"; text: string }
  | { kind: "code"; lang: string; text: string }
  | { kind: "table"; header: string[]; rows: string[][] }
  | { kind: "hr" };

function parseBlocks(src: string): Block[] {
  const lines = src.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const isTableSep = (l: string) => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(l) && l.includes("|") && /-/.test(l);
  const splitRow = (l: string) =>
    l.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") { i++; continue; }

    // Fenced code
    if (/^\s*```/.test(line)) {
      const lang = line.replace(/^\s*```/, "").trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^\s*```/.test(lines[i])) buf.push(lines[i++]);
      i++; // closing fence
      blocks.push({ kind: "code", lang, text: buf.join("\n") });
      continue;
    }

    // Heading
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) { blocks.push({ kind: "h", level: h[1].length, text: h[2] }); i++; continue; }

    // HR
    if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { blocks.push({ kind: "hr" }); i++; continue; }

    // Table
    if (line.includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        rows.push(splitRow(lines[i]));
        i++;
      }
      blocks.push({ kind: "table", header, rows });
      continue;
    }

    // Quote
    if (/^\s*>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ""));
      blocks.push({ kind: "quote", text: buf.join(" ") });
      continue;
    }

    // Lists (collect contiguous items; allow bold-only single-line items)
    if (/^\s*[-*•]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*•]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*•]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+[.)]\s+/, ""));
        i++;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    // Paragraph: consume until blank line / new block opener
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^\s*([-*•]\s|\d+[.)]\s|#{1,4}\s|>\s?|```)/.test(lines[i]) &&
      !(lines[i].includes("|") && i + 1 < lines.length && isTableSep(lines[i + 1]))
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ kind: "p", text: buf.join(" ") });
  }
  return blocks;
}

/* ────────────────────────── Inline rendering ────────────────────────── */

function renderInline(text: string): React.ReactNode {
  // Escape then tokenize bold / italic / code / links
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const parts: React.ReactNode[] = [];
  const re = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_|`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|\/)[^)\s]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(escaped)) !== null) {
    if (m.index > last) parts.push(escaped.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("***")) {
      parts.push(<strong key={key++}><em>{tok.slice(3, -3)}</em></strong>);
    } else if (tok.startsWith("**")) {
      parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("`")) {
      parts.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("[")) {
      const lm = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(tok)!;
      parts.push(
        <a key={key++} href={lm[2]} target={lm[2].startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {lm[1]}
        </a>
      );
    } else {
      parts.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < escaped.length) parts.push(escaped.slice(last));
  return parts;
}

/* ────────────────────────── Block rendering ────────────────────────── */

function renderBlock(b: Block, key: number): React.ReactNode {
  switch (b.kind) {
    case "h": {
      const Tag = (b.level <= 1 ? "h3" : b.level === 2 ? "h3" : "h4") as "h3" | "h4";
      return <Tag key={key} className={b.level <= 2 ? "dl-md-h2" : "dl-md-h3"}>{renderInline(b.text)}</Tag>;
    }
    case "p":
      return <p key={key} className="dl-md-p">{renderInline(b.text)}</p>;
    case "ul":
      return (
        <ul key={key} className="dl-md-ul">
          {b.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
        </ul>
      );
    case "ol":
      return (
        <ol key={key} className="dl-md-ol">
          {b.items.map((it, i) => <li key={i}>{renderInline(it)}</li>)}
        </ol>
      );
    case "quote":
      return <blockquote key={key} className="dl-md-quote">{renderInline(b.text)}</blockquote>;
    case "code":
      return (
        <pre key={key} className="dl-md-pre"><code>{b.text}</code></pre>
      );
    case "table":
      return (
        <div key={key} className="dl-md-tablewrap">
          <table className="dl-md-table">
            <thead>
              <tr>{b.header.map((h, i) => <th key={i}>{renderInline(h)}</th>)}</tr>
            </thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j}>{renderInline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "hr":
      return <hr key={key} className="dl-md-hr" />;
  }
}
