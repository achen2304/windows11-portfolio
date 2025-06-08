import React from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import ProfileImage from './common/ProfileImage';

export interface MessageProps {
  content: string;
  username: string;
  timestamp?: string;
  profileImage?: string;
}

// Simple function to render markdown-like syntax
const renderMarkdown = (text: string) => {
  // Handle bold text with **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  const textWithBold = text.replace(boldRegex, '<strong>$1</strong>');

  // Handle line breaks
  const withLineBreaks = textWithBold.replace(/\n/g, '<br />');

  return { __html: withLineBreaks };
};

// Message Header component
const MessageHeader = ({
  username,
  timestamp,
  slackTheme,
}: {
  username: string;
  timestamp: string;
  slackTheme: SlackTheme;
}) => (
  <div className="flex items-center mb-1">
    <span className="font-bold mr-2" style={{ color: slackTheme.textPrimary }}>
      {username}
    </span>
    <span className="text-xs" style={{ color: slackTheme.textSecondary }}>
      {timestamp}
    </span>
  </div>
);

const Message: React.FC<MessageProps> = ({
  content,
  username,
  timestamp = '1:23 PM',
  profileImage = '/other/profile.png',
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div
      className="px-4 py-2 hover:cursor-pointer transition-colors"
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
        <ProfileImage src={profileImage} alt={username} />

        <div className="flex-1 min-w-0">
          <MessageHeader
            username={username}
            timestamp={timestamp}
            slackTheme={slackTheme}
          />

          <div
            className="break-words"
            style={{ color: slackTheme.textPrimary }}
            dangerouslySetInnerHTML={renderMarkdown(content)}
          />
        </div>
      </div>
    </div>
  );
};

export default Message;
