import { computerUseRequestSchemas } from '@shared/ipc/schemas/computerUse'

import { removedFeatureHandlers } from './removedFeature'

export const computerUseHandlers = removedFeatureHandlers(computerUseRequestSchemas, 'Computer use')
