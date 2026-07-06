import type { Command } from "commander";
import { callTool } from "../coreClient.js";
import { resolveConfig } from "../config.js";
import { getCategories, getToolsByGroup } from "../registry.js";
import type { CatalogParam, CatalogTool } from "../types.js";
import { emitToolResult } from "./output.js";

export function registerCategoryCommands(program: Command): void {
  for (const category of getCategories()) {
    const categoryCommand = program
      .command(category.group)
      .description(`${category.name_zh}：${category.description}`);
    for (const tool of getToolsByGroup(category.group)) {
      bindToolCommand(categoryCommand, tool, program);
    }
  }
}

function bindToolCommand(categoryCommand: Command, tool: CatalogTool, program: Command): void {
  let command = categoryCommand
    .command(tool.cliMethod)
    .description(tool.description);

  for (const param of tool.params) {
    const flag = `--${param.name} <value>`;
    const description = param.required ? `必填；${param.description}` : param.description;
    command = param.required ? command.requiredOption(flag, description) : command.option(flag, description);
  }

  command.action(async (options: Record<string, string>) => {
    const verbose = Boolean(program.opts().verbose);
    const args = buildArgs(tool.params, options);
    const config = resolveConfig(true);
    const result = await callTool(config, tool.name, args, { verbose, format: program.opts().md ? "markdown" : "json" });
    emitToolResult(result, program.opts());
  });
}

export function buildArgs(params: CatalogParam[], options: Record<string, string>): Record<string, unknown> {
  const args: Record<string, unknown> = {};
  for (const param of params) {
    const raw = options[param.name];
    if (raw === undefined) continue;
    args[param.name] = parseValue(raw, param);
  }
  return args;
}

function parseValue(raw: string, param: CatalogParam): unknown {
  switch (param.type) {
    case "number":
      return Number(raw);
    case "boolean":
      return ["1", "true", "yes", "y"].includes(raw.toLowerCase());
    case "array":
      return raw
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (/^-?\d+$/.test(item) ? Number(item) : item));
    case "json":
      return JSON.parse(raw) as unknown;
    case "string":
    default:
      return raw;
  }
}
