import { setupWorker } from 'msw'
import {
  authHandlers,
  profileHandlers,
  groupHandlers,
  avatarHandlers,
} from './handlers'

const reqHandlers = [
  authHandlers,
  profileHandlers,
  groupHandlers,
  avatarHandlers,
].flat()

export const worker = setupWorker(...reqHandlers)
