'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../theme-provider';
import { themes } from '@/lib/themes';
import { projects, Project } from '@/data/projects';
import { Search, Menu, X } from 'lucide-react';
import LeftCard from './left-card';
import MainArea from './main-area';
import { useNavigation } from '@/components/webpage/chevron-button';
import { useWindowSize } from '@/components/webpage/breakpoints';

const Library: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const steamTheme = currentTheme.steam;
  const { navigate, getCurrentState, history, currentIndex } = useNavigation();
  const { isXs, isSm } = useWindowSize();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(!isXs && !isSm);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Update sidebar visibility on screen size change
  useEffect(() => {
    if (!isXs && !isSm) {
      setSidebarVisible(true);
    } else if (sidebarVisible) {
      setSidebarVisible(false);
    }
  }, [isXs, isSm]);

  // Handle project selection through navigation
  useEffect(() => {
    const currentState = getCurrentState();

    // Check if we have a specific project in the navigation state
    if (currentState?.data?.project) {
      const projectFromHistory = projects.find(
        (p) => p.name === currentState.data?.project
      );
      if (projectFromHistory) {
        setSelectedProject(projectFromHistory);
        return;
      }
    }

    // Otherwise set first project as selected by default
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
      // Add initial project to history
      const currentTab = currentState?.data?.tab || 'all';
      navigate('steam-app', { tab: currentTab, project: projects[0].name });
    }
  }, [history, currentIndex]);

  // Handle project selection
  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);

    // Get current tab from navigation state
    const currentState = getCurrentState();
    const currentTab = currentState?.data?.tab || 'all';

    // Add project selection to navigation history
    navigate('steam-app', { tab: currentTab, project: project.name });

    // Close sidebar on small screens after selection
    if (isXs || isSm) {
      setSidebarVisible(false);
    }
  };

  // Filter projects based on search
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.d1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.d2?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  // Separate featured and non-featured projects
  const featuredProjects = filteredProjects.filter(
    (project) => project.featured
  );
  const nonFeaturedProjects = filteredProjects.filter(
    (project) => !project.featured
  );

  if (!selectedProject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex h-full relative">
        {/* Mobile sidebar toggle button */}
        {(isXs || isSm) && (
          <button
            onClick={toggleSidebar}
            className="absolute top-3 left-3 z-20 p-2 rounded-full"
            style={{
              background: steamTheme.card,
              border: `1px solid ${steamTheme.divider}`,
              color: steamTheme.textPrimary,
            }}
          >
            {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        {/* Left sidebar with game list */}
        <div
          className={`${
            isXs || isSm ? 'absolute z-10 h-full' : 'w-64'
          } flex flex-col border-r overflow-hidden transition-all duration-300 ease-in-out`}
          style={{
            background: steamTheme.sidebar,
            borderColor: steamTheme.divider,
            width: sidebarVisible ? (isXs ? '85%' : '300px') : '0',
            opacity: sidebarVisible ? 1 : 0,
            visibility: sidebarVisible ? 'visible' : 'hidden',
          }}
        >
          {/* Search bar */}
          <div
            className="p-3 border-b"
            style={{ borderColor: steamTheme.divider }}
          >
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: steamTheme.textSecondary }}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md text-sm w-full"
                style={{
                  background: steamTheme.inputBg,
                  border: `1px solid ${steamTheme.divider}`,
                  color: steamTheme.textPrimary,
                }}
              />
            </div>
          </div>

          {/* Projects list - scrollable area */}
          <div className="flex-1 overflow-auto">
            {/* FAVORITES section */}
            <div className="mb-4">
              <div className="flex items-center justify-between p-3">
                <span
                  className="text-xs uppercase font-semibold"
                  style={{ color: steamTheme.textSecondary }}
                >
                  FAVORITES ({featuredProjects.length})
                </span>
                <span
                  className="text-xs"
                  style={{ color: steamTheme.textSecondary }}
                >
                  SORT
                </span>
              </div>

              <div className="space-y-1 px-1">
                {featuredProjects.map((project) => (
                  <LeftCard
                    key={project.name}
                    project={project}
                    isSelected={selectedProject.name === project.name}
                    steamTheme={steamTheme}
                    onClick={() => handleProjectSelect(project)}
                  />
                ))}
              </div>
            </div>

            {/* UNORGANIZED section */}
            {nonFeaturedProjects.length > 0 && (
              <div>
                <div className="flex items-center justify-between p-3">
                  <span
                    className="text-xs uppercase font-semibold"
                    style={{ color: steamTheme.textSecondary }}
                  >
                    UNORGANIZED ({nonFeaturedProjects.length})
                  </span>
                </div>

                <div className="space-y-1 px-1">
                  {nonFeaturedProjects.map((project) => (
                    <LeftCard
                      key={project.name}
                      project={project}
                      isSelected={selectedProject.name === project.name}
                      steamTheme={steamTheme}
                      onClick={() => handleProjectSelect(project)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Semi-transparent overlay for mobile */}
        {(isXs || isSm) && sidebarVisible && (
          <div
            className="absolute inset-0 z-5 bg-black opacity-50"
            onClick={() => setSidebarVisible(false)}
          />
        )}

        {/* Main content area showing selected project */}
        <div
          className="flex-1"
          style={{
            marginLeft: isXs || isSm ? 0 : sidebarVisible ? '0' : '-64px',
            transition: 'margin-left 0.3s ease-in-out',
          }}
        >
          <MainArea selectedProject={selectedProject} steamTheme={steamTheme} />
        </div>
      </div>
    </div>
  );
};

export default Library;
