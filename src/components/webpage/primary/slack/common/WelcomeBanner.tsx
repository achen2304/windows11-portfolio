import React from 'react';
import { SlackTheme } from '@/components/types/system-types';

interface WelcomeBannerProps {
  title: string;
  description: string;
  slackTheme: SlackTheme;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  title,
  description,
  slackTheme,
}) => (
  <div
    className="p-4 mb-6 rounded-md"
    style={{ background: slackTheme.welcomeBackground }}
  >
    <h2
      className="text-lg font-bold mb-2"
      style={{ color: slackTheme.textPrimary }}
    >
      # {title}
    </h2>
    <p style={{ color: slackTheme.textSecondary }}>{description}</p>
  </div>
);

export default WelcomeBanner;
