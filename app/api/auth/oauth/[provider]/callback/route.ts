import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createUserSession } from '@/lib/auth/user';
import {
  exchangeCodeForToken,
  fetchOAuthProfile,
  getAppBaseUrl,
  isOAuthProvider,
} from '@/lib/auth/oauth';
import { db } from '@/lib/db/client';
import { ApiError } from '@/lib/errors';

const STATE_COOKIE = 'oauth_state';
const RETURN_TO_COOKIE = 'oauth_return_to';

interface Params {
  params: Promise<{ provider: string }>;
}

export async function GET(request: Request, { params }: Params) {
  const baseUrl = getAppBaseUrl(request.url);
  try {
    const { provider } = await params;
    if (!isOAuthProvider(provider)) {
      throw new ApiError(404, 'PROVIDER_NOT_FOUND', 'Unsupported OAuth provider');
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const oauthError = url.searchParams.get('error');

    if (oauthError) {
      throw new ApiError(401, 'OAUTH_FAILED', `${provider} login failed: ${oauthError}`);
    }
    if (!code || !state) {
      throw new ApiError(400, 'INVALID_OAUTH_CALLBACK', 'Missing OAuth callback parameters');
    }

    const cookieStore = await cookies();
    const expectedState = cookieStore.get(STATE_COOKIE)?.value;
    const returnTo = cookieStore.get(RETURN_TO_COOKIE)?.value || '/';
    cookieStore.delete(STATE_COOKIE);
    cookieStore.delete(RETURN_TO_COOKIE);

    if (!expectedState || expectedState !== state) {
      throw new ApiError(400, 'INVALID_OAUTH_STATE', 'OAuth state validation failed');
    }

    const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback`;
    const tokenData = await exchangeCodeForToken({ provider, code, callbackUrl });
    const profile = await fetchOAuthProfile({
      provider,
      accessToken: tokenData.access_token,
      idToken: tokenData.id_token,
    });

    const existing = await db.user.findUnique({
      where: { email: profile.email },
      select: { id: true, email: true, role: true, deletedAt: true },
    });

    let userId: string;
    let userEmail: string;
    let userRole: 'ADMIN' | 'EDITOR';

    if (existing && !existing.deletedAt) {
      userId = existing.id;
      userEmail = existing.email;
      userRole = existing.role;
    } else {
      const created = await db.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          role: 'EDITOR',
        },
      });
      userId = created.id;
      userEmail = created.email;
      userRole = created.role;
    }

    await createUserSession({ sub: userId, email: userEmail, role: userRole });
    return NextResponse.redirect(new URL(returnTo, baseUrl));
  } catch (error) {
    const fallback = new URL('/login', baseUrl);
    if (error instanceof ApiError) {
      fallback.searchParams.set('error', error.message);
    } else {
      fallback.searchParams.set('error', 'Social login failed');
    }
    return NextResponse.redirect(fallback);
  }
}
