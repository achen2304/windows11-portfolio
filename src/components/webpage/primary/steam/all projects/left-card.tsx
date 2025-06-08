'use client';

import React from 'react';
import { Project } from '@/data/projects';
import { SteamTheme } from '@/components/types/system-types';
import { motion } from 'framer-motion';

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
    <motion.div
      className={`flex items-center p-2 rounded cursor-pointer ${
        isSelected ? 'brightness-110' : ''
      }`}
      style={{
        background: isSelected ? steamTheme.sidebarHover : 'transparent',
      }}
      onClick={onClick}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="ml-3 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.h3
          className="text-sm font-medium truncate"
          style={{
            color: isSelected ? steamTheme.highlight : steamTheme.textPrimary,
          }}
          whileHover={{ x: 2 }}
          transition={{ duration: 0.2 }}
        >
          {project.name}
        </motion.h3>
        <motion.p
          className="text-xs truncate"
          style={{ color: steamTheme.textSecondary }}
        >
          {project.d1}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default LeftCard;
