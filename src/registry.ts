import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { Catalog, CatalogCategory, CatalogTool } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = resolve(__dirname, "catalog.json");

let cachedCatalog: Catalog | null = null;

export function loadCatalog(): Catalog {
  if (!cachedCatalog) {
    cachedCatalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8")) as Catalog;
  }
  return cachedCatalog;
}

export function getCategories(): CatalogCategory[] {
  return loadCatalog().categories;
}

export function getTools(): CatalogTool[] {
  return loadCatalog().tools;
}

export function getToolsByGroup(group: string): CatalogTool[] {
  return getTools().filter((tool) => tool.group === group);
}

export function getTool(name: string): CatalogTool | undefined {
  return getTools().find((tool) => tool.name === name);
}
