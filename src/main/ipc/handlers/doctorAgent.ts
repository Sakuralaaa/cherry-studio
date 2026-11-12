import { doctorAgentRequestSchemas } from '@shared/ipc/schemas/doctorAgent'

import { removedFeatureHandlers } from './removedFeature'

export const doctorAgentHandlers = removedFeatureHandlers(doctorAgentRequestSchemas, 'Doctor agent')
