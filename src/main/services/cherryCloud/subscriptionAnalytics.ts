import type { CherryCloudAnalyticsEvent } from '@shared/ipc/schemas/cherryCloud'

/** Lite edition: product analytics removed; the Cloud funnel event is dropped. */
export async function trackCherryCloudAnalyticsEvent(
  _payload: CherryCloudAnalyticsEvent,
  _expectedScopeId?: string | null
): Promise<void> {}
