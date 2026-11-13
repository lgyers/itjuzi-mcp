import { describe, expect, it } from "vitest";
import { getCategories, getTool, getTools, getToolsByGroup } from "../src/registry.js";

describe("catalog", () => {
  it("covers 22 public tools", () => {
    expect(getTools()).toHaveLength(22);
  });

  it("has business categories", () => {
    expect(getCategories().map((category) => category.group)).toEqual([
      "company",
      "funding",
      "investor",
      "person",
      "fa",
      "lookup",
      "tag",
      "news",
    ]);
  });

  it("keeps declared tool_count in sync with actual tools", () => {
    for (const category of getCategories()) {
      expect(getToolsByGroup(category.group)).toHaveLength(category.tool_count);
    }
  });

  it("has unique tool names", () => {
    const names = getTools().map((tool) => tool.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("has unique cli method per category", () => {
    for (const category of getCategories()) {
      const methods = getToolsByGroup(category.group).map((tool) => tool.cliMethod);
      expect(new Set(methods).size).toBe(methods.length);
    }
  });

  it("contains tag search", () => {
    expect(getTool("search_tags")?.group).toBe("tag");
  });

  it("contains company resolver", () => {
    expect(getTool("resolve_companies")?.group).toBe("company");
  });

  it("contains closed company tools", () => {
    for (const name of ["search_closed_companies", "count_closed_companies", "analyze_closed_company_cohort"]) {
      expect(getTool(name)?.group).toBe("company");
    }
  });

  it("contains person tools", () => {
    for (const name of ["search_people", "get_person_profile", "search_person_investment_cases"]) {
      expect(getTool(name)?.group).toBe("person");
    }
  });

  it("contains newsletter search", () => {
    expect(getTool("search_newsletters")?.group).toBe("news");
  });
});
