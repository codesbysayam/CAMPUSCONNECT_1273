export type UserRole = 'student' | 'organizer'

export interface AppUser {
  id: string
  name: string
  role: UserRole
}

export const users: AppUser[] = [
  { id: 'stu-1', name: 'Aditi Rao', role: 'student' },
  { id: 'org-1', name: 'Rohan Verma', role: 'organizer' },
]

export function getUserById(id: string): AppUser | undefined {
  return users.find((user) => user.id === id)
}
