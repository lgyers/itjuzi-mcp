import { describe, expect, it } from "vitest";
import { getCategories, getTool, getTools } from "../src/registry.js";

describe("catalog", () => {
  it("covers 14 public tools", () => {
    expect(getTools()).toHaveLength(14);
  });

  it("has business categories", () => {
    expect(getCategories().map((category) => category.group)).toEqual([
      "company",
      "funding",
      "investor",
      "fa",
      "lookup",
      "tag",
    ]);
  });

  it("contains tag search", () => {
    expect(getTool("search_tags")?.group).toBe("tag");
  });
});
