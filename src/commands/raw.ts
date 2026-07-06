import type { Command } from "commander";
import { resolveConfig } from "../config.js";
import { callTool } from "../coreClient.js";
import { getTool } from "../registry.js";
import { emitToolResult } from "./output.js";

export function registerRawCommand(program: Command): void {
  program
    .command("raw")
    .description("按原始工具名调用公开 MCP 工具，适合技术用户调试")
    .argument("<tool_name>", "工具名，例如 search_tags")
    .requiredOption("--json <args>", "工具参数 JSON")
    .action(async (toolName: string, opts: { json: string }) => {
      if (!getTool(toolName)) {
        throw new Error(`未知工具：${toolName}。请运行 itjuzi-mcp tools 查看公开工具列表。`);
      }
      const args = JSON.parse(opts.json) as Record<string, unknown>;
      const verbose = Boolean(program.opts().verbose);
      const config = resolveConfig(true);
      const result = await callTool(config, toolName, args, { verbose, format: program.opts().md ? "markdown" : "json" });
      emitToolResult(result, program.opts());
    });
}
