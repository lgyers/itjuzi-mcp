import { describe, expect, it } from "vitest";
import { defaultCoreUrl, maskToken } from "../src/config.js";

describe("config helpers", () => {
  it("derives core tool call url", () => {
    expect(defaultCoreUrl("https://mcp.itjuzi.com/mcp")).toBe("https://mcp.itjuzi.com/v1/core/tools/call");
  });

  it("masks authorization token", () => {
    expect(maskToken("Bearer itjuzi_mcp_abcdefghijklmnopqrstuvwxyz")).toBe("Bearer i****wxyz");
  });
});
