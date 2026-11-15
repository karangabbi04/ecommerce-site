import { ToolDefinition } from "./interface";
import { couponTools } from "./coupon/index.js";
import { couponExecutor } from "./coupon/coupon.executors.js";
import { categoryTools } from "./category/index.js";
import { categoryExecutor } from "./category/category.executors.js";

export const ALL_TOOLS: ToolDefinition[] = [
  ...couponTools,
  ...categoryTools,
];


// 2. Helper: AI ko sirf actual tool definitions chahiye
export function getToolDefinitions(): ToolDefinition[] {
  return ALL_TOOLS;
}

// 3. Helper: Executor ko sirf function chahiye name ke basis par
export function getExecutorByName(toolName: string) {
  const tool = ALL_TOOLS.find(t => t.name === toolName);
  return tool
    ? categoryExecutor[toolName] ?? couponExecutor[toolName] ?? null
    : null;
}

export function getAllowedToolNames(role: string): ToolDefinition[] {
  const permissions: Record<string, ToolDefinition[]> = {
    ADMIN: ALL_TOOLS,
    MANAGER: ALL_TOOLS.filter((tool) =>
      ["create_coupon", "get_coupon_details", "get_sales_summary"].includes(tool.name)
    ),
    USER: ALL_TOOLS.filter((tool) =>
      ["get_coupon_details", "get_sales_summary"].includes(tool.name)
    ),
  };

  return permissions[role.toUpperCase()] || [];
}