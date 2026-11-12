import { browserRequestSchemas } from '@shared/ipc/schemas/browser'

import { removedFeatureHandlers } from './removedFeature'

export const browserHandlers = removedFeatureHandlers(browserRequestSchemas, 'Built-in browser')
