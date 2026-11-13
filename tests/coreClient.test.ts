import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyAuth, verifyEndpoint } from "../src/coreClient.js";

describe("core client endpoint checks", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("checks the configured MCP endpoint instead of derived core tool endpoint", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ jsonrpc: "2.0", id: 1, result: {} })));
    vi.stubGlobal("fetch", fetchMock);

    await verifyEndpoint({
      url: "https://mcp.itjuzi.com/mcp",
      coreUrl: "https://mcp.itjuzi.com/v1/core/tools/call",
      headers: { Authorization: "Bearer test" },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("https://mcp.itjuzi.com/mcp");
    expect(fetchMock.mock.calls[0][0]).not.toContain("/v1/core/tools/call");
  });

  it("checks auth through standard MCP tools call endpoint", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ jsonrpc: "2.0", id: 2, result: {} })));
    vi.stubGlobal("fetch", fetchMock);

    await verifyAuth({
      url: "https://mcp.itjuzi.com/mcp",
      coreUrl: "https://mcp.itjuzi.com/v1/core/tools/call",
      headers: { Authorization: "Bearer test" },
    });

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(String(init?.body));
    expect(url).toBe("https://mcp.itjuzi.com/mcp");
    expect(body.method).toBe("tools/call");
    expect(body.params.name).toBe("get_lookup_options");
  });

  it("fails auth when standard MCP tool call returns isError", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            jsonrpc: "2.0",
            id: 2,
            result: {
              content: [{ type: "text", text: "Error executing tool get_lookup_options: API Key 无效或已过期" }],
              isError: true,
            },
          }),
        ),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      verifyAuth({
        url: "https://mcp.itjuzi.com/mcp",
        coreUrl: "https://mcp.itjuzi.com/v1/core/tools/call",
        headers: { Authorization: "Bearer invalid" },
      }),
    ).rejects.toThrow("API Key 无效或已过期");
  });
});
