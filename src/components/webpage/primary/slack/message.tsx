import React from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import ProfileImage from './common/ProfileImage';

export interface MessageProps {
  content: string | React.ReactNode;
  user: string;
  timestamp?: string;
  avatar?: string;
}

// Simple function to render markdown-like syntax
const renderMarkdown = (text: string) => {
  const boldRegex = /\*\*(.*?)\*\*/g;
  const textWithBold = text.replace(boldRegex, '<strong>$1</strong>');

  const withLineBreaks = textWithBold.replace(/\n/g, '<br />');

  return { __html: withLineBreaks };
};

// Message Header component
const MessageHeader = ({
  user,
  timestamp,
  slackTheme,
}: {
  user: string;
  timestamp: string;
  slackTheme: SlackTheme;
}) => (
  <div className="flex items-center mb-1">
    <span
      className="font-bold text-md mr-2"
      style={{ color: slackTheme.textPrimary }}
    >
      {user}
    </span>
    <span className="text-xs" style={{ color: slackTheme.textSecondary }}>
      {timestamp}
    </span>
  </div>
);

const Message: React.FC<MessageProps> = ({
  content,
  user,
  timestamp = '1:23 PM',
  avatar = '/other/profile.webp',
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div
      className="py-2 px-2 transition-colors rounded-sm"
      style={{
        background: 'transparent',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = slackTheme.messageBackground;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <div className="flex items-start">
        <ProfileImage src={avatar} alt={user} />

        <div className="flex-1 min-w-0">
          <MessageHeader
            user={user}
            timestamp={timestamp}
            slackTheme={slackTheme}
          />

          {typeof content === 'string' ? (
            <div
              className="break-words text-sm"
              style={{ color: slackTheme.textPrimary }}
              dangerouslySetInnerHTML={renderMarkdown(content)}
            />
          ) : (
            <div
              className="break-words text-sm"
              style={{ color: slackTheme.textPrimary }}
            >
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
