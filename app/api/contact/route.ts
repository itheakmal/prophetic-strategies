import { Resend } from 'resend';
import { db } from '@/lib/db/client';
import { env } from '@/lib/env';
import { ApiError, errorResponse, successResponse } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';
import { contactSubmissionSchema } from '@/lib/validation/contact';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSubmissionSchema.parse(body);

    if (parsed.website) {
      throw new ApiError(400, 'SPAM_DETECTED', 'Invalid submission');
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() ?? 'unknown';
    const userAgent = request.headers.get('user-agent') ?? undefined;

    const rate = checkRateLimit(`contact:${ip}`, env.RATE_LIMIT_MAX_REQUESTS, env.RATE_LIMIT_WINDOW_MS);
    if (!rate.allowed) {
      throw new ApiError(429, 'RATE_LIMITED', 'Too many requests. Please try again later.');
    }

    const submission = await db.contactSubmission.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        subject: parsed.subject,
        message: parsed.message,
        sourceIp: ip,
        userAgent,
      },
    });

    if (resend) {
      const safeName = escapeHtml(parsed.name);
      const safeEmail = escapeHtml(parsed.email);
      const safeSubject = escapeHtml(parsed.subject);
      const safeMessage = escapeHtml(parsed.message).replace(/\n/g, '<br>');

      await resend.emails.send({
        from: 'Divine Prophetic Strategies <noreply@divinepropheticstrategies.com>',
        to: [env.ADMIN_EMAIL],
        subject: `New contact form submission: ${parsed.subject}`,
        html: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Subject:</strong> ${safeSubject}</p><p><strong>Message:</strong><br>${safeMessage}</p>`,
      });

      await resend.emails.send({
        from: 'Divine Prophetic Strategies <noreply@divinepropheticstrategies.com>',
        to: [parsed.email],
        subject: 'Thanks for contacting Divine Prophetic Strategies',
        html: `<p>Dear ${safeName},</p><p>Thanks for your message about \"${safeSubject}\". We will respond shortly.</p>`,
      });

      await db.contactSubmission.update({
        where: { id: submission.id },
        data: { emailSentAt: new Date() },
      });
    }

    return successResponse({
      id: submission.id,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  } catch (error) {
    logger.error({ error }, 'Contact submission failed');
    return errorResponse(error);
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
}
