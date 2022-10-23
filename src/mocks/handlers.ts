import { rest } from 'msw'
import { mockUsers } from './mockUsers'
import { mockGroups } from './mockGroups'

export const profileHandlers = [
  rest.get(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`,
    (req, res, ctx) => {
      // Return only one user profile for Account page
      if (req.url.searchParams.get('id')) {
        return res(ctx.json(mockUsers[0]))
      }
      return res(ctx.json(mockUsers))
    }
  ),
  rest.post(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`,
    (req, res, ctx) => {
      console.log('POST request was intercepted')

      return res(ctx.status(200))
    }
  ),
]

export const groupHandlers = [
  rest.get(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/groups`,
    (req, res, ctx) => {
      return res(ctx.json(mockGroups))
    }
  ),
  rest.post(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/groups`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
  rest.post(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/group_profile`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
]

export const avatarHandlers = [
  rest.get(
    `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/avatars/*`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
]
