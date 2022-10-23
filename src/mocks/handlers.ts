import { rest } from 'msw'
import { getMockProfiles, getMockGroups } from './mockData'

// Get mutable copies of seed data
let mockProfiles = getMockProfiles()
let mockGroups = getMockGroups()

export const authHandlers = [
  rest.post(
    `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/logout`,
    (req, res, ctx) => {
      return res(ctx.status(200))
    }
  ),
]

export const profileHandlers = [
  rest.get(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`,
    (req, res, ctx) => {
      // Return only one user profile for Account page
      if (req.url.searchParams.get('id')) {
        return res(ctx.json(mockProfiles[0]))
      }
      return res(ctx.json(mockProfiles))
    }
  ),
  rest.post(
    `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles`,
    (req, res, ctx) => {
      mockProfiles[0] = req.body

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
