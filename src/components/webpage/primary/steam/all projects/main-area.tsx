'use client';

import React from 'react';
import { Project } from '@/data/projects';
import { Github, ExternalLink, Clock, Calendar, Tag } from 'lucide-react';

interface MainAreaProps {
  selectedProject: Project;
  steamTheme: any;
}

const MainArea: React.FC<MainAreaProps> = ({ selectedProject, steamTheme }) => {
  return (
    <div
      className="flex-1 flex flex-col h-full overflow-hidden"
      style={{ background: steamTheme.content }}
    >
      {/* Project header with banner */}
      <div className="relative">
        <div className="h-56 w-full bg-gradient-to-b from-transparent to-black relative">
          <img
            src={`/projects/${selectedProject.image}`}
            alt={selectedProject.name}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute bottom-0 left-0 p-6">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: steamTheme.textPrimary }}
            >
              {selectedProject.name}
            </h1>
            <p className="text-lg" style={{ color: steamTheme.textSecondary }}>
              {selectedProject.d1}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center p-4 border-b"
        style={{
          background: steamTheme.card,
          borderColor: steamTheme.divider,
        }}
      >
        <div className="flex gap-3">
          {selectedProject.link && (
            <button
              onClick={() => window.open(selectedProject.link, '_blank')}
              className="flex items-center gap-2 px-6 py-2 rounded font-semibold"
              style={{
                background: `linear-gradient(to right, ${steamTheme.buttonGradientStart}, ${steamTheme.buttonGradientEnd})`,
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
              className="flex items-center gap-2 px-6 py-2 rounded font-semibold"
              style={{
                background: steamTheme.inputBg,
                color: steamTheme.textPrimary,
                border: `1px solid ${steamTheme.divider}`,
              }}
            >
              <Github size={16} />
              <span>GitHub</span>
            </button>
          )}
        </div>
      </div>

      {/* Project details */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Main content - 2/3 width */}
          <div className="col-span-2 space-y-6">
            <div
              className="p-5 rounded"
              style={{
                background: steamTheme.card,
                border: `1px solid ${steamTheme.divider}`,
              }}
            >
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: steamTheme.textPrimary }}
              >
                About this project
              </h2>
              <p
                className="leading-relaxed mb-4"
                style={{ color: steamTheme.textSecondary }}
              >
                {selectedProject.d2 || 'No description available.'}
              </p>
              {selectedProject.d3 && (
                <p
                  className="leading-relaxed"
                  style={{ color: steamTheme.textSecondary }}
                >
                  {selectedProject.d3}
                </p>
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-4">
            {/* Technologies used */}
            <div
              className="p-4 rounded"
              style={{
                background: steamTheme.card,
                border: `1px solid ${steamTheme.divider}`,
              }}
            >
              <h3
                className="text-md font-bold mb-3"
                style={{ color: steamTheme.textPrimary }}
              >
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 rounded text-xs"
                    style={{
                      background: steamTheme.priceBg,
                      color: steamTheme.textSecondary,
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
                background: steamTheme.card,
                border: `1px solid ${steamTheme.divider}`,
              }}
            >
              <h3
                className="text-md font-bold mb-3"
                style={{ color: steamTheme.textPrimary }}
              >
                Project Info
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar
                    size={16}
                    className="mr-3"
                    style={{ color: steamTheme.textSecondary }}
                  />
                  <span style={{ color: steamTheme.textSecondary }}>
                    Created: {selectedProject.created}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock
                    size={16}
                    className="mr-3"
                    style={{ color: steamTheme.textSecondary }}
                  />
                  <span style={{ color: steamTheme.textSecondary }}>
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
