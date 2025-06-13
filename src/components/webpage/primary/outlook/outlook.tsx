'use client';

import React, { useState, useRef } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { SendHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export const OutlookApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { addToast } = useToast();

  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [subjectError, setSubjectError] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const toEmail = 'cai@czchen.dev';
  const fromEmailRef = useRef<HTMLInputElement>(null);

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSendEmail = async () => {
    // Get the from email
    const fromEmail = fromEmailRef.current?.value;

    // Validate all required fields
    if (!fromEmail) {
      setEmailError('Please provide your email address');
      return;
    }

    // Validate email format
    if (!emailRegex.test(fromEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Clear any previous errors
    setEmailError('');

    if (!subject.trim()) {
      setSubjectError('Please provide a subject for your email');
      return;
    }
    setSubjectError('');

    if (!message.trim()) {
      setMessageError('Please provide a message for your email');
      return;
    }
    setMessageError('');

    setIsSending(true);

    try {
      console.log('Sending email with data:', {
        to: toEmail,
        from: fromEmail,
        subject,
        message,
      });

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: toEmail,
          from: fromEmail,
          subject,
          message,
        }),
      });

      const data = await response.json();
      console.log('Email API response:', data);

      if (response.ok) {
        addToast({
          title: 'Email sent successfully',
          description: 'Your email has been sent',
          type: 'success',
        });

        // Clear form
        setSubject('');
        setMessage('');
        if (fromEmailRef.current) fromEmailRef.current.value = '';
      } else {
        addToast({
          title: 'Failed to send email',
          description:
            data.error || 'An error occurred while sending your email',
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Email sending error:', error);
      addToast({
        title: 'Error sending email',
        description: (error as Error).message || 'An unexpected error occurred',
        type: 'error',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{
        background: theme === 'dark' ? currentTheme.surface : '#ffffff',
      }}
    >
      {/* Email Form */}
      <div className="flex-1 overflow-auto p-4 pb-0">
        {/* To Field */}
        <div className="mb-3">
          <div
            className="flex border-b"
            style={{
              borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
            }}
          >
            <div
              className="w-16 py-2 font-medium"
              style={{
                color:
                  theme === 'dark' ? currentTheme.text.secondary : '#4b5563',
              }}
            >
              To
            </div>
            <div
              className="flex-1 py-2"
              style={{
                color: theme === 'dark' ? currentTheme.text.primary : '#111111',
              }}
            >
              {toEmail}
            </div>
            <div
              className="text-xs py-2"
              style={{
                color: theme === 'dark' ? currentTheme.text.muted : '#9ca3af',
              }}
            >
              Bcc
            </div>
          </div>
        </div>

        {/* From Field */}
        <div className="mb-3">
          <div
            className="flex border-b"
            style={{
              borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
            }}
          >
            <div
              className="w-16 py-2 font-medium"
              style={{
                color:
                  theme === 'dark' ? currentTheme.text.secondary : '#4b5563',
              }}
            >
              From
            </div>
            <div className="flex-1">
              <input
                ref={fromEmailRef}
                type="email"
                className={`w-full py-2 bg-transparent outline-none ${
                  emailError ? 'border-b-2 border-red-500' : ''
                }`}
                style={{
                  color:
                    theme === 'dark' ? currentTheme.text.primary : '#111111',
                }}
                placeholder="Add your email"
                pattern={emailRegex.source}
                required
                title={emailError}
                onBlur={(e) => {
                  if (e.target.value && !emailRegex.test(e.target.value)) {
                    setEmailError('Please enter a valid email address');
                  } else {
                    setEmailError('');
                  }
                }}
                onChange={() => {
                  if (emailError) {
                    setEmailError('');
                  }
                }}
              />
              {emailError && (
                <div
                  className="text-xs my-1"
                  style={{
                    color: theme === 'dark' ? '#ef4444' : '#dc2626',
                  }}
                >
                  {emailError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject Field */}
        <div className="mb-2">
          <div
            className="flex border-b"
            style={{
              borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
            }}
          >
            <div
              className="w-16 py-2 font-medium"
              style={{
                color:
                  theme === 'dark' ? currentTheme.text.secondary : '#4b5563',
              }}
            >
              Subject
            </div>
            <div className="flex-1">
              <input
                type="text"
                className={`w-full py-2 bg-transparent outline-none ${
                  subjectError ? 'border-b-2 border-red-500' : ''
                }`}
                style={{
                  color:
                    theme === 'dark' ? currentTheme.text.primary : '#111111',
                }}
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  if (subjectError) setSubjectError('');
                }}
                placeholder="Add a subject"
                required
                title={subjectError}
              />
              {subjectError && (
                <div
                  className="text-xs my-1"
                  style={{
                    color: theme === 'dark' ? '#ef4444' : '#dc2626',
                  }}
                >
                  {subjectError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Message Body */}
        <div className="flex-1 mb-2 pt-2">
          <textarea
            className={`w-full h-48 p-3 border rounded resize-none ${
              messageError ? 'border-red-500' : ''
            }`}
            style={{
              backgroundColor:
                theme === 'dark' ? currentTheme.glass.background : '#ffffff',
              borderColor: messageError
                ? '#ef4444'
                : theme === 'dark'
                ? currentTheme.border
                : '#e5e5e5',
              color: theme === 'dark' ? currentTheme.text.primary : '#111111',
            }}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (messageError) setMessageError('');
            }}
            placeholder="Type your message here..."
            required
            title={messageError}
          ></textarea>
          {messageError && (
            <div
              className="text-xs my-1"
              style={{
                color: theme === 'dark' ? '#ef4444' : '#dc2626',
              }}
            >
              {messageError}
            </div>
          )}
        </div>

        {/* Send Button */}
        <div className="flex justify-end items-center pb-2">
          <button
            className="px-4 py-1.5 rounded flex items-center gap-2 text-white hover:bg-[#106ebe]"
            style={{ backgroundColor: '#0078d4' }}
            onClick={handleSendEmail}
            disabled={isSending}
          >
            <SendHorizontal className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isSending ? 'Sending...' : 'Send'}
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center px-4 py-2 text-xs border-t"
        style={{
          borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
          color: theme === 'dark' ? currentTheme.text.secondary : '#555555',
        }}
      >
        <div className="flex gap-2">
          <span>
            Draft saved at{' '}
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            className="p-1 rounded-full"
            style={{
              backgroundColor: theme === 'dark' ? '#2e7d32' : '#4caf50',
            }}
            title="Spell check"
          ></button>
          <button
            className="p-1 rounded-full"
            style={{
              backgroundColor:
                theme === 'dark'
                  ? currentTheme.button.backgroundActive
                  : '#e0e0e0',
            }}
            title="Options"
          ></button>
        </div>
      </div>
    </div>
  );
};

export default OutlookApp;
