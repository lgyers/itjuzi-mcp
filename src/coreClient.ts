import type { McpToolCallResult, ResolvedConfig, ToolCallResponse } from "./types.js";
import { maskToken } from "./config.js";

function siblingUrl(coreUrl: string, siblingPath: string): string {
  const u = new URL(coreUrl);
  const path = u.pathname.replace(/\/+$/, "");
  if (path.endsWith("/tools/call")) {
    u.pathname = path.slice(0, -"/tools/call".length) + siblingPath;
  } else {
    u.pathname = `${path}${siblingPath}`;
  }
  u.search = "";
  u.hash = "";
  return u.toString();
}

export async function verifyEndpoint(config: ResolvedConfig, verbose = false): Promise<void> {
  const url = siblingUrl(config.coreUrl, "/ready");
  if (verbose) console.error(`> GET ${url}`);
  const response = await fetch(url, { method: "GET", headers: { Accept: "text/plain, application/json" } });
  const text = await response.text();
  if (verbose) {
    console.error(`< ${response.status} ${response.statusText}`);
    console.error(`< body: ${text.slice(0, 500)}`);
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`endpoint 校验失败：HTTP ${response.status}\n${text.slice(0, 500)}`);
  }
}

export async function verifyAuth(config: ResolvedConfig, verbose = false): Promise<void> {
  const url = siblingUrl(config.coreUrl, "/auth/ready");
  const headers = { Accept: "text/plain, application/json", ...config.headers };
  if (verbose) {
    console.error(`> GET ${url}`);
    console.error(`> headers: ${JSON.stringify(maskHeaders(headers))}`);
  }
  const response = await fetch(url, { method: "GET", headers });
  const text = await response.text();
  if (verbose) {
    console.error(`< ${response.status} ${response.statusText}`);
    console.error(`< body: ${text.slice(0, 500)}`);
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`auth 校验失败：HTTP ${response.status}\n${safeErrorText(text)}`);
  }
}

export async function callTool(
  config: ResolvedConfig,
  toolName: string,
  args: Record<string, unknown>,
  opts: { verbose?: boolean; format?: "json" | "markdown" } = {},
): Promise<McpToolCallResult> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...config.headers,
  };
  const body = {
    tool_name: toolName,
    arguments: args,
    format: opts.format || "json",
  };
  if (opts.verbose) {
    console.error(`> POST ${config.coreUrl}`);
    console.error(`> headers: ${JSON.stringify(maskHeaders(headers))}`);
    console.error(`> body: ${JSON.stringify(body)}`);
  }
  const response = await fetch(config.coreUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (opts.verbose) {
    console.error(`< ${response.status} ${response.statusText}`);
    console.error(`< body: ${text.slice(0, 2000)}`);
  }
  let parsed: ToolCallResponse;
  try {
    parsed = JSON.parse(text) as ToolCallResponse;
  } catch {
    throw new Error(`远程响应不是 JSON：HTTP ${response.status}\n${text.slice(0, 500)}`);
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`工具调用失败：HTTP ${response.status}\n${parsed.error_description || parsed.error || "请求失败"}`);
  }
  const content = parsed.content;
  const contentText = typeof content === "string" ? content : JSON.stringify(content ?? {});
  return { content: [{ type: "text", text: contentText }] };
}

function safeErrorText(text: string): string {
  try {
    const parsed = JSON.parse(text) as ToolCallResponse;
    return String(parsed.error_description || parsed.error || "请求失败");
  } catch {
    return text.slice(0, 300);
  }
}

function maskHeaders(headers: Record<string, string>): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    masked[key] = key.toLowerCase() === "authorization" ? maskToken(value) : value;
  }
  return masked;
}
