import { lazy, type ReactNode } from 'react'

import type { Provider } from '@shared/data/types/provider'
import { isAwsBedrockProvider, isVertexProvider, matchesPreset } from '@shared/utils/provider'

import type { useProviderMeta } from '../hooks/providerSetting/useProviderMeta'

const AwsBedrockSettings = lazy(() => import('./AwsBedrockSettings'))
const VertexAiSettings = lazy(() => import('./VertexAiSettings'))
const DoubaoSetupGuide = lazy(() => import('./DoubaoSetupGuide'))

export type ProviderSpecificPlacement = 'beforeAuth' | 'afterAuth'

export type ProviderSpecificContext = {
  provider: Provider
  meta: ReturnType<typeof useProviderMeta>
}

export type ProviderSpecificRegistryEntry = {
  key: string
  when: (context: ProviderSpecificContext) => boolean
  render: (providerId: string) => ReactNode
}

export const PROVIDER_SPECIFIC_SETTINGS_REGISTRY: Record<ProviderSpecificPlacement, ProviderSpecificRegistryEntry[]> = {
  beforeAuth: [
    {
      key: 'doubao-setup-guide',
      when: ({ provider }) => matchesPreset(provider, 'doubao'),
      render: (providerId) => <DoubaoSetupGuide providerId={providerId} />
    }
  ],
  afterAuth: [
    {
      key: 'aws-bedrock-settings',
      when: ({ provider }) => isAwsBedrockProvider(provider),
      render: (providerId) => <AwsBedrockSettings providerId={providerId} />
    },
    {
      key: 'vertexai-settings',
      when: ({ provider }) => isVertexProvider(provider),
      render: (providerId) => <VertexAiSettings providerId={providerId} />
    }
  ]
}
