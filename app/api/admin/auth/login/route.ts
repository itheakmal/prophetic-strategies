import { env } from '@/lib/env';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { createAdminSession } from '@/lib/auth/admin';

export async function POST(request: Request) {
  console.log('Admin login request received');
  try {
    // console.log('Admin login request body:', await request.json());
    const body = await request.json();
    const email = String(body?.email ?? '');
    const password = String(body?.password ?? '');

    console.log('Admin email:', email);
    console.log('Admin password:', password);
    console.log('Admin email from env:', env.ADMIN_EMAIL);
    console.log('Admin password from env:', env.ADMIN_PASSWORD);

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      console.log('Invalid credentials');
      throw new ApiError(
        401,
        'INVALID_CREDENTIALS',
        'Invalid email or password'
      );
    }
    console.log('Creating admin session');
    await createAdminSession(email);
    return successResponse({ email, role: 'ADMIN' });
  } catch (error) {
    return errorResponse(error);
  }
}
