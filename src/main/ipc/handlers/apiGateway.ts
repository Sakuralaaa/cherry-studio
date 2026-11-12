import { apiGatewayRequestSchemas } from '@shared/ipc/schemas/apiGateway'

import { removedFeatureHandlers } from './removedFeature'

export const apiGatewayHandlers = removedFeatureHandlers(apiGatewayRequestSchemas, 'API gateway')
