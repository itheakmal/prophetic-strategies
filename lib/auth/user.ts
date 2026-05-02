import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/env';

const COOKIE_NAME = 'user_session';
const encoder = new TextEncoder();

type UserPayload = {
  sub: string;
  email: string;
  role: 'ADMIN' | 'EDITOR';
};

export async function createUserSession(payload: UserPayload) {
  const token = await new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encoder.encode(env.ADMIN_JWT_SECRET));

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getUserSession(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encoder.encode(env.ADMIN_JWT_SECRET));
    if (!payload.sub || !payload.email || !payload.role) return null;

    return {
      sub: String(payload.sub),
      email: String(payload.email),
      role: payload.role === 'ADMIN' ? 'ADMIN' : 'EDITOR',
    };
  } catch {
    return null;
  }
}

/** Use in routes: returns session or unified UNAUTHORIZED throw handled like admin routes. */
export async function requireUserSession(): Promise<UserPayload> {
  const session = await getUserSession();
  if (!session) {
    throw new Error('UNAUTHORIZED_USER');
  }
  return session;
}
