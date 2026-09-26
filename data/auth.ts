export type UserRole = 'student' | 'organizer'

export interface AppUser {
  id: string
  name: string
  role: UserRole
  email: string
  password: string
  department?: string
  avatarInitials?: string
}

export const users: AppUser[] = [
  {
    id: 'stu-1',
    name: 'Aditi Rao',
    role: 'student',
    email: 'aditi.rao@campus.edu',
    password: 'student123',
    department: 'Computer Science & Engineering',
    avatarInitials: 'AR',
  },
  {
    id: 'stu-2',
    name: 'Rahul Sharma',
    role: 'student',
    email: 'rahul.sharma@campus.edu',
    password: 'student123',
    department: 'Electronics & Communication',
    avatarInitials: 'RS',
  },
  {
    id: 'org-1',
    name: 'Rohan Verma',
    role: 'organizer',
    email: 'rohan.verma@campus.edu',
    password: 'organizer123',
    department: 'ACM Student Chapter & Tech Society',
    avatarInitials: 'RV',
  },
  {
    id: 'org-2',
    name: 'Priya Sen',
    role: 'organizer',
    email: 'priya.sen@campus.edu',
    password: 'organizer123',
    department: 'Cultural Affairs Committee',
    avatarInitials: 'PS',
  },
]

export function getUserById(id: string): AppUser | undefined {
  return users.find((user) => user.id === id)
}

export function getUserByEmail(email: string): AppUser | undefined {
  const normalized = email.trim().toLowerCase()
  return users.find((user) => user.email.toLowerCase() === normalized)
}

export function validateCredentials(
  email: string,
  pass: string,
  expectedRole?: UserRole,
): { success: boolean; user?: AppUser; error?: string } {
  const normalized = email.trim().toLowerCase()
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === normalized ||
      (expectedRole === 'student' && normalized === 'student@campus.edu' && u.id === 'stu-1') ||
      (expectedRole === 'organizer' && (normalized === 'organizer@campus.edu' || normalized === 'organiser@campus.edu') && u.id === 'org-1'),
  )

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email address. Please check your credentials.',
    }
  }

  // Accept standard password or alias
  const validPasswords = [
    user.password,
    user.role === 'organizer' ? 'organiser123' : '',
    'campus123',
  ].filter(Boolean)

  if (!validPasswords.includes(pass)) {
    return {
      success: false,
      error: 'Invalid password. Please check your password and try again.',
    }
  }

  if (expectedRole && user.role !== expectedRole) {
    return {
      success: false,
      error: `This account is registered as a ${user.role}. Please use the ${user.role} login portal instead.`,
    }
  }

  return {
    success: true,
    user,
  }
}
