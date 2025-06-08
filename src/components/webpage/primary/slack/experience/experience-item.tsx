import React from 'react';
import { SlackTheme } from '@/components/types/system-types';

interface ExperienceItemProps {
  company: string;
  position: string;
  period: string;
  description: string[];
  theme: SlackTheme;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  company,
  position,
  period,
  description,
  theme,
}) => {
  return (
    <div
      className="p-3 rounded-md"
      style={{ background: theme.threadBackground }}
    >
      <div className="mb-2">
        <div className="flex justify-between">
          <h3
            className="text-sm font-bold"
            style={{ color: theme.textPrimary }}
          >
            {position}
          </h3>
          <span className="text-xs" style={{ color: theme.textSecondary }}>
            {period}
          </span>
        </div>
        <div className="text-sm" style={{ color: theme.accent }}>
          {company}
        </div>
      </div>
      <ul className="space-y-1 pl-4 list-disc">
        {description.map((item, index) => (
          <li
            key={index}
            className="text-xs"
            style={{ color: theme.textSecondary }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperienceItem;
