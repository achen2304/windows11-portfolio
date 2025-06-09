import React from 'react';
import Message from '../message';
import { useTheme } from '@/components/theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import WelcomeBanner from '../common/WelcomeBanner';
import { PORTFOLIO_MESSAGES } from '@/data/portfolio-messages';

const Portfolio: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div className="p-4">
      {/* Channel welcome message */}
      <WelcomeBanner
        title="Portfolio Overview"
        description="This channel provides a comprehensive overview of all the features and functionality in this Windows 11 portfolio."
        slackTheme={slackTheme}
      />

      {/* Portfolio messages */}
      <div className="space-y-4 mb-6">
        {PORTFOLIO_MESSAGES.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            user={message.user || 'Cai Chen'}
            timestamp={message.time}
            avatar="/other/profile.webp"
          />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
