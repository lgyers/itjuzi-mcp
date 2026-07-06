import { writeFileSync } from "node:fs";
import type { McpToolCallResult } from "../types.js";

export interface OutputOptions {
  pretty?: boolean;
  compact?: boolean;
  md?: boolean;
  head?: string | boolean;
  tail?: string | boolean;
  full?: boolean;
  outputFile?: string;
}

export function emitToolResult(result: McpToolCallResult, opts: OutputOptions = {}): void {
  const text = result.content[0]?.text ?? "";
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // keep text
  }
  const fullText = formatOutput(parsed, opts);
  if (opts.outputFile) {
    writeFileSync(opts.outputFile, fullText + "\n", "utf-8");
  }
  console.log(applyLineLimits(fullText, opts));
}

export function formatOutput(value: unknown, opts: OutputOptions = {}): string {
  if (opts.md) return toMarkdown(value);
  if (typeof value === "string") return value;
  if (opts.compact) return JSON.stringify(value);
  return JSON.stringify(value, null, 2);
}

function toMarkdown(value: unknown): string {
  const rows = extractRows(value);
  if (!rows.length) {
    return "无结果";
  }
  const keys = Array.from(new Set(rows.flatMap((row) => Object.keys(row)))).slice(0, 12);
  const header = `| ${keys.join(" |")} |`;
  const sep = `| ${keys.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${keys.map((key) => cell(row[key])).join(" | ")} |`);
  return [header, sep, ...body].join("\n");
}

function extractRows(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(isRecord);
  if (isRecord(value)) {
    const data = value.data;
    if (Array.isArray(data)) return data.filter(isRecord);
    if (isRecord(data) && Array.isArray(data.items)) return data.items.filter(isRecord);
    return [value];
  }
  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value).replace(/\|/g, "\\|");
  return String(value).replace(/\|/g, "\\|");
}

function applyLineLimits(text: string, opts: OutputOptions): string {
  if (opts.full) return text;
  const lines = text.split("\n");
  const head = parseLimit(opts.head, 0);
  const tail = parseLimit(opts.tail, 0);
  if (!head && !tail) return text;
  if (head && tail && lines.length > head + tail) {
    return [...lines.slice(0, head), `... omitted ${lines.length - head - tail} lines ...`, ...lines.slice(-tail)].join("\n");
  }
  if (head) return lines.slice(0, head).join("\n");
  if (tail) return lines.slice(-tail).join("\n");
  return text;
}

function parseLimit(value: string | boolean | undefined, defaultValue: number): number {
  if (value === undefined || value === false) return 0;
  if (value === true) return defaultValue || 50;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}
