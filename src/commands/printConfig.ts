import type { Command } from "commander";
import { DEFAULT_MCP_URL, loadConfig } from "../config.js";

export function registerPrintConfigCommand(program: Command): void {
  program
    .command("print-config")
    .description("输出可复制到 MCP 客户端的配置")
    .option("--client <name>", "客户端名称：workbuddy、claude、cursor、cherry-studio", "workbuddy")
    .action((opts: { client: string }) => {
      const stored = loadConfig() || {};
      const url = stored.url || DEFAULT_MCP_URL;
      const authorization = stored.headers?.Authorization || "Bearer YOUR_ITJUZI_MCP_API_KEY";
      const config = {
        mcpServers: {
          "itjuzi-mcp": {
            url,
            transport: "streamable-http",
            headers: {
              Authorization: authorization,
            },
            disabled: false,
          },
        },
      };
      console.log(JSON.stringify(config, null, 2));
      if (!["workbuddy", "claude", "cursor", "cherry-studio"].includes(opts.client)) {
        console.error(`提示：未知客户端 ${opts.client}，已输出通用 MCP 配置。`);
      }
    });
}
