import bcrypt from 'bcryptjs'

export type UserRole = 'student' | 'organizer'

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  passwordHash: string
  department?: string
  avatarInitials?: string
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

// Pre-computed bcrypt hashes (cost 10):
// student123: $2b$10$aCgbUayc.tPO6N.g0YKsguSW6B4O54kVsETAOTTi25m078RdRTKwS
// organizer123: $2b$10$6L9t8s8Aas7b.ID9JVX02.IZPKLSk4CcNj43OdHsFyqngh7tyPNry

export const users: AppUser[] = [
  {
    id: 'stu-1',
    name: 'Aditi Rao',
    role: 'student',
    email: 'aditi.rao@campus.edu',
    passwordHash: '$2b$10$aCgbUayc.tPO6N.g0YKsguSW6B4O54kVsETAOTTi25m078RdRTKwS',
    department: 'Computer Science & Engineering',
    avatarInitials: 'AR',
  },
  {
    id: 'stu-2',
    name: 'Rahul Sharma',
    role: 'student',
    email: 'rahul.sharma@campus.edu',
    passwordHash: '$2b$10$aCgbUayc.tPO6N.g0YKsguSW6B4O54kVsETAOTTi25m078RdRTKwS',
    department: 'Electronics & Communication',
    avatarInitials: 'RS',
  },
  {
    id: 'org-1',
    name: 'Rohan Verma',
    role: 'organizer',
    email: 'rohan.verma@campus.edu',
    passwordHash: '$2b$10$6L9t8s8Aas7b.ID9JVX02.IZPKLSk4CcNj43OdHsFyqngh7tyPNry',
    department: 'ACM Student Chapter & Tech Society',
    avatarInitials: 'RV',
  },
  {
    id: 'org-2',
    name: 'Priya Sen',
    role: 'organizer',
    email: 'priya.sen@campus.edu',
    passwordHash: '$2b$10$6L9t8s8Aas7b.ID9JVX02.IZPKLSk4CcNj43OdHsFyqngh7tyPNry',
    department: 'Cultural Affairs Committee',
    avatarInitials: 'PS',
  },
]

export function getUserById(id: string): AppUser | undefined {
  return users.find((user) => user.id === id)
}

export function findUserByEmail(email: string): AppUser | undefined {
  const normalized = normalizeEmail(email)
  return users.find((user) => normalizeEmail(user.email) === normalized)
}

export function getUserByEmail(email: string): AppUser | undefined {
  return findUserByEmail(email)
}

export function createUser(userData: {
  id?: string
  name: string
  email: string
  role: UserRole
  password: string
  department?: string
}): AppUser {
  const normalized = normalizeEmail(userData.email)
  const existing = findUserByEmail(normalized)

  if (existing) {
    throw new Error('An account with this email already exists.')
  }

  const id = userData.id || `user-${Date.now()}`
  const passwordHash = bcrypt.hashSync(userData.password, 10)
  const initials = userData.name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const newUser: AppUser = {
    id,
    name: userData.name,
    email: normalized,
    role: userData.role,
    passwordHash,
    department: userData.department,
    avatarInitials: initials || 'CC',
  }

  users.push(newUser)
  return newUser
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash)
  } catch {
    return false
  }
}

export function validateCredentials(
  email: string,
  pass: string,
  expectedRole?: UserRole,
): { success: boolean; user?: AppUser; error?: string } {
  const normalized = normalizeEmail(email)
  const user = findUserByEmail(normalized)

  if (!user) {
    return {
      success: false,
      error: 'Invalid email or password.',
    }
  }

  const valid = verifyPassword(pass, user.passwordHash)
  if (!valid) {
    return {
      success: false,
      error: 'Invalid email or password.',
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
