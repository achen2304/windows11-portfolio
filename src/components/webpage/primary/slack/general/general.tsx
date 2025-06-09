import React from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import Message from '../message';
import WelcomeBanner from '../common/WelcomeBanner';
import { MESSAGES } from '@/data/about-messages';

const GeneralChannel: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div className="p-4">
      {/* Channel welcome message */}
      <WelcomeBanner
        title="About Me"
        description="This section will serve as an introduction to who I am, what I do, and what you can find in this portfolio."
        slackTheme={slackTheme}
      />

      {/* About me */}
      <div className="mb-6">
        {MESSAGES.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            username="Cai Chen"
            timestamp={message.time}
            profileImage="/other/profile.png"
          />
        ))}
      </div>
    </div>
  );
};

export default GeneralChannel;
