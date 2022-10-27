export type User = {
  id: string
  email?: string
}

export type Profile = {
  username: string
  avatar_url?: string
  website?: string
  shirt_size?: ShirtSize
  pull_requests?: number
}

type ShirtSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'

export type Group = {
  id: number
  name: string
  admin_id?: string
}
