export interface ToolParameter {
  type: string;
  description: string;
  enum?: string[];
  format?: string;
  items?: {
    type: string;
    format?: string;
  };
}

// TypeScript Interface for Tool Definition
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, ToolParameter>;
    required: string[];
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export interface ToolResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: string;
}