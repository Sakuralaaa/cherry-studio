export type AccessibilityStatus =
  | 'available'
  | 'selector_not_found'
  | 'debugger_unavailable'
  | 'timeout'
  | 'capture_failed'
  | 'budget_exceeded'

export type AccessibilityStateName =
  | 'disabled'
  | 'expanded'
  | 'checked'
  | 'pressed'
  | 'selected'
  | 'required'
  | 'invalid'
  | 'readonly'

export interface AccessibilityState {
  name: AccessibilityStateName
  value: boolean | string
}

export interface AccessibleNodeSummary {
  role: string
  name: string | null
  description: string | null
  states: AccessibilityState[]
}

export interface AccessibleNode extends AccessibleNodeSummary {
  children: AccessibleNode[]
}

export interface AccessibilityContext {
  status: AccessibilityStatus
  path: AccessibleNodeSummary[]
  tree: AccessibleNode | null
  truncated: boolean
}

export interface AccessibilityCaptureBudget {
  remaining: number
}

export interface CdpValue {
  value?: unknown
}

export interface CdpAccessibilityProperty {
  name: string
  value?: CdpValue
}

export interface CdpAccessibilityNode {
  nodeId: string
  ignored: boolean
  role?: CdpValue
  name?: CdpValue
  value?: CdpValue
  description?: CdpValue
  properties?: CdpAccessibilityProperty[]
  parentId?: string
  childIds?: string[]
  backendDOMNodeId?: number
  frameId?: string
}

export const ANNOTATION_EXPORT_LIMITS = {
  accessibilityDepth: 5,
  accessibilityNodes: 80,
  accessibilityPath: 12,
  accessibilityRequestNodes: 400,
  accessibilityStates: 8,
  accessibilityText: 240,
  pageTitle: 240,
  pageUrl: 2_048
} as const

export const createAccessibilityContext = (
  status: AccessibilityStatus,
  options: Partial<Pick<AccessibilityContext, 'path' | 'tree' | 'truncated'>> = {}
): AccessibilityContext => ({
  status,
  path: options.path ?? [],
  tree: options.tree ?? null,
  truncated: options.truncated ?? false
})
