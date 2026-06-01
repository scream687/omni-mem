export interface Node {
    id: string;
    type: 'file' | 'concept' | 'bug' | 'action' | 'insight';
    content: string;
    metadata: Record<string, any>;
}
export declare class BrainEngine {
    /**
     * Stores a new memory node and automatically attempts to link it to existing context.
     */
    store(node: Node): Promise<void>;
    /**
     * Neural Graph Auto-Linking
     * In a God-Tier implementation, this would use semantic similarity.
     * For V1, we use metadata co-occurrence and explicit references.
     */
    private autolink;
    link(source: string, target: string, relation: string): void;
    /**
     * The "Prefrontal Cortex" retrieval logic.
     * Instead of just keywords, it traverses the graph.
     */
    query(concept: string): Promise<{
        matches: any[];
        related: {}[];
    }>;
    /**
     * The Sleep Cycle: Meta-Cognitive Reflection
     * Distills session logs into permanent Wisdom Rules.
     */
    reflect(): Promise<void>;
}
//# sourceMappingURL=engine.d.ts.map