'use client';

import React from 'react';
import { Project } from '@/data/projects';
import { Github, ExternalLink, Clock, Calendar } from 'lucide-react';
import ProjectImageBackground from '../no-img-bg';
import { useWindowSize } from '@/components/webpage/breakpoints';
import { SteamTheme } from '@/components/types/system-types';

interface MainAreaProps {
  selectedProject: Project;
  steamTheme: SteamTheme;
}

const MainArea: React.FC<MainAreaProps> = ({ selectedProject, steamTheme }) => {
  const { isXs, isSm, isMd } = useWindowSize();

  const theme = steamTheme as SteamTheme;

  const isMobileView = isXs || isSm || isMd;

  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden"
      style={{ background: theme.content }}
    >
      {/* Project header with banner */}
      <ProjectImageBackground
        imagePath={`/projects/${selectedProject.image}`}
        alt={selectedProject.name}
        height={isMobileView ? 'h-44' : 'h-56'}
        gradientFrom="transparent"
        gradientTo="rgba(0,0,0,0.9)"
      >
        <h1
          className={`${isMobileView ? 'text-2xl' : 'text-4xl'} font-bold mb-2`}
          style={{ color: theme.textPrimary }}
        >
          {selectedProject.name}
        </h1>
        <p
          className={`${isMobileView ? 'text-sm' : 'text-lg'}`}
          style={{ color: theme.textSecondary }}
        >
          {selectedProject.d1}
        </p>
      </ProjectImageBackground>

      {/* Action buttons */}
      <div
        className="flex items-center p-4 border-b"
        style={{
          background: theme.card,
          borderColor: theme.divider,
        }}
      >
        <div className="flex gap-3">
          {selectedProject.link && (
            <button
              onClick={() => window.open(selectedProject.link, '_blank')}
              className="flex items-center gap-2 px-6 py-2 rounded font-semibold cursor-pointer hover:scale-103 transition-all duration-300"
              style={{
                background: `linear-gradient(to right, ${theme.buttonGradientStart}, ${theme.buttonGradientEnd})`,
                color: '#ffffff',
              }}
            >
              <ExternalLink size={16} />
              <span>Demo</span>
            </button>
          )}

          {selectedProject.github && (
            <button
              onClick={() => window.open(selectedProject.github, '_blank')}
              className="flex items-center gap-2 px-6 py-2 rounded font-semibold cursor-pointer hover:brightness-110 hover:scale-103 transition-all duration-300"
              style={{
                background: theme.inputBg,
                color: theme.textPrimary,
                border: `1px solid ${theme.divider}`,
              }}
            >
              <Github size={16} />
              <span>GitHub</span>
            </button>
          )}
        </div>
      </div>

      {/* Project details - Flexbox layout */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div
          className={`flex flex-col ${!isMobileView && 'md:flex-row'} gap-6`}
        >
          {/* Main content - responsive width */}
          <div
            className={`${
              isMobileView ? 'w-full' : 'md:flex-[2]'
            } space-y-6 order-1 md:order-1`}
          >
            <div
              className="p-4 md:p-5 rounded"
              style={{
                background: theme.card,
                border: `1px solid ${theme.divider}`,
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: theme.textPrimary }}
              >
                About this project
              </h2>
              <p
                className="leading-relaxed mb-4"
                style={{ color: theme.textSecondary }}
              >
                {selectedProject.d2 || 'No description available.'}
              </p>
              {selectedProject.d3 && (
                <p
                  className="leading-relaxed"
                  style={{ color: theme.textSecondary }}
                >
                  {selectedProject.d3}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - responsive width and order */}
          <div
            className={`${
              isMobileView ? 'w-full' : 'md:flex-1'
            } space-y-4 order-2 md:order-2`}
          >
            {/* Technologies used */}
            <div
              className="p-4 rounded"
              style={{
                background: theme.card,
                border: `1px solid ${theme.divider}`,
              }}
            >
              <h3
                className="text-md font-bold mb-3"
                style={{ color: theme.textPrimary }}
              >
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: theme.priceBg,
                      color: theme.textSecondary,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Project details */}
            <div
              className="p-4 rounded"
              style={{
                background: theme.card,
                border: `1px solid ${theme.divider}`,
              }}
            >
              <h3
                className="text-md font-bold mb-3"
                style={{ color: theme.textPrimary }}
              >
                Project Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar
                    size={16}
                    className="mr-3"
                    style={{ color: theme.textSecondary }}
                  />
                  <span style={{ color: theme.textSecondary }}>
                    Created: {selectedProject.created}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock
                    size={16}
                    className="mr-3"
                    style={{ color: theme.textSecondary }}
                  />
                  <span style={{ color: theme.textSecondary }}>
                    Last updated: {selectedProject.updated}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainArea;
