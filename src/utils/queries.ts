import { supabase } from '../supabaseClient'
import type { Profile } from './types'

export const getUserProfile = async (userId: string) => {
  return await supabase
    .from('profiles')
    .select('username, website, avatar_url, shirt_size, pull_requests')
    .eq('id', userId)
    .single()
}

export const updateUserProfile = async (userId: string, updates: Profile) => {
  return await supabase
    .from('profiles')
    .upsert({ id: userId, updated_at: new Date().toISOString(), ...updates })
}

export const getGroups = async (userId: string) => {
  return await supabase
    .from('groups')
    .select(
      `
          id,
          name,
          group_profile!inner (
            id
          )
        `
    )
    .eq('group_profile.profile_id', userId)
}

export const getProfilesForGroup = async (groupId: number) => {
  return await supabase
    .from('profiles')
    .select(
      `
          id,
          username,
           website,
           avatar_url,
           shirt_size,
           pull_requests,
           group_profile!inner (
            id,
            group_id
            )
          `
    )
    .eq('group_profile.group_id', groupId)
}
