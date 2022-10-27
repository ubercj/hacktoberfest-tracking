import type { Profile, User, Group } from '../utils/types'

export const getMockProfiles = () => mockProfiles
export const getMockGroups = () => mockGroups

export const mockUser: User = {
  id: '12345',
  email: 'mockuser@test.dev',
}

const mockProfiles: Profile[] = [
  {
    username: 'Test User 1',
    avatar_url: '',
    website: '',
    shirt_size: 'L',
    pull_requests: 2,
  },
  {
    username: 'Test User 2',
    avatar_url: '',
    website: '',
    shirt_size: 'XXL',
    pull_requests: 10,
  },
  {
    username: 'Test User 3',
    avatar_url: '',
    website: '',
    shirt_size: 'XS',
    pull_requests: 0,
  },
]

const mockGroups: Group[] = [
  {
    id: 101,
    name: 'Test Group 1',
  },
  {
    id: 102,
    name: 'Test Group 2',
  },
  {
    id: 103,
    name: 'Test Group 3',
  },
]
