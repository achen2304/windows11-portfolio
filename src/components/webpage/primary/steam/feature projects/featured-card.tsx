import React from 'react';
import { Project } from '@/data/projects';
import { SteamTheme } from '@/components/types/system-types';
import Image from 'next/image';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { useNavigation } from '@/components/webpage/chevron-button';
import { Tilt } from '@/components/ui/tilt';

interface FeaturedCardProps {
  project: Project;
  steamTheme: SteamTheme;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ project, steamTheme }) => {
  const { navigate } = useNavigation();

  const handleProjectClick = (projectName: string) => {
    navigate('steam-app', {
      tab: 'all',
      project: projectName,
    });
  };

  const { isXs, isSm, isMd } = useWindowSize();
  const isMobileView = isXs || isSm || isMd;

  return (
    <Tilt
      rotationFactor={4}
      isRevese
      className="group relative flex w-full h-[360px] md:h-[450px] rounded-lg overflow-hidden shadow-lg cursor-pointer"
    >
      <div onClick={() => handleProjectClick(project.name)}>
        {/* Main background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={`/projects/${project.image}`}
            alt={project.name}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          {/* Dark gradient overlay from right */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 60%, ${steamTheme.content} 100%)`,
            }}
          />
        </div>

        {/* Content container */}
        <div className="relative z-10 flex h-full w-full">
          {/* Main content area (left 75%) - just holds the image and gradient */}
          <div className={`${isMobileView ? 'w-1/2' : 'w-2/3'} h-full`}></div>

          {/* Right sidebar (25% or 50% on mobile) */}
          <div
            className={`${
              isMobileView ? 'w-1/2' : 'w-1/3'
            } h-full flex flex-col justify-between p-4`}
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            {/* Top content area */}
            <div className="flex flex-col gap-3">
              {/* Project Title */}
              <h2
                className={`${isMobileView ? 'text-xl' : 'text-2xl'} font-bold`}
                style={{ color: steamTheme.textPrimary }}
              >
                {project.name}
              </h2>

              {/* Description line */}
              <p
                className={`${
                  isMobileView ? 'text-md' : 'text-lg'
                } font-medium mb-1`}
                style={{ color: steamTheme.textSecondary }}
              >
                {project.d1}
              </p>

              {/* Main description - truncated */}
              {project.d2 && (
                <p
                  className={`text-md ${
                    isMobileView ? 'line-clamp-7' : 'line-clamp-5'
                  } `}
                  style={{ color: steamTheme.textSecondary }}
                >
                  {project.d2}
                </p>
              )}

              {/* Technology tags - horizontal and limited */}
              <div className="flex flex-col gap-1.5">
                <h3
                  className={`${
                    isMobileView ? 'text-md' : 'text-md'
                  } font-semibold`}
                  style={{ color: steamTheme.textPrimary }}
                >
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies
                    .slice(0, isMobileView ? 3 : 5)
                    .map((tech) => (
                      <span
                        key={tech}
                        className={`px-2 py-0.5 rounded ${
                          isMobileView ? 'text-sm' : 'text-sm'
                        }`}
                        style={{
                          background: 'rgba(25, 32, 46, 0.8)',
                          color: steamTheme.textSecondary,
                          border: `1px solid ${steamTheme.divider}`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  {project.technologies.length > (isMobileView ? 3 : 5) && (
                    <span
                      className={`${isMobileView ? 'text-sm' : 'text-sm'}`}
                      style={{ color: steamTheme.textSecondary }}
                    >
                      +{project.technologies.length - (isMobileView ? 3 : 5)}{' '}
                      more
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom action button */}
            <div className="mt-auto">
              <button
                className={`w-full flex items-center justify-center gap-2 px-3 py-2 cursor-pointer rounded text-md font-medium`}
                style={{
                  background: `linear-gradient(to right, ${steamTheme.buttonGradientStart}, ${steamTheme.buttonGradientEnd})`,
                  color: '#ffffff',
                }}
              >
                <span>View Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
};

export default FeaturedCard;
