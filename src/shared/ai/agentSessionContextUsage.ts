// Context-usage contract formerly imported from @cherrystudio/agent-runtime (removed in Cherry Studio Lite).
export interface RuntimeError {
  readonly operation: string
  readonly code: string
  readonly message: string
}
export type OperationResult<T> =
  | { readonly status: 'confirmed'; readonly value: T }
  | { readonly status: 'rejected' | 'unsupported' | 'unknown'; readonly error: RuntimeError }
export type ContextCategoryKey =
  | 'messages'
  | 'system-prompt'
  | 'system-tools'
  | 'mcp-tools'
  | 'mcp-instructions'
  | 'memory-files'
  | 'skills'
  | 'agents'
  | 'other'
export interface ContextTokenCount {
  readonly tokens: number
  readonly precision: 'reported' | 'estimated'
}
export interface ContextCategory extends ContextTokenCount {
  readonly id: string
  readonly key: ContextCategoryKey
  readonly label?: string
  readonly occupancy: 'included' | 'deferred'
}
export interface ContextResource {
  readonly id: string
  readonly category: ContextCategoryKey
  readonly name: string
  readonly source?: string
  readonly count?: ContextTokenCount
  readonly state?: 'loaded' | 'deferred'
}
export interface ThreadContextUsage {
  readonly model: string
  readonly revision: string
  readonly contextWindow: number
  readonly used?: ContextTokenCount
  readonly basis: 'current-context' | 'last-request'
  readonly reserved?: ContextTokenCount
  readonly free?: ContextTokenCount
  readonly breakdown?: { readonly coverage: 'partial' | 'complete'; readonly categories: readonly ContextCategory[] }
  readonly resources?: readonly ContextResource[]
}

/** Product model association for a harness-owned context reading. */
export interface AgentSessionContextUsage {
  readonly modelId?: string
  readonly result: OperationResult<ThreadContextUsage>
}

export const AGENT_SESSION_CONTEXT_USAGE_CACHE_KEY = (sessionId: string) =>
  `agent.session.context_usage.${sessionId}` as const
