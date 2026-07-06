import type { Command } from "commander";
import { resolveConfig } from "../config.js";
import { verifyAuth, verifyEndpoint } from "../coreClient.js";

export function registerDoctorCommand(program: Command): void {
  program
    .command("doctor")
    .description("检查 endpoint、配置和鉴权状态")
    .option("--no-auth", "只检查 endpoint，不检查 API Key")
    .action(async (opts: { auth: boolean }) => {
      const verbose = Boolean(program.opts().verbose);
      const config = resolveConfig(opts.auth);
      console.log(`MCP endpoint: ${config.url}`);
      console.log(`Tool call endpoint: ${config.coreUrl}`);
      await verifyEndpoint(config, verbose);
      console.log("endpoint 检查通过");
      if (opts.auth) {
        await verifyAuth(config, verbose);
        console.log("鉴权检查通过");
      }
    });
}
