import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendVerificationEmail(email: string, code: string) {
  try {
    console.log('Sending verification email to:', email);
    console.log('From:', process.env.SENDGRID_FROM_EMAIL);
    console.log('Code:', code);

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@chartsnap.ai',
      subject: 'ChartSnap AI - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Welcome to ChartSnap AI</h2>
          <p>Thank you for signing up! Please verify your email address to start analyzing charts.</p>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;">Your verification code is:</p>
            <p style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 4px; margin: 0;">${code}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">This code will expire in 15 minutes.</p>
          <p style="color: #6b7280; font-size: 14px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    };

    const result = await sgMail.send(msg);
    console.log('Email sent successfully:', result);
    return true;
  } catch (error: any) {
    console.error('SendGrid error details:', error?.response?.body || error);
    console.error('Full error:', error);
    return false;
  }
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
