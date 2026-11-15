import type { ToolDefinition } from "../interface.js";
import { CategoryDefinitions } from "./category.defination.js";
import { categoryExecutor } from "./category.executors.js";

export const categoryTools: ToolDefinition[] = CategoryDefinitions.map((definition) => ({
  name: definition.name,
  description: definition.description,
  parameters: definition.parameters,
  executor: categoryExecutor[definition.name],
}));
