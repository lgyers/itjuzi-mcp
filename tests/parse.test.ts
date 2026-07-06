import { describe, expect, it } from "vitest";
import { buildArgs } from "../src/commands/category.js";
import type { CatalogParam } from "../src/types.js";

describe("buildArgs", () => {
  it("parses common parameter types", () => {
    const params: CatalogParam[] = [
      { name: "tag_ids", type: "array", description: "" },
      { name: "limit", type: "number", description: "" },
      { name: "is_fa", type: "boolean", description: "" },
      { name: "regions", type: "json", description: "" },
      { name: "keyword", type: "string", description: "" },
    ];
    expect(
      buildArgs(params, {
        tag_ids: "14956,123",
        limit: "20",
        is_fa: "true",
        regions: '[{"name":"全国","location":"in"}]',
        keyword: "具身智能",
      }),
    ).toEqual({
      tag_ids: [14956, 123],
      limit: 20,
      is_fa: true,
      regions: [{ name: "全国", location: "in" }],
      keyword: "具身智能",
    });
  });
});
