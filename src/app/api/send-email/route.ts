import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    console.log('Email API route hit:', new Date().toISOString());

    const { to, from, subject, message } = await request.json();
    console.log('Received email data:', { to, from, subject });

    // Validate required fields
    if (!to || !from || !subject || !message) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'All fields are required: to, from, subject, message' },
        { status: 400 }
      );
    }

    // Create HTML content
    const htmlContent = `
      <h2>Email from Outlook App</h2>
      <p><strong>From:</strong> ${from}</p>
      <p><strong>To:</strong> ${to}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <div style="white-space: pre-wrap; margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
        ${message}
      </div>
    `;

    // Create transporter with hardcoded Zoho settings
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL, // replace with your actual Zoho email
        pass: process.env.APP_PASSWORD, // replace with your actual Zoho app password
      },
    });

    // Configure mail options
    const mailOptions = {
      from: process.env.EMAIL, // must use the authenticated email
      to: to,
      replyTo: from, // set the sender's email as reply-to
      subject: subject,
      text: message,
      html: htmlContent,
    };

    console.log('Sending email with transporter');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Email sending error:', error);

    return NextResponse.json(
      {
        error: 'Failed to send email',
        details: (error as Error).message || 'Unknown error',
        pass: process.env.APP_PASSWORD,
        email: process.env.EMAIL,
      },
      { status: 500 }
    );
  }
}
