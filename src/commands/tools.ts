import type { Command } from "commander";
import { getCategories, getToolsByGroup } from "../registry.js";

export function registerToolsCommand(program: Command): void {
  program
    .command("tools")
    .description("列出 IT桔子 MCP 当前公开工具")
    .option("--json", "输出 JSON")
    .action((opts: { json?: boolean }) => {
      const categories = getCategories().map((category) => ({
        ...category,
        tools: getToolsByGroup(category.group).map((tool) => ({
          name: tool.name,
          command: `itjuzi-mcp ${tool.group} ${tool.cliMethod}`,
          description: tool.description,
          examples: tool.examples,
        })),
      }));
      if (opts.json) {
        console.log(JSON.stringify(categories, null, 2));
        return;
      }
      for (const category of categories) {
        console.log(`\n${category.name_zh} (${category.group})`);
        console.log(category.description);
        for (const tool of category.tools) {
          console.log(`  ${tool.command}`);
          console.log(`    ${tool.name} - ${tool.description}`);
        }
      }
    });
}
