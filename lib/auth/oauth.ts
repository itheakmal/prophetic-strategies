import { randomBytes } from 'node:crypto';
import { env } from '@/lib/env';

export type OAuthProvider = 'google' | 'facebook' | 'apple';

type ProviderConfig = {
  clientId: string;
  clientSecret: string;
  authorizeUrl: string;
  tokenUrl: string;
  scopes: string[];
};

function getProviderConfig(provider: OAuthProvider): ProviderConfig | null {
  if (provider === 'google') {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return null;
    return {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: ['openid', 'email', 'profile'],
    };
  }

  if (provider === 'facebook') {
    if (!env.FACEBOOK_CLIENT_ID || !env.FACEBOOK_CLIENT_SECRET) return null;
    return {
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      authorizeUrl: 'https://www.facebook.com/v21.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v21.0/oauth/access_token',
      scopes: ['email', 'public_profile'],
    };
  }

  if (!env.APPLE_CLIENT_ID || !env.APPLE_CLIENT_SECRET) return null;
  return {
    clientId: env.APPLE_CLIENT_ID,
    clientSecret: env.APPLE_CLIENT_SECRET,
    authorizeUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scopes: ['name', 'email'],
  };
}

export function isOAuthProvider(value: string): value is OAuthProvider {
  return value === 'google' || value === 'facebook' || value === 'apple';
}

export function createOAuthState() {
  return randomBytes(24).toString('hex');
}

export function getAppBaseUrl(requestUrl: string) {
  if (env.APP_BASE_URL) return env.APP_BASE_URL;
  return new URL(requestUrl).origin;
}

export function buildOAuthStartUrl(
  provider: OAuthProvider,
  callbackUrl: string,
  state: string
) {
  const config = getProviderConfig(provider);
  if (!config) return null;

  const url = new URL(config.authorizeUrl);
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('redirect_uri', callbackUrl);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', config.scopes.join(' '));
  url.searchParams.set('state', state);

  if (provider === 'google') {
    url.searchParams.set('access_type', 'offline');
    url.searchParams.set('prompt', 'consent');
  }

  if (provider === 'apple') {
    url.searchParams.set('response_mode', 'query');
  }

  return url.toString();
}

export async function exchangeCodeForToken(params: {
  provider: OAuthProvider;
  code: string;
  callbackUrl: string;
}) {
  const config = getProviderConfig(params.provider);
  if (!config) {
    throw new Error(`${params.provider.toUpperCase()} OAuth is not configured`);
  }

  const form = new URLSearchParams();
  form.set('client_id', config.clientId);
  form.set('client_secret', config.clientSecret);
  form.set('code', params.code);
  form.set('redirect_uri', params.callbackUrl);
  form.set('grant_type', 'authorization_code');

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Token exchange failed: ${payload}`);
  }

  return (await response.json()) as {
    access_token?: string;
    id_token?: string;
  };
}

function decodeJwtPayload(token: string) {
  const parts = token.split('.');
  if (parts.length < 2) return null;
  const payload = parts[1];
  if (!payload) return null;
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const decoded = Buffer.from(padded, 'base64').toString('utf8');
  return JSON.parse(decoded) as Record<string, unknown>;
}

export async function fetchOAuthProfile(params: {
  provider: OAuthProvider;
  accessToken?: string;
  idToken?: string;
}) {
  if (params.provider === 'google') {
    if (!params.accessToken) throw new Error('Missing Google access token');
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${params.accessToken}` },
    });
    if (!response.ok) {
      throw new Error('Failed to load Google profile');
    }
    const profile = (await response.json()) as {
      sub?: string;
      email?: string;
      name?: string;
    };
    if (!profile.email || !profile.sub) {
      throw new Error('Google profile is missing required fields');
    }
    return {
      email: profile.email.toLowerCase(),
      name: profile.name ?? null,
      providerUserId: profile.sub,
    };
  }

  if (params.provider === 'facebook') {
    if (!params.accessToken) throw new Error('Missing Facebook access token');
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${encodeURIComponent(params.accessToken)}`
    );
    if (!response.ok) {
      throw new Error('Failed to load Facebook profile');
    }
    const profile = (await response.json()) as {
      id?: string;
      email?: string;
      name?: string;
    };
    if (!profile.id || !profile.email) {
      throw new Error('Facebook profile is missing required fields');
    }
    return {
      email: profile.email.toLowerCase(),
      name: profile.name ?? null,
      providerUserId: profile.id,
    };
  }

  if (!params.idToken) {
    throw new Error('Missing Apple id_token');
  }
  const payload = decodeJwtPayload(params.idToken);
  const sub = typeof payload?.sub === 'string' ? payload.sub : null;
  const email = typeof payload?.email === 'string' ? payload.email.toLowerCase() : null;
  const name = typeof payload?.name === 'string' ? payload.name : null;
  if (!sub || !email) {
    throw new Error('Apple profile is missing required fields');
  }
  return {
    email,
    name,
    providerUserId: sub,
  };
}
