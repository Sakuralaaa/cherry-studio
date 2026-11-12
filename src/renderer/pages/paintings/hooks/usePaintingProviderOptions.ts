import { useMemo } from 'react'

import { useModels } from '@renderer/hooks/useModel'
import { useProviders } from '@renderer/hooks/useProvider'
import type { Model } from '@shared/data/types/model'
import type { Provider } from '@shared/data/types/provider'

import { isAvailablePaintingModel } from '../model/utils/paintingModelOptions'

/**
 * Derive enabled providers that own at least one available painting model,
 * sorted for a stable UI. Exported for unit testing.
 *
 * Provider enablement is fully capability-derived now — any provider whose
 * v2 models carry `image-generation` capability (or an OpenAI image endpoint)
 * appears automatically. Providers with no enabled image-gen model don't
 * appear at all; the empty-dropdown state is the expected UX (users add the
 * model in Manage Models first).
 */
export function buildPaintingProviderOptions(input: {
  models: readonly Model[]
  providers: readonly Pick<Provider, 'id' | 'isEnabled'>[]
}): string[] {
  const enabledProviderIds = new Set(
    input.providers.filter((provider) => provider.isEnabled).map((provider) => provider.id)
  )
  const capabilityProviderIds = new Set<string>()
  for (const model of input.models) {
    if (enabledProviderIds.has(model.providerId) && isAvailablePaintingModel(model)) {
      capabilityProviderIds.add(model.providerId)
    }
  }

  return [...capabilityProviderIds].sort()
}

export function usePaintingProviderOptions(): string[] {
  const { providers: allProviders } = useProviders()
  const { models } = useModels()

  return useMemo(() => buildPaintingProviderOptions({ providers: allProviders, models }), [allProviders, models])
}
