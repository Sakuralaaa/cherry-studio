import type { AccessibilityContext } from './accessibility'
import type { WebviewAnnotation, WebviewAnnotationTarget } from '@shared/types/webviewAnnotation'

export type {
  AccessibilityContext,
  AccessibilityState,
  AccessibleNode,
  AccessibleNodeSummary
} from './accessibility'

export interface AnnotationPage {
  title: string
  url: string
}

export interface AnnotationDocument {
  target: WebviewAnnotationTarget
  page: AnnotationPage
  annotations: WebviewAnnotation[]
}

export interface ResolvedAnnotation extends WebviewAnnotation {
  accessibility: AccessibilityContext
}

export interface ResolvedAnnotationDocument extends Omit<AnnotationDocument, 'annotations'> {
  annotations: ResolvedAnnotation[]
}
