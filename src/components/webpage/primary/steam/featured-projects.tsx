'use client';

import React from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { projects } from '@/data/projects';
import { Github, Globe, ExternalLink, GamepadIcon } from 'lucide-react';
import { Marquee } from '@/components/magicui/marquee';
import { useNavigation } from '@/components/webpage/chevron-button';
import { favoriteGames } from '@/data/hobbies';

const FeaturedProjects: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const steamTheme = currentTheme.steam;
  const { navigate } = useNavigation();

  // Filter featured projects
  const featuredProjects = projects.filter((project) => project.featured);

  // Handle project click to navigate to All Projects tab with the selected project
  const handleProjectClick = (projectName: string) => {
    navigate('steam-app', {
      tab: 'all',
      project: projectName,
    });
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
      <div className="flex-1 flex flex-col p-6">
        {/* Main Marquee - large, horizontal */}
        <div className="w-full mb-12">
          <h2
            className="text-lg font-bold mb-4"
            style={{ color: steamTheme.textPrimary }}
          >
            Featured Projects
          </h2>
          <Marquee pauseOnHover className="py-6">
            {featuredProjects.map((project) => (
              <div
                key={project.name}
                className="flex-shrink-0 w-120 cursor-pointer hover:scale-105 transition-all duration-300"
                onClick={() => handleProjectClick(project.name)}
              >
                <img
                  src={`/projects/${project.image}`}
                  alt={project.name}
                  className="w-full h-60 object-cover rounded-t-lg"
                />
                <div
                  className="p-4 rounded-b-lg"
                  style={{
                    background: steamTheme.card,
                    border: `1px solid ${steamTheme.divider}`,
                    borderTop: 'none',
                  }}
                >
                  <h3
                    className="font-bold text-lg truncate"
                    style={{ color: steamTheme.textPrimary }}
                  >
                    {project.name}
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: steamTheme.textSecondary }}
                  >
                    {project.d1}
                  </p>
                  <p className="flex flex-wrap gap-2 mb-3 pt-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          background: steamTheme.priceBg,
                          color: steamTheme.textSecondary,
                          border: `1px solid ${steamTheme.divider}`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span
                        className="text-xs pt-1"
                        style={{ color: steamTheme.textSecondary }}
                      >
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </p>
                  <p className="flex justify-end">
                    <button
                      className="flex items-center text-sm space-x-1 px-3 py-1 rounded-full hover:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${steamTheme.buttonGradientStart}, ${steamTheme.buttonGradientEnd})`,
                        color: '#ffffff',
                      }}
                    >
                      <ExternalLink size={16} />
                      <span>View Project</span>
                    </button>
                  </p>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Games I Like Section */}
        <div className="w-full mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-lg font-bold"
              style={{ color: steamTheme.textPrimary }}
            >
              My Hobbies and Games I Like
            </h2>
            <span
              className="text-sm"
              style={{ color: steamTheme.textSecondary }}
            >
              <GamepadIcon className="inline mr-1" size={16} />
              Personal Favorites
            </span>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteGames.map((game) => (
              <div
                key={game.name}
                className="rounded-lg overflow-hidden cursor-pointer hover:brightness-110 transition-all duration-200"
                style={{
                  background: steamTheme.card,
                  border: `1px solid ${steamTheme.divider}`,
                }}
              >
                <div className="relative">
                  <img
                    src={`/games/${game.image}`}
                    alt={game.name}
                    className="w-full h-40 object-cover"
                  />
                  <div
                    className="absolute bottom-0 right-0 px-3 py-1 rounded-tl-md"
                    style={{
                      background: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                    }}
                  >
                    {game.releaseYear}
                  </div>
                </div>
                <div className="p-3">
                  <h3
                    className="font-medium text-md"
                    style={{ color: steamTheme.textPrimary }}
                  >
                    {game.name}
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: steamTheme.textSecondary }}
                  >
                    {game.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {game.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-sm text-xs"
                        style={{
                          background: steamTheme.priceBg,
                          color: steamTheme.textSecondary,
                          border: `1px solid ${steamTheme.divider}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
