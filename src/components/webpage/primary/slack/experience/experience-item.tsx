import React from 'react';
import { SlackTheme } from '@/components/types/system-types';

interface ExperienceItemProps {
  company: string;
  companyUrl?: string;
  position: string;
  period: string;
  description: string[];
  theme: SlackTheme;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({
  company,
  companyUrl,
  position,
  period,
  description,
  theme,
}) => {
  return (
    <div
      className="p-3 rounded-md hover:scale-101 transition-all duration-300"
      style={{
        background: theme.threadBackground,
        border: `1px solid ${theme.divider}`,
      }}
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
        <div className="text-sm">
          {companyUrl ? (
            <a
              href={companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-all duration-200"
              style={{ color: theme.accent }}
            >
              {company}
            </a>
          ) : (
            <span style={{ color: theme.accent }}>{company}</span>
          )}
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
