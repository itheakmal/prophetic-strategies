import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Log the submission
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    });

    // Send email notification if RESEND_API_KEY is configured
    if (resend) {
      try {
        // Send notification email to admin
        await resend.emails.send({
          from: 'Divine Prophetic Strategies <noreply@divinepropheticstrategies.com>',
          to: [process.env.ADMIN_EMAIL || 'admin@divinepropheticstrategies.com'],
          subject: `New Contact Form Submission: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d97706;">New Contact Form Submission</h2>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <p><strong>Message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                This message was sent from the Divine Prophetic Strategies contact form.
              </p>
            </div>
          `,
        });

        // Send auto-reply to user
        await resend.emails.send({
          from: 'Divine Prophetic Strategies <noreply@divinepropheticstrategies.com>',
          to: [email],
          subject: 'Thank you for contacting Divine Prophetic Strategies',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #d97706;">Thank you for your message!</h2>
              <p>Dear ${name},</p>
              <p>Thank you for reaching out to Divine Prophetic Strategies. We have received your message regarding "${subject}" and will get back to you within 24-48 hours.</p>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Your message:</strong></p>
                <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              <p>Best regards,<br>The Divine Prophetic Strategies Team</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              <p style="color: #6b7280; font-size: 12px;">
                This is an automated response. Please do not reply to this email.
              </p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // Continue execution even if email fails
      }
    }

    return NextResponse.json(
      { 
        message: 'Thank you for your message! We will get back to you soon.',
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
