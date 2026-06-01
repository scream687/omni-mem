#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { BrainEngine } from "./brain/engine.js";
const brain = new BrainEngine();
const server = new Server({
    name: "omni-mem",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
/**
 * Tool Definitions: The interface between the AI and its Prefrontal Cortex.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "learn",
                description: "Stores a new insight, action, or file change into the Neural Knowledge Graph. Use this whenever you finish a task or learn something new about the project.",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "A unique identifier for this memory (e.g. file path or task name)" },
                        type: { type: "string", enum: ["file", "concept", "bug", "action", "insight"] },
                        content: { type: "string", description: "The core content of the memory" },
                        metadata: { type: "object", description: "Extra context like related files or user preferences" },
                    },
                    required: ["id", "type", "content"],
                },
            },
            {
                name: "query_brain",
                description: "Queries the Neural Knowledge Graph for related concepts, files, and past actions. Use this to get deep context before starting a complex task.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "The concept or file to search for" },
                    },
                    required: ["query"],
                },
            },
            {
                name: "reflect",
                description: "Manually triggers the Meta-Cognitive Reflection cycle to distill recent logs into permanent Wisdom Rules.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});
/**
 * Tool Execution Logic
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "learn": {
                await brain.store(args);
                return {
                    content: [{ type: "text", text: `⚡ Omni-Mem: Memory "${args?.id}" successfully integrated into the graph.` }],
                };
            }
            case "query_brain": {
                const results = await brain.query(args?.query);
                return {
                    content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
                };
            }
            case "reflect": {
                await brain.reflect();
                return {
                    content: [{ type: "text", text: "⚡ Omni-Mem: Reflection cycle complete. Wisdom rules updated." }],
                };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `Error: ${error.message}` }],
            isError: true,
        };
    }
});
/**
 * Start the server using stdio transport.
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("⚡ Omni-Mem MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
