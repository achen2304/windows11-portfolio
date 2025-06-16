'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { Send, MessageSquare, Trash2 } from 'lucide-react';
import { useChat } from 'ai/react';
import Image from 'next/image';

export const ChatGPTApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Storage configuration
  const STORAGE_KEY = 'chatgpt-messages';

  // Local storage helpers
  const saveMessagesToStorage = (
    messages: { id: string; role: string; content: string }[]
  ) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to localStorage:', error);
    }
  };

  const loadMessagesFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error);
    }
    return [];
  };

  const clearStoredMessages = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear stored messages:', error);
    }
  };

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    error,
  } = useChat({
    api: '/api/chat',
    initialMessages: loadMessagesFromStorage(),
    onFinish: (message) => {
      // Save updated messages to localStorage after each response
      const updatedMessages = [
        ...messages,
        { id: Date.now().toString(), role: 'user', content: input },
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: message.content,
        },
      ];
      saveMessagesToStorage(updatedMessages);
    },
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveMessagesToStorage(messages);
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([]);
    clearStoredMessages();
  };

  return (
    <div
      className="h-full flex flex-col min-h-0"
      style={{
        background: theme === 'dark' ? currentTheme.surface : '#ffffff',
      }}
    >
      {/* Chat Header */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{
          borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
          backgroundColor: theme === 'dark' ? currentTheme.surface : '#ffffff',
        }}
      >
        <div className="flex items-center gap-3">
          <MessageSquare
            className="w-5 h-5"
            style={{
              color: theme === 'dark' ? currentTheme.text.primary : '#374151',
            }}
          />
          <h1
            className="text-lg font-semibold"
            style={{
              color: theme === 'dark' ? currentTheme.text.primary : '#111827',
            }}
          >
            ChatGPT 3.5 Turbo
          </h1>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor:
                theme === 'dark'
                  ? currentTheme.button.backgroundHover
                  : '#f3f4f6',
              color: theme === 'dark' ? currentTheme.text.primary : '#374151',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark'
                  ? currentTheme.button.backgroundActive
                  : '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                theme === 'dark'
                  ? currentTheme.button.backgroundHover
                  : '#f3f4f6';
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div
            className="flex items-center justify-center h-full"
            style={{
              color: theme === 'dark' ? currentTheme.text.muted : '#6b7280',
            }}
          >
            <div className="text-center p-2">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">
                Ask me anything about Cai or this portfolio!
              </p>
              <p className="text-sm">
                Start a conversation by typing a message below.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 p-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center p-1"
                    style={{ backgroundColor: '#10a37f' }}
                  >
                    <Image
                      src="/app icons/chatgptlight.webp"
                      alt="ChatGPT"
                      className="w-full h-full object-contain"
                      width={32}
                      height={32}
                    />
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-100'
                  }`}
                  style={{
                    backgroundColor:
                      message.role === 'user'
                        ? '#0078d4'
                        : theme === 'dark'
                        ? currentTheme.glass.cardBackground
                        : '#f3f4f6',
                    color:
                      message.role === 'user'
                        ? '#ffffff'
                        : theme === 'dark'
                        ? currentTheme.text.primary
                        : '#374151',
                  }}
                >
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                    style={{ backgroundColor: '#0078d4' }}
                  >
                    U
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center p-1"
                  style={{ backgroundColor: '#10a37f' }}
                >
                  <Image
                    src="/app icons/chatgpt.webp"
                    alt="ChatGPT"
                    className="w-full h-full object-contain"
                    width={32}
                    height={32}
                  />
                </div>
                <div
                  className="max-w-[70%] rounded-lg p-3"
                  style={{
                    backgroundColor:
                      theme === 'dark'
                        ? currentTheme.glass.cardBackground
                        : '#f3f4f6',
                    color:
                      theme === 'dark' ? currentTheme.text.primary : '#374151',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-current rounded-full animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-4 justify-start">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  !
                </div>
                <div
                  className="max-w-[70%] rounded-lg p-3 border"
                  style={{
                    backgroundColor: theme === 'dark' ? '#7f1d1d' : '#fef2f2',
                    borderColor: theme === 'dark' ? '#dc2626' : '#fecaca',
                    color: theme === 'dark' ? '#fca5a5' : '#dc2626',
                  }}
                >
                  <div className="text-sm">
                    {error.message ||
                      'Sorry, I encountered an error. Please try again.'}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div
        className="p-4 border-t"
        style={{
          borderColor: theme === 'dark' ? currentTheme.border : '#e5e5e5',
          backgroundColor: theme === 'dark' ? currentTheme.surface : '#ffffff',
        }}
      >
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Send a message..."
            className="flex-1 px-4 py-3 rounded-lg border resize-none min-h-[52px] max-h-32"
            style={{
              backgroundColor:
                theme === 'dark' ? currentTheme.glass.background : '#ffffff',
              borderColor: theme === 'dark' ? currentTheme.border : '#d1d5db',
              color: theme === 'dark' ? currentTheme.text.primary : '#374151',
            }}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{
              backgroundColor:
                input.trim() && !isLoading
                  ? '#0078d4'
                  : theme === 'dark'
                  ? currentTheme.button.background
                  : '#f3f4f6',
              color:
                input.trim() && !isLoading
                  ? '#ffffff'
                  : theme === 'dark'
                  ? currentTheme.text.muted
                  : '#9ca3af',
            }}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div
          className="text-xs text-center mt-2"
          style={{
            color: theme === 'dark' ? currentTheme.text.muted : '#9ca3af',
          }}
        >
          ChatGPT can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

export default ChatGPTApp;
