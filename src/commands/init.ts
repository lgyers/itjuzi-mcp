import type { Command } from "commander";
import { DEFAULT_MCP_URL, defaultCoreUrl, saveConfig } from "../config.js";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("配置 IT桔子 MCP endpoint 和 API Key")
    .option("--api-key <key>", "IT桔子 MCP API Key")
    .option("--authorization <value>", "完整 Authorization header，例如 Bearer xxx")
    .option("--url <url>", "MCP endpoint", DEFAULT_MCP_URL)
    .option("--core-url <url>", "工具调用 HTTP endpoint，默认从 MCP endpoint 推导")
    .action((opts: { apiKey?: string; authorization?: string; url: string; coreUrl?: string }) => {
      const authorization = opts.authorization || (opts.apiKey ? `Bearer ${opts.apiKey}` : undefined);
      if (!authorization) {
        throw new Error("请通过 --api-key 或 --authorization 提供访问凭据");
      }
      const config = {
        url: opts.url,
        coreUrl: opts.coreUrl || defaultCoreUrl(opts.url),
        headers: {
          Authorization: authorization,
        },
      };
      saveConfig(config);
      console.log("已保存配置到 ~/.itjuzi-mcp/config.json");
    });
}
