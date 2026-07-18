"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseStackTrace = void 0;
const node_path_1 = __importDefault(require("node:path"));
const parseStackTrace = (stack) => {
    if (!stack)
        return null;
    const lines = stack.split("\n").slice(1);
    for (const line of lines) {
        /**
         * Example:
         * at getUser (/Users/karan/project/src/controllers/user.controller.ts:42:17)
         *
         * Example:
         * at /Users/karan/project/src/controllers/user.controller.ts:42:17
         */
        const match = line.match(/\s*at\s+(.*?)\s+\((.*):(\d+):(\d+)\)/) ||
            line.match(/\s*at\s+(.*):(\d+):(\d+)/);
        if (!match)
            continue;
        if (match.length === 5) {
            return {
                function: match[1],
                file: node_path_1.default.basename(match[2]),
                line: Number(match[3]),
                column: Number(match[4]),
            };
        }
        return {
            function: "anonymous",
            file: node_path_1.default.basename(match[1]),
            line: Number(match[2]),
            column: Number(match[3]),
        };
    }
    return null;
};
exports.parseStackTrace = parseStackTrace;
