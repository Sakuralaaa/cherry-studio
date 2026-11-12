import { channelRequestSchemas } from '@shared/ipc/schemas/channel'

import { removedFeatureHandlers } from './removedFeature'

export const channelHandlers = removedFeatureHandlers(channelRequestSchemas, 'Agent channels')
