import type { RouteDef } from '@shared/ipc/define'
import type { IpcHandlersFor } from '@shared/ipc/types'

/**
 * Cherry Studio Lite keeps the shared IPC contract of removed features (agents, API gateway,
 * built-in browser, computer use, channels, Doctor agent) so the renderer contract is unchanged,
 * but every route of such a domain rejects.
 */
export function removedFeatureHandlers<S extends Record<string, RouteDef>>(schemas: S, feature: string): IpcHandlersFor<S> {
  const reject = async (): Promise<never> => {
    throw new Error(`${feature} is not available in Cherry Studio Lite`)
  }
  return Object.fromEntries(Object.keys(schemas).map((route) => [route, reject])) as unknown as IpcHandlersFor<S>
}
