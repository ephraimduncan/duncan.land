import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth as betterAuth } from './auth'
import type { Session, User } from './auth'

export type AuthState =
  | { user: User; session: Session }
  | { user: null; session: null }

export const getSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthState> => {
    const headers = getRequestHeaders()
    const authState = await betterAuth.api.getSession({ headers })

    if (!authState) {
      return { user: null, session: null }
    }

    return {
      user: authState.user,
      session: authState.session,
    }
  },
)
