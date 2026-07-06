import path from "node:path";

export interface StackTraceInfo {
  file: string;
  function: string;
  line: number;
  column: number;
}

export const parseStackTrace = (
  stack?: string
): StackTraceInfo | null => {
  if (!stack) return null;

  const lines = stack.split("\n").slice(1);

  for (const line of lines) {
    /**
     * Example:
     * at getUser (/Users/karan/project/src/controllers/user.controller.ts:42:17)
     *
     * Example:
     * at /Users/karan/project/src/controllers/user.controller.ts:42:17
     */

    const match =
      line.match(/\s*at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/) ||
      line.match(/\s*at\s+(.*):(\d+):(\d+)/);

    if (!match) continue;

    if (match.length === 5) {
      return {
        function: match[1],
        file: path.basename(match[2]),
        line: Number(match[3]),
        column: Number(match[4]),
      };
    }

    return {
      function: "anonymous",
      file: path.basename(match[1]),
      line: Number(match[2]),
      column: Number(match[3]),
    };
  }

  return null;
};