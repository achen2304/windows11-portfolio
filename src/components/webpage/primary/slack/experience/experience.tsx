import React from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import ExperienceItem from './experience-item';
import Message from '../message';
import WelcomeBanner from '../common/WelcomeBanner';
import ProfileImage from '../common/ProfileImage';
import { EXPERIENCES } from '@/data/experience';

// Custom Experience List Component
const ExperienceList = ({ slackTheme }: { slackTheme: SlackTheme }) => (
  <div>
    <div
      className="text-sm mt-1 mb-3"
      style={{ color: slackTheme.textPrimary }}
    >
      Here&apos;s a summary of my professional experience:
    </div>

    <div className="mt-3 space-y-4">
      {EXPERIENCES.map((exp, index) => (
        <ExperienceItem
          key={index}
          company={exp.company}
          position={exp.position}
          period={exp.period}
          description={exp.description}
          theme={slackTheme}
        />
      ))}
    </div>
  </div>
);

const ExperienceChannel: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div className="p-4">
      {/* Channel welcome message */}
      <WelcomeBanner
        title="Professional Experience"
        description="Here's an overview of my professional experience and the roles I've held."
        slackTheme={slackTheme}
      />

      {/* Experience items */}
      <div className="space-y-4 mb-6">
        <div className="py-2 flex items-start">
          <ProfileImage src="/other/profile.webp" alt="profile" />
          <div className="flex-1">
            <div className="flex items-center">
              <span
                className="font-bold text-md"
                style={{ color: slackTheme.textPrimary }}
              >
                Cai Chen
              </span>
              <span
                className="ml-2 text-xs"
                style={{ color: slackTheme.textSecondary }}
              >
                11:00 AM
              </span>
            </div>

            <ExperienceList slackTheme={slackTheme} />
          </div>
        </div>

        <Message
          content="Throughout my career, I've focused on delivering high-quality, user-friendly web applications while constantly learning and adopting new technologies and best practices."
          user="Cai Chen"
          timestamp="11:05 AM"
          avatar="/other/profile.webp"
        />
      </div>
    </div>
  );
};

export default ExperienceChannel;
