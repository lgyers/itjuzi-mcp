import type { McpToolCallResult, ResolvedConfig, ToolCallResponse } from "./types.js";
import { maskToken } from "./config.js";
import { VERSION } from "./version.js";

const JSON_RPC_VERSION = "2.0";

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
  const url = config.url;
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    ...config.headers,
  };
  const body = {
    jsonrpc: JSON_RPC_VERSION,
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2025-03-26",
      capabilities: {},
      clientInfo: { name: "itjuzi-mcp-cli", version: VERSION },
    },
  };
  if (verbose) {
    console.error(`> POST ${url}`);
    console.error(`> headers: ${JSON.stringify(maskHeaders(headers))}`);
    console.error(`> body: ${JSON.stringify(body)}`);
  }
  const response = await fetch(config.url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
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
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
    ...config.headers,
  };
  const body = {
    jsonrpc: JSON_RPC_VERSION,
    id: 2,
    method: "tools/call",
    params: {
      name: "get_lookup_options",
      arguments: {},
    },
  };
  if (verbose) {
    console.error(`> POST ${config.url}`);
    console.error(`> headers: ${JSON.stringify(maskHeaders(headers))}`);
    console.error(`> body: ${JSON.stringify(body)}`);
  }
  const response = await fetch(config.url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await response.text();
  if (verbose) {
    console.error(`< ${response.status} ${response.statusText}`);
    console.error(`< body: ${text.slice(0, 500)}`);
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`auth 校验失败：HTTP ${response.status}\n${safeErrorText(text)}`);
  }
  assertJsonRpcSuccess(text, "auth 校验失败");
}

export async function verifyCoreEndpoint(config: ResolvedConfig, verbose = false): Promise<void> {
  const url = siblingUrl(config.coreUrl, "/ready");
  if (verbose) console.error(`> GET ${url}`);
  const response = await fetch(url, { method: "GET", headers: { Accept: "text/plain, application/json" } });
  const text = await response.text();
  if (verbose) {
    console.error(`< ${response.status} ${response.statusText}`);
    console.error(`< body: ${text.slice(0, 500)}`);
  }
  if (response.status < 200 || response.status >= 300) {
    throw new Error(`工具调用 endpoint 校验失败：HTTP ${response.status}\n${text.slice(0, 500)}`);
  }
}

export async function verifyCoreAuth(config: ResolvedConfig, verbose = false): Promise<void> {
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

function assertJsonRpcSuccess(text: string, prefix: string): void {
  try {
    const parsed = JSON.parse(text) as {
      error?: unknown;
      result?: {
        isError?: boolean;
        content?: Array<{ type?: string; text?: string }>;
      };
    };
    if (parsed.error) {
      const message =
        typeof parsed.error === "object" && parsed.error !== null && "message" in parsed.error
          ? String((parsed.error as { message?: unknown }).message || "请求失败")
          : String(parsed.error);
      throw new Error(`${prefix}：${message}`);
    }
    if (parsed.result?.isError) {
      const message = parsed.result.content?.map((item) => item.text).filter(Boolean).join("\n") || "请求失败";
      throw new Error(`${prefix}：${message}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith(prefix)) throw error;
  }
}

function maskHeaders(headers: Record<string, string>): Record<string, string> {
  const masked: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    masked[key] = key.toLowerCase() === "authorization" ? maskToken(value) : value;
  }
  return masked;
}
