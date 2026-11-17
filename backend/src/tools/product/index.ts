import type { ToolDefinition } from "../interface.js";
import { ProductDefinitions } from "./product.tool.defination.js";
import { productExecutor } from "./product.executor.js";

export const productTools: ToolDefinition[] = ProductDefinitions.map((definition) => ({
  name: definition.name,
  description: definition.description,
  parameters: definition.parameters,
  executor: productExecutor[definition.name],
}));
