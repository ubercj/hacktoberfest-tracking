import { writable } from 'svelte/store'
import type { User } from '../utils/types'

function createUser() {
  const { subscribe, set } = writable({})

  return {
    subscribe,
    set: (u: User) => {
      set(u)
    },
    clear: () => {
      set({})
    },
  }
}

export const currentUser = createUser()
