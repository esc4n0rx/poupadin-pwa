// types/auth.ts

export interface AuthUser {
  id: string
  email: string
  name: string
  created_at?: string
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}

export interface SignUpCredentials {
  email: string
  password: string
  name: string
}

export interface SignInCredentials {
  email: string
  password: string
}