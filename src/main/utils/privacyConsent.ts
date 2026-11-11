/**
 * Whether the user consented to data collection **under the current policy**.
 * Every uploader (analytics, crash reporting) must gate on this one predicate so
 * a policy bump revokes them all together.
 *
 * Lite fork: telemetry and crash reporting are permanently disabled.
 */
export function isDataCollectionConsented(_enabled: boolean, _policyVersion: string): boolean {
  return false
}
