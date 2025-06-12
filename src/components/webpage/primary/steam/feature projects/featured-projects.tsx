'use client';

import React from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { projects } from '@/data/projects';
import Image from 'next/image';
import AboutMe from './about-me';
import MediaList from './media-list';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { useNavigation } from '@/components/webpage/chevron-button';
import MobileCarousel from './featured section/mobile-carousel';
import DesktopCarousel from './featured section/desktop-carousel';
import ProjectMediaList from './featured section/project-media-list';

const FeaturedProjects: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const steamTheme = currentTheme.steam;
  const { isXs, isSm, isMd } = useWindowSize();
  const isMobileView = isXs || isSm || isMd;
  const { navigate } = useNavigation();

  const featuredProjects = projects.filter((project) => project.featured);

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
      {/* Banner Header */}
      <div className="w-full">
        <Image
          src="/other/steam-header.webp"
          alt="Steam Header"
          width={1000}
          height={200}
          className="w-full h-[275px] object-cover"
          priority
        />
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col p-4 md:p-6 w-full"
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <div className="w-full flex flex-col">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: steamTheme.textPrimary }}
          >
            Featured & Recommended Projects
          </h2>

          {/* Conditional Carousel Rendering */}
          {isMobileView ? (
            <MobileCarousel
              projects={featuredProjects}
              steamTheme={steamTheme}
              onProjectClick={handleProjectClick}
            />
          ) : (
            <DesktopCarousel
              projects={featuredProjects}
              steamTheme={steamTheme}
              onProjectClick={handleProjectClick}
            />
          )}
        </div>

        <div className="w-full mt-10">
          <Image
            src="/other/steam-pagebreak.webp"
            alt="Steam Header"
            width={1000}
            height={100}
            className="w-full h-[100px] object-cover rounded-sm"
            priority
          />
        </div>

        {/* Featured Projects Grid */}
        <div className="w-full mt-10">
          <h2
            className="text-lg font-bold"
            style={{ color: steamTheme.textPrimary }}
          >
            Top Featured Projects
          </h2>
          <ProjectMediaList
            projects={featuredProjects}
            steamTheme={steamTheme}
            onProjectClick={handleProjectClick}
          />
        </div>

        <div className="w-full mt-10">
          <Image
            src="/other/steam-pagebreak.webp"
            alt="Steam Header"
            width={1000}
            height={100}
            className="w-full h-[100px] object-cover rounded-sm"
            priority
          />
        </div>

        {/* Hobbies Section */}
        <div className="w-full mt-10">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: steamTheme.textPrimary }}
          >
            Some Pictures
          </h2>
          <AboutMe />
        </div>

        <div className="w-full mt-10">
          <Image
            src="/other/steam-pagebreak.webp"
            alt="Steam Header"
            width={1000}
            height={100}
            className="w-full h-[100px] object-cover rounded-sm"
            priority
          />
        </div>

        <div className="w-full mt-10">
          <h2
            className="text-lg font-bold mb-2"
            style={{ color: steamTheme.textPrimary }}
          >
            My Favorites
          </h2>
          <MediaList />
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
