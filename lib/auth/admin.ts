import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { env } from '@/lib/env';

const COOKIE_NAME = 'admin_session';
const encoder = new TextEncoder();

type AdminPayload = {
  sub: string;
  role: 'ADMIN';
  email: string;
};

export async function createAdminSession(email: string) {
  console.log('Creating admin session for email:', email);
  const token = await new SignJWT({ role: 'ADMIN', email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(encoder.encode(env.ADMIN_JWT_SECRET));

  console.log('Admin session token:', token);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}


export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, encoder.encode(env.ADMIN_JWT_SECRET));

    if (payload.role !== 'ADMIN' || !payload.sub || !payload.email) {
      return null;
    }

    return {
      sub: payload.sub,
      role: 'ADMIN',
      email: String(payload.email),
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}
