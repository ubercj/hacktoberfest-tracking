type Group = {
  id: number
  name: string
  admin_id?: string
}

export const mockGroups: Group[] = [
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
