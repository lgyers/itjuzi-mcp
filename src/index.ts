#!/usr/bin/env node
import { Command } from "commander";
import { registerCategoryCommands } from "./commands/category.js";
import { registerDoctorCommand } from "./commands/doctor.js";
import { registerExamplesCommand } from "./commands/examples.js";
import { registerInitCommand } from "./commands/init.js";
import { registerPrintConfigCommand } from "./commands/printConfig.js";
import { registerRawCommand } from "./commands/raw.js";
import { registerToolsCommand } from "./commands/tools.js";
import { VERSION } from "./version.js";

const program = new Command()
  .name("itjuzi-mcp")
  .description("IT桔子 MCP 公开客户端：自然语言接入配置、诊断和远程工具调用")
  .version(VERSION, "-V, --version", "输出版本号")
  .helpOption("-h, --help", "显示帮助")
  .option("--pretty", "缩进 JSON 输出，默认")
  .option("--compact", "紧凑单行 JSON 输出")
  .option("--md", "Markdown 表格输出")
  .option("--head [n]", "只输出前 N 行，不传值默认 50")
  .option("--tail [n]", "只输出后 N 行，不传值默认 20")
  .option("--full", "输出完整内容")
  .option("--output-file <path>", "把完整输出保存到文件")
  .option("--verbose", "打印请求细节，Authorization 会脱敏")
  .addHelpText(
    "after",
    `
推荐使用方式

  1. 在 Worker Body、Claude、Cursor 等 MCP 客户端中配置远程服务后，用自然语言提问。
  2. 使用 CLI 生成配置、检查连接、查看工具说明和复现单个工具调用。

快速开始

  itjuzi-mcp init --api-key YOUR_API_KEY
  itjuzi-mcp doctor
  itjuzi-mcp print-config --client worker-body
  itjuzi-mcp examples
  itjuzi-mcp tools
`,
  );

registerInitCommand(program);
registerDoctorCommand(program);
registerPrintConfigCommand(program);
registerExamplesCommand(program);
registerToolsCommand(program);
registerRawCommand(program);
registerCategoryCommands(program);

program.parseAsync(process.argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`请求失败: ${message}`);
  process.exit(1);
});
