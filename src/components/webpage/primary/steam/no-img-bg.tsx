'use client';

import React from 'react';

interface ProjectImageBackgroundProps {
  imagePath: string;
  alt: string;
  children?: React.ReactNode;
  height?: string;
  gradientFrom?: string;
  gradientTo?: string;
  opacity?: number;
}

const ProjectImageBackground: React.FC<ProjectImageBackgroundProps> = ({
  imagePath,
  alt,
  children,
  height = 'h-56',
  gradientFrom = 'transparent',
  gradientTo = 'black',
  opacity = 0.7,
}) => {
  return (
    <div className={`relative ${height} w-full`}>
      <img
        src={imagePath}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ opacity }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
          opacity: 0.7,
        }}
      />
      <div className="absolute bottom-0 left-0 p-6 w-full">{children}</div>
    </div>
  );
};

export default ProjectImageBackground;
