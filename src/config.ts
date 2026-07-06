import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ClientConfig, ResolvedConfig } from "./types.js";

export const DEFAULT_MCP_URL = "https://mcp.itjuzi.com/mcp";
export const CONFIG_DIR = join(homedir(), ".itjuzi-mcp");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");

export function defaultCoreUrl(mcpUrl: string): string {
  const u = new URL(mcpUrl);
  const path = u.pathname.replace(/\/+$/, "");
  if (path === "" || path === "/mcp" || path === "/v1") {
    u.pathname = "/v1/core/tools/call";
  } else if (!path.endsWith("/core/tools/call")) {
    u.pathname = `${path}/core/tools/call`;
  }
  u.search = "";
  u.hash = "";
  return u.toString();
}

export function loadConfig(): ClientConfig | null {
  if (!existsSync(CONFIG_FILE)) return null;
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8")) as ClientConfig;
  } catch {
    return null;
  }
}

export function saveConfig(config: ClientConfig): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n", "utf-8");
  try {
    chmodSync(CONFIG_FILE, 0o600);
  } catch {
    // best effort on platforms without POSIX chmod semantics
  }
}

export function resolveConfig(requireAuth = true): ResolvedConfig {
  const stored = loadConfig() || {};
  const url = process.env.ITJUZI_MCP_ENDPOINT || stored.url || DEFAULT_MCP_URL;
  const coreUrl = process.env.ITJUZI_MCP_CORE_ENDPOINT || stored.coreUrl || defaultCoreUrl(url);
  const headers: Record<string, string> = { ...(stored.headers || {}) };
  if (!headers.Authorization && process.env.ITJUZI_MCP_API_KEY) {
    headers.Authorization = `Bearer ${process.env.ITJUZI_MCP_API_KEY}`;
  }
  if (!headers.Authorization && process.env.ITJUZI_MCP_AUTHORIZATION) {
    headers.Authorization = process.env.ITJUZI_MCP_AUTHORIZATION;
  }
  if (requireAuth && !headers.Authorization) {
    throw new Error("未配置 API Key。请先运行：itjuzi-mcp init --api-key YOUR_API_KEY");
  }
  return { url, coreUrl, headers };
}

export function maskToken(value: string): string {
  if (!value) return "";
  if (value.length <= 12) return "****";
  return `${value.slice(0, 8)}****${value.slice(-4)}`;
}
