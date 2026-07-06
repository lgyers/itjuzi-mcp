export type OutputFormat = "pretty" | "compact" | "markdown";

export interface ClientConfig {
  url?: string;
  coreUrl?: string;
  headers?: Record<string, string>;
}

export interface ResolvedConfig {
  url: string;
  coreUrl: string;
  headers: Record<string, string>;
}

export interface CatalogParam {
  name: string;
  description: string;
  required?: boolean;
  type?: "string" | "number" | "boolean" | "array" | "json";
}

export interface CatalogTool {
  name: string;
  group: string;
  cliMethod: string;
  description: string;
  params: CatalogParam[];
  examples: string[];
}

export interface CatalogCategory {
  group: string;
  name_zh: string;
  description: string;
  tool_count: number;
}

export interface Catalog {
  categories: CatalogCategory[];
  tools: CatalogTool[];
}

export interface ToolCallResponse {
  tool_name?: string;
  content?: unknown;
  error?: string;
  error_description?: string;
  [key: string]: unknown;
}

export interface McpContentItem {
  type: "text";
  text: string;
}

export interface McpToolCallResult {
  content: McpContentItem[];
}
