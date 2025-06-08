'use client';

import React from 'react';
import { Project } from '@/data/projects';
import { SteamTheme } from '@/components/types/system-types';

interface LeftCardProps {
  project: Project;
  isSelected: boolean;
  steamTheme: SteamTheme;
  onClick: () => void;
}

const LeftCard: React.FC<LeftCardProps> = ({
  project,
  isSelected,
  steamTheme,
  onClick,
}) => {
  return (
    <div
      className={`flex items-center p-2 rounded cursor-pointer hover:brightness-125 ${
        isSelected ? 'brightness-110' : ''
      }`}
      style={{
        background: isSelected ? steamTheme.sidebarHover : 'transparent',
      }}
      onClick={onClick}
    >
      <div className="ml-3 overflow-hidden">
        <h3
          className="text-sm font-medium truncate"
          style={{
            color: isSelected ? steamTheme.highlight : steamTheme.textPrimary,
          }}
        >
          {project.name}
        </h3>
        <p
          className="text-xs truncate"
          style={{ color: steamTheme.textSecondary }}
        >
          {project.d1}
        </p>
      </div>
    </div>
  );
};

export default LeftCard;
