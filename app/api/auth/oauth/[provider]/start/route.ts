import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { buildOAuthStartUrl, createOAuthState, getAppBaseUrl, isOAuthProvider } from '@/lib/auth/oauth';
import { errorResponse } from '@/lib/errors';

const STATE_COOKIE = 'oauth_state';
const RETURN_TO_COOKIE = 'oauth_return_to';

interface Params {
  params: Promise<{ provider: string }>;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { provider } = await params;
    if (!isOAuthProvider(provider)) {
      return NextResponse.redirect(new URL('/login?error=Unsupported+OAuth+provider', request.url));
    }

    const requestUrl = new URL(request.url);
    const returnTo = requestUrl.searchParams.get('returnTo') || '/';
    const baseUrl = getAppBaseUrl(request.url);
    const callbackUrl = `${baseUrl}/api/auth/oauth/${provider}/callback`;
    const state = createOAuthState();
    const authUrl = buildOAuthStartUrl(provider, callbackUrl, state);

    if (!authUrl) {
      const fallback = new URL('/login', baseUrl);
      fallback.searchParams.set('returnTo', returnTo);
      fallback.searchParams.set('error', `${provider} login is not configured`);
      return NextResponse.redirect(fallback);
    }

    const cookieStore = await cookies();
    cookieStore.set(STATE_COOKIE, state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 600,
    });
    cookieStore.set(RETURN_TO_COOKIE, returnTo, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 600,
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    return errorResponse(error);
  }
}
