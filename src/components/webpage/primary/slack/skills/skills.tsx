import React, { useMemo } from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import SkillCategory from './skill-category';
import Message from '../message';
import WelcomeBanner from '../common/WelcomeBanner';
import ProfileImage from '../common/ProfileImage';
import { skills as allSkills } from '@/data/skills';

// Custom message content component for skills
const SkillsMessageContent = ({ slackTheme }: { slackTheme: SlackTheme }) => {
  // Create skill categories from the data file based on skill types
  const skillsByCategory = useMemo(() => {
    // Group skills by type
    const groupedSkills = allSkills.reduce((acc, skill) => {
      const type = skill.type;
      if (!acc[type]) {
        acc[type] = [];
      }

      acc[type].push({
        name: skill.name,
      });

      return acc;
    }, {} as Record<string, { name: string }[]>);

    // Sort each category alphabetically
    Object.keys(groupedSkills).forEach((key) => {
      groupedSkills[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return groupedSkills;
  }, []);

  // Map type names to display names
  const categoryTitles = {
    language: 'Programming Languages',
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    database: 'Database & Cloud',
    devops: 'DevOps & Cloud',
    tools: 'Tools & Utilities',
  };

  // Define category order
  const categoryOrder = [
    'language',
    'frontend',
    'backend',
    'database',
    'tools',
    'devops',
  ];

  return (
    <div>
      <div
        className="text-sm mt-1 mb-4"
        style={{ color: slackTheme.textPrimary }}
      >
        My technical skills span multiple domains of software development:
      </div>

      <div className="space-y-4">
        {categoryOrder.map((type) => {
          if (!skillsByCategory[type]) return null;

          return (
            <div key={type}>
              <SkillCategory
                title={
                  categoryTitles[type as keyof typeof categoryTitles] || type
                }
                skills={skillsByCategory[type]}
                theme={slackTheme}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsChannel: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <div className="p-4">
      {/* Channel welcome message */}
      <WelcomeBanner
        title="Skills & Technologies"
        description="Here's a breakdown of my technical skills and the technologies I'm proficient in. I'm always learning and expanding my skill set!"
        slackTheme={slackTheme}
      />

      {/* Skill categories */}
      <div className="space-y-4 mb-6">
        <div className="py-2 flex items-start">
          <ProfileImage src="/other/profile.png" alt="Cai Chen" />
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
                10:15 AM
              </span>
            </div>

            <SkillsMessageContent slackTheme={slackTheme} />
          </div>
        </div>

        <Message
          content="I'm always looking to expand my skill set and learn new technologies. Currently, I'm focusing on improving my knowledge of cloud infrastructure and serverless architectures."
          user="Cai Chen"
          timestamp="10:20 AM"
          avatar="/other/profile.png"
        />
      </div>
    </div>
  );
};

export default SkillsChannel;
