type User = {
  id: string
  username: string
  avatar_url?: string
  website?: string
  shirt_size?: ShirtSize
  pull_requests?: number
}

type ShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

export const mockUsers: User[] = [
  {
    id: '12345',
    username: 'Test User 1',
    avatar_url: '',
    website: '',
    shirt_size: 'L',
    pull_requests: 2,
  },
  {
    id: '23456',
    username: 'Test User 2',
    avatar_url: '',
    website: '',
    shirt_size: 'XXL',
    pull_requests: 10,
  },
  {
    id: '34567',
    username: 'Test User 3',
    avatar_url: '',
    website: '',
    shirt_size: 'XS',
    pull_requests: 0,
  },
]
