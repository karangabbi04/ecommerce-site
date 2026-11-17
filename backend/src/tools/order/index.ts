import type { ToolDefinition } from "../interface.js";
import { OrderDefinitions } from "./order.tool.definition.js";
import { orderExecutor } from "./order.executor.js";

export const orderTools: ToolDefinition[] = OrderDefinitions.map((definition) => ({
  name: definition.name,
  description: definition.description,
  parameters: definition.parameters,
  executor: orderExecutor[definition.name],
}));
