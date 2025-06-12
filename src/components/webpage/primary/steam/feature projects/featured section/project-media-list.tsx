import React from 'react';
import { Project } from '@/data/projects';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SteamTheme } from '@/components/types/system-types';

interface ProjectCardProps {
  project: Project;
  steamTheme: SteamTheme;
  onClick: (projectName: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  steamTheme,
  onClick,
}) => (
  <div
    onClick={() => onClick(project.name)}
    className="group bg-[#16202D] hover:bg-[#1B2838] transition-colors cursor-pointer rounded-lg overflow-hidden"
  >
    <div className="relative w-full h-[180px]">
      <Image
        src={`/projects/${project.image}`}
        alt={project.name}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading="lazy"
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3
          className="text-lg font-medium transition-colors"
          style={{
            color: steamTheme.textPrimary,
          }}
        >
          {project.name}
        </h3>
        <p
          className="mt-1 text-sm line-clamp-2"
          style={{ color: steamTheme.textSecondary }}
        >
          {project.d1}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded"
              style={{
                background: 'rgba(25, 32, 46, 0.8)',
                color: steamTheme.textSecondary,
                border: `1px solid ${steamTheme.divider}`,
              }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span
              className="text-xs"
              style={{ color: steamTheme.textSecondary }}
            >
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

interface ProjectMediaListProps {
  projects: Project[];
  steamTheme: SteamTheme;
  onProjectClick: (projectName: string) => void;
}

const ProjectMediaList: React.FC<ProjectMediaListProps> = ({
  projects,
  steamTheme,
  onProjectClick,
}) => {
  const { isXs, isSm, isMd } = useWindowSize();
  const isMobileView = isXs || isSm;

  // Determine grid columns based on breakpoints
  const getGridCols = () => {
    if (isXs || isSm) return 'grid-cols-1';
    if (isMd) return 'grid-cols-2';
    return 'grid-cols-3';
  };

  // Filter projects for mobile view
  const displayedProjects = isMobileView ? projects.slice(0, 3) : projects;

  return (
    <div className="w-full">
      {/* Grid Layout */}
      <div className={cn('grid gap-3 p-2 md:p-4', getGridCols())}>
        {displayedProjects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            steamTheme={steamTheme}
            onClick={onProjectClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectMediaList;
