import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(new URL(".", import.meta.url).pathname, "..");
const sourceDir = path.resolve(repoRoot, "../itjuzi-mcp-service/skills");
const targetDir = path.join(repoRoot, "workbuddy", "skills");

if (!existsSync(sourceDir)) {
  throw new Error(`Source skills directory not found: ${sourceDir}`);
}

const skillDirs = (await readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

await rm(targetDir, { recursive: true, force: true });
await mkdir(targetDir, { recursive: true });

for (const sourceSkillName of skillDirs) {
  const sourceSkillPath = path.join(sourceDir, sourceSkillName, "SKILL.md");
  if (!existsSync(sourceSkillPath)) continue;

  let content = await readFile(sourceSkillPath, "utf8");
  const skillName = sourceSkillName === "sector_funding_brief"
    ? "sector-funding-brief"
    : sourceSkillName;

  content = content.replace(
    /^name:\s*sector_funding_brief$/m,
    `name: ${skillName}`,
  );

  content = content.replace(
    /## MCP 连接信息[\s\S]*?(?=## 适用场景)/,
    `## MCP 连接信息\n\n本 Skill 由 WorkBuddy 连接器自动携带 \`Authorization: Bearer \${ITJUZI_MCP_API_KEY}\`。不要向用户索要 API Key，也不要在工具参数里传 \`api_key\`。\n\n`,
  );

  content = content
    .split("\n")
    .filter((line) => !line.includes('"api_key"'))
    .join("\n");

  const targetSkillDir = path.join(targetDir, skillName);
  await mkdir(targetSkillDir, { recursive: true });
  await writeFile(path.join(targetSkillDir, "SKILL.md"), content, "utf8");
}

console.log(`Synced ${skillDirs.length} WorkBuddy skills from ${sourceDir}`);
