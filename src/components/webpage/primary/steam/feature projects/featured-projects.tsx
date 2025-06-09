'use client';

import React from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { projects } from '@/data/projects';
import { ExternalLink } from 'lucide-react';
import { Marquee } from '@/components/magicui/marquee';
import { useNavigation } from '@/components/webpage/chevron-button';
import { favoriteGames } from '@/data/hobbies';
import { useWindowSize } from '@/components/webpage/breakpoints';
import HobbiesCard from './hobbies-card';
import Image from 'next/image';

const FeaturedProjects: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const steamTheme = currentTheme.steam;
  const { navigate } = useNavigation();
  const { isXs, isSm, isMd, width } = useWindowSize();

  // Filter featured projects
  const featuredProjects = projects.filter((project) => project.featured);

  // Handle project click to navigate to All Projects tab with the selected project
  const handleProjectClick = (projectName: string) => {
    navigate('steam-app', {
      tab: 'all',
      project: projectName,
    });
  };

  // Determine if we should use compact mode
  const isCompactMode = isXs || isSm || isMd;

  // Calculate card width based on window size - make cards bigger on small screens
  const getCardWidth = () => {
    if (isXs) return 'w-72'; // Extra small window
    if (isSm) return 'w-80'; // Small window
    if (isMd) return 'w-96'; // Medium window
    return 'w-96'; // Large window (default)
  };

  // Calculate card height based on window size
  const getCardImageHeight = () => {
    if (isXs) return 'h-36'; // Taller on small screens
    if (isSm) return 'h-40';
    if (isMd) return 'h-44';
    return 'h-52';
  };

  // Calculate grid columns for games section based on screen size
  const getGridColumns = () => {
    if (isXs) return 'grid-cols-1 gap-3'; // Single column
    if (isSm) return 'grid-cols-1 gap-3';
    if (isMd) return 'grid-cols-2 gap-4';
    return 'grid-cols-3 gap-6';
  };

  // Special breakpoint for compact cards in grid-2 layout
  // Use this threshold for when grid-2 should use compact cards (e.g., narrower windows)
  const useCompactInGrid = width < 550;

  // Determine if we should use compact cards based on layout
  const shouldUseCompactCards = () => {
    // Always use compact cards in single column layout
    if (isXs || isSm) return true;
    // Use compact cards in narrow grid layouts
    return useCompactInGrid;
  };

  // Calculate how many tags to show based on layout
  const getMaxTags = () => {
    if (isXs || isSm) return 3; // Show more tags in compact view
    if (isMd) return 2;
    return 4; // Show more tags in larger layouts
  };

  return (
    <div
      className="h-full flex flex-col overflow-auto"
      style={{
        background: steamTheme.content,
        backgroundImage: steamTheme.featuredGradient,
      }}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 md:p-6">
        {/* Featured Projects - Always use Marquee but with responsive sizing */}
        <div className="w-full my-8 md:mb-12 flex flex-col items-center">
          <h2
            className="text-3xl font-bold mb-3 md:mb-4"
            style={{ color: steamTheme.textPrimary }}
          >
            Featured Projects
          </h2>

          <Marquee pauseOnHover className="py-3 md:py-6">
            {featuredProjects.map((project) => (
              <div
                key={project.name}
                className={`flex-shrink-0 ${getCardWidth()} cursor-pointer hover:brightness-110 transition-all duration-300 mx-2 md:mx-3 rounded-lg overflow-hidden`}
                onClick={() => handleProjectClick(project.name)}
                style={{
                  background: steamTheme.card,
                  border: `1px solid ${steamTheme.divider}`,
                }}
              >
                {/* Project image without any text overlay */}
                <div
                  className={`${getCardImageHeight()} w-full overflow-hidden`}
                >
                  <Image
                    src={`/projects/${project.image}`}
                    alt={project.name}
                    className="w-full h-full object-cover"
                    width={400}
                    height={300}
                  />
                </div>

                {/* Card content section */}
                <div className="p-4">
                  {/* Project title */}
                  <h3
                    className={`font-bold ${
                      isCompactMode ? 'text-lg' : 'text-xl'
                    } truncate mb-2`}
                    style={{ color: steamTheme.textPrimary }}
                  >
                    {project.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`${
                      isCompactMode ? 'text-sm' : 'text-base'
                    } mt-1 ${isCompactMode ? 'line-clamp-2' : ''} mb-3`}
                    style={{ color: steamTheme.textSecondary }}
                  >
                    {project.d1}
                  </p>

                  {/* Technology tags */}
                  <div className={`flex overflow-hidden space-x-1.5 mb-4`}>
                    {project.technologies
                      .slice(0, isCompactMode ? 2 : 3)
                      .map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-0.5 rounded-full text-xs flex-shrink-0`}
                          style={{
                            background: steamTheme.priceBg,
                            color: steamTheme.textSecondary,
                            border: `1px solid ${steamTheme.divider}`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    {project.technologies.length > (isCompactMode ? 2 : 3) && (
                      <span
                        className={`${
                          isCompactMode ? 'text-xs' : 'text-sm'
                        } flex-shrink-0`}
                        style={{ color: steamTheme.textSecondary }}
                      >
                        +{project.technologies.length - (isCompactMode ? 2 : 3)}
                      </span>
                    )}
                  </div>

                  {/* View button */}
                  <div className="flex justify-end">
                    <button
                      className={`flex items-center ${
                        isCompactMode ? 'text-sm' : 'text-base'
                      } gap-1 px-3 py-1 rounded-full hover:cursor-pointer`}
                      style={{
                        background: `linear-gradient(to right, ${steamTheme.buttonGradientStart}, ${steamTheme.buttonGradientEnd})`,
                        color: '#ffffff',
                      }}
                    >
                      <ExternalLink size={isCompactMode ? 14 : 16} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>
        {/* Simple Divider */}
        <hr
          className="w-full my-4 mb-8 border-t-0 h-1 rounded-full"
          style={{ backgroundColor: steamTheme.divider }}
        />

        {/* Favorite Shows Section - Responsive layouts */}
        <div className="w-full my-8 md:mb-10 flex flex-col items-center">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <h2
              className="text-2xl font-bold"
              style={{ color: steamTheme.textPrimary }}
            >
              Favorite Shows
            </h2>
          </div>

          {/* Games Grid with adaptive card styles */}
          <div className={`grid ${getGridColumns()}`}>
            {favoriteGames.map(
              (game) =>
                game.type === 'show' && (
                  <HobbiesCard
                    key={game.name}
                    game={game}
                    steamTheme={steamTheme}
                    variant={shouldUseCompactCards() ? 'compact' : 'normal'}
                    maxTags={getMaxTags()}
                    maxDescriptionLength={shouldUseCompactCards() ? 80 : 100}
                  />
                )
            )}
          </div>
        </div>
        {/* Games I Like Section - Responsive layouts */}
        <div className="w-full mb-8 md:mb-10 flex flex-col items-center">
          <div className="flex items-center justify-center mb-3 md:mb-4">
            <h2
              className="text-2xl font-bold"
              style={{ color: steamTheme.textPrimary }}
            >
              Favorite Games
            </h2>
          </div>

          {/* Games Grid with adaptive card styles */}
          <div className={`grid ${getGridColumns()}`}>
            {favoriteGames.map(
              (game) =>
                game.type === 'game' && (
                  <HobbiesCard
                    key={game.name}
                    game={game}
                    steamTheme={steamTheme}
                    variant={shouldUseCompactCards() ? 'compact' : 'normal'}
                    maxTags={getMaxTags()}
                    maxDescriptionLength={shouldUseCompactCards() ? 80 : 100}
                  />
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
