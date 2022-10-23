import { setupWorker } from 'msw'
import { profileHandlers, groupHandlers, avatarHandlers } from './handlers'

const reqHandlers = [profileHandlers, groupHandlers, avatarHandlers].flat()

export const worker = setupWorker(...reqHandlers)
