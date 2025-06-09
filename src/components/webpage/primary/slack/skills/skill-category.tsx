import React from 'react';
import { SlackTheme } from '@/components/types/system-types';
import { skills as allSkills } from '@/data/skills';

interface SkillCategoryProps {
  title: string;
  skills: string[];
  theme: SlackTheme;
}

const SkillCategory: React.FC<SkillCategoryProps> = ({
  title,
  skills,
  theme,
}) => {
  const getIconForSkill = (skillName: string) => {
    const skill = allSkills.find(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    );
    return skill?.icon || null;
  };

  return (
    <div
      className="p-4 rounded-md"
      style={{ background: theme.threadBackground }}
    >
      <h3
        className="text-sm font-bold mb-4 flex items-center"
        style={{ color: theme.textPrimary }}
      >
        <span
          className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-sm"
          style={{ background: theme.accent, color: '#fff' }}
        >
          {title.charAt(0)}
        </span>
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => {
          const icon = getIconForSkill(skill);

          return (
            <div
              key={index}
              className="rounded-md p-2.5 transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md flex items-center"
              style={{
                background: theme.messageBackground,
                border: `1px solid ${theme.divider}`,
              }}
            >
              {icon && (
                <div
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center text-xl mr-3 rounded-md"
                  style={{
                    background: `${theme.divider}40`,
                  }}
                >
                  {icon}
                </div>
              )}
              <span
                className="text-sm font-medium"
                style={{ color: theme.textPrimary }}
              >
                {skill}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillCategory;
