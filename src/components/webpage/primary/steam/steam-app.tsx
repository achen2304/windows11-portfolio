'use client';

import React, { useState } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import {
  Play,
  Download,
  Star,
  Calendar,
  Code,
  ExternalLink,
  Github,
  Globe,
  Users,
  Award,
  Search,
  Filter,
  Grid,
  List,
  Settings,
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  screenshots: string[];
  technologies: string[];
  category: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  releaseDate: string;
  lastUpdated: string;
  githubUrl?: string;
  liveUrl?: string;
  downloadUrl?: string;
  rating: number;
  downloads: number;
  tags: string[];
}

// Sample projects data - replace with your actual projects
const sampleProjects: Project[] = [
  {
    id: 'portfolio-website',
    title: 'Windows 11 Portfolio',
    description:
      'A modern portfolio website inspired by Windows 11 design language',
    longDescription:
      'This portfolio website recreates the Windows 11 experience in the browser, featuring a fully functional taskbar, window management system, and multiple interactive applications. Built with Next.js, TypeScript, and Tailwind CSS.',
    image: '/api/placeholder/460/215',
    screenshots: [
      '/api/placeholder/800/450',
      '/api/placeholder/800/450',
      '/api/placeholder/800/450',
    ],
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React'],
    category: 'Web Development',
    status: 'completed',
    featured: true,
    releaseDate: '2024-01-15',
    lastUpdated: '2024-01-20',
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.com',
    rating: 4.8,
    downloads: 1250,
    tags: ['Portfolio', 'Windows 11', 'UI/UX', 'Responsive'],
  },
  {
    id: 'task-manager',
    title: 'Advanced Task Manager',
    description:
      'A powerful task management application with team collaboration features',
    longDescription:
      'A comprehensive task management solution featuring real-time collaboration, advanced filtering, project timelines, and team analytics. Includes drag-and-drop functionality and customizable workflows.',
    image: '/api/placeholder/460/215',
    screenshots: ['/api/placeholder/800/450', '/api/placeholder/800/450'],
    technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    category: 'Productivity',
    status: 'completed',
    featured: true,
    releaseDate: '2023-11-20',
    lastUpdated: '2024-01-10',
    githubUrl: 'https://github.com/yourusername/task-manager',
    liveUrl: 'https://taskmanager.com',
    rating: 4.6,
    downloads: 890,
    tags: ['Productivity', 'Collaboration', 'Real-time', 'Teams'],
  },
  {
    id: 'weather-app',
    title: 'Weather Dashboard',
    description:
      'Beautiful weather application with detailed forecasts and maps',
    longDescription:
      'An elegant weather application featuring detailed forecasts, interactive maps, weather alerts, and historical data. Includes location-based services and customizable widgets.',
    image: '/api/placeholder/460/215',
    screenshots: ['/api/placeholder/800/450'],
    technologies: ['Vue.js', 'Weather API', 'Chart.js', 'PWA'],
    category: 'Utility',
    status: 'in-progress',
    featured: false,
    releaseDate: '2024-02-01',
    lastUpdated: '2024-01-18',
    githubUrl: 'https://github.com/yourusername/weather-app',
    rating: 4.3,
    downloads: 456,
    tags: ['Weather', 'Maps', 'PWA', 'Mobile-first'],
  },
];

const SteamApp: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const [activeTab, setActiveTab] = useState<'library' | 'store' | 'community'>(
    'library'
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    'all',
    ...Array.from(new Set(sampleProjects.map((p) => p.category))),
  ];

  const filteredProjects = sampleProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesCategory =
      selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return '#4ade80';
      case 'in-progress':
        return '#fbbf24';
      case 'planned':
        return '#94a3b8';
      default:
        return currentTheme.text.muted;
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'completed':
        return 'Live';
      case 'in-progress':
        return 'In Development';
      case 'planned':
        return 'Planned';
      default:
        return 'Unknown';
    }
  };

  if (selectedProject) {
    return (
      <div
        className="h-full flex flex-col"
        style={{ background: currentTheme.background }}
      >
        {/* Project Detail Header */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: currentTheme.glass.border }}
        >
          <button
            onClick={() => setSelectedProject(null)}
            className="px-4 py-2 rounded transition-all duration-200"
            style={{
              background: currentTheme.glass.cardBackground,
              color: currentTheme.text.primary,
              border: `1px solid ${currentTheme.glass.border}`,
            }}
          >
            ← Back to Library
          </button>
          <div className="flex items-center space-x-2">
            <span style={{ color: getStatusColor(selectedProject.status) }}>
              {getStatusText(selectedProject.status)}
            </span>
          </div>
        </div>

        {/* Project Detail Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h1
                  className="text-3xl font-bold mb-4"
                  style={{ color: currentTheme.text.primary }}
                >
                  {selectedProject.title}
                </h1>

                <div className="mb-6">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full rounded-lg"
                    style={{ border: `1px solid ${currentTheme.glass.border}` }}
                  />
                </div>

                <div className="mb-6">
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: currentTheme.text.primary }}
                  >
                    About This Project
                  </h3>
                  <p
                    className="leading-relaxed"
                    style={{ color: currentTheme.text.secondary }}
                  >
                    {selectedProject.longDescription}
                  </p>
                </div>

                <div className="mb-6">
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{
                          background: currentTheme.glass.cardBackground,
                          color: currentTheme.text.primary,
                          border: `1px solid ${currentTheme.glass.border}`,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="space-y-3">
                  {selectedProject.liveUrl && (
                    <button
                      onClick={() =>
                        window.open(selectedProject.liveUrl, '_blank')
                      }
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200"
                      style={{
                        background: '#0078d4',
                        color: '#ffffff',
                      }}
                    >
                      <Play size={18} />
                      <span>View Live</span>
                    </button>
                  )}

                  {selectedProject.githubUrl && (
                    <button
                      onClick={() =>
                        window.open(selectedProject.githubUrl, '_blank')
                      }
                      className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all duration-200"
                      style={{
                        background: currentTheme.glass.cardBackground,
                        color: currentTheme.text.primary,
                        border: `1px solid ${currentTheme.glass.border}`,
                      }}
                    >
                      <Github size={18} />
                      <span>View Code</span>
                    </button>
                  )}
                </div>

                {/* Project Stats */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    background: currentTheme.glass.cardBackground,
                    border: `1px solid ${currentTheme.glass.border}`,
                  }}
                >
                  <h4
                    className="font-semibold mb-3"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Project Stats
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: currentTheme.text.secondary }}>
                        Rating:
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <span style={{ color: currentTheme.text.primary }}>
                          {selectedProject.rating}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: currentTheme.text.secondary }}>
                        Views:
                      </span>
                      <span style={{ color: currentTheme.text.primary }}>
                        {selectedProject.downloads.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: currentTheme.text.secondary }}>
                        Released:
                      </span>
                      <span style={{ color: currentTheme.text.primary }}>
                        {new Date(
                          selectedProject.releaseDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: currentTheme.text.secondary }}>
                        Updated:
                      </span>
                      <span style={{ color: currentTheme.text.primary }}>
                        {new Date(
                          selectedProject.lastUpdated
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h4
                    className="font-semibold mb-3"
                    style={{ color: currentTheme.text.primary }}
                  >
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          background: currentTheme.glass.cardBackground,
                          color: currentTheme.text.secondary,
                          border: `1px solid ${currentTheme.glass.border}`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col"
      style={{ background: currentTheme.background }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: currentTheme.glass.border }}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Code size={18} color="white" />
          </div>
          <h2
            className="text-xl font-bold"
            style={{ color: currentTheme.text.primary }}
          >
            Project Steam
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: currentTheme.text.muted }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md text-sm w-64"
              style={{
                background: currentTheme.glass.cardBackground,
                border: `1px solid ${currentTheme.glass.border}`,
                color: currentTheme.text.primary,
              }}
            />
          </div>

          {/* View Mode Toggle */}
          <div
            className="flex rounded-md overflow-hidden"
            style={{ border: `1px solid ${currentTheme.glass.border}` }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 transition-all duration-200"
              style={{
                background:
                  viewMode === 'grid'
                    ? currentTheme.button.backgroundSelected
                    : currentTheme.glass.cardBackground,
                color:
                  viewMode === 'grid' ? '#ffffff' : currentTheme.text.primary,
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 transition-all duration-200"
              style={{
                background:
                  viewMode === 'list'
                    ? currentTheme.button.backgroundSelected
                    : currentTheme.glass.cardBackground,
                color:
                  viewMode === 'list' ? '#ffffff' : currentTheme.text.primary,
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: currentTheme.glass.border }}
      >
        {[
          { id: 'library', label: 'My Projects', icon: <Code size={16} /> },
          { id: 'store', label: 'Featured', icon: <Star size={16} /> },
          { id: 'community', label: 'About', icon: <Users size={16} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center space-x-2 px-6 py-3 font-medium transition-all duration-200"
            style={{
              color:
                activeTab === tab.id
                  ? currentTheme.text.primary
                  : currentTheme.text.muted,
              borderBottom: activeTab === tab.id ? `2px solid #0078d4` : 'none',
              background:
                activeTab === tab.id
                  ? currentTheme.glass.cardBackground
                  : 'transparent',
            }}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div
        className="flex items-center justify-between p-4 border-b"
        style={{ borderColor: currentTheme.glass.border }}
      >
        <div className="flex items-center space-x-4">
          <span
            className="text-sm font-medium"
            style={{ color: currentTheme.text.primary }}
          >
            Category:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1 rounded text-sm"
            style={{
              background: currentTheme.glass.cardBackground,
              border: `1px solid ${currentTheme.glass.border}`,
              color: currentTheme.text.primary,
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm" style={{ color: currentTheme.text.secondary }}>
          {filteredProjects.length} project
          {filteredProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'library' && (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                  viewMode === 'grid'
                    ? 'rounded-lg overflow-hidden'
                    : 'flex items-center space-x-4 p-4 rounded-lg'
                }`}
                style={{
                  background: currentTheme.glass.cardBackground,
                  border: `1px solid ${currentTheme.glass.border}`,
                }}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      {project.featured && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                          FEATURED
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            background: getStatusColor(project.status),
                            color: '#ffffff',
                          }}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-semibold mb-2"
                        style={{ color: currentTheme.text.primary }}
                      >
                        {project.title}
                      </h3>
                      <p
                        className="text-sm mb-3 line-clamp-2"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star size={14} fill="#fbbf24" color="#fbbf24" />
                          <span
                            className="text-sm"
                            style={{ color: currentTheme.text.primary }}
                          >
                            {project.rating}
                          </span>
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: currentTheme.text.muted }}
                        >
                          {project.category}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-24 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className="font-semibold"
                          style={{ color: currentTheme.text.primary }}
                        >
                          {project.title}
                        </h3>
                        <span
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            background: getStatusColor(project.status),
                            color: '#ffffff',
                          }}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <p
                        className="text-sm mb-2"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star size={14} fill="#fbbf24" color="#fbbf24" />
                            <span
                              className="text-sm"
                              style={{ color: currentTheme.text.primary }}
                            >
                              {project.rating}
                            </span>
                          </div>
                          <span
                            className="text-xs"
                            style={{ color: currentTheme.text.muted }}
                          >
                            {project.category}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 rounded text-xs"
                              style={{
                                background: currentTheme.glass.background,
                                color: currentTheme.text.muted,
                              }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-6">
            <h2
              className="text-2xl font-bold"
              style={{ color: currentTheme.text.primary }}
            >
              Featured Projects
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sampleProjects
                .filter((p) => p.featured)
                .map((project) => (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="cursor-pointer transition-all duration-200 hover:scale-[1.02] rounded-lg overflow-hidden"
                    style={{
                      background: currentTheme.glass.cardBackground,
                      border: `1px solid ${currentTheme.glass.border}`,
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold mb-2"
                        style={{ color: currentTheme.text.primary }}
                      >
                        {project.title}
                      </h3>
                      <p
                        className="mb-4"
                        style={{ color: currentTheme.text.secondary }}
                      >
                        {project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star size={16} fill="#fbbf24" color="#fbbf24" />
                          <span style={{ color: currentTheme.text.primary }}>
                            {project.rating}
                          </span>
                        </div>
                        <span
                          className="px-3 py-1 rounded"
                          style={{
                            background: getStatusColor(project.status),
                            color: '#ffffff',
                          }}
                        >
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <h2
              className="text-2xl font-bold"
              style={{ color: currentTheme.text.primary }}
            >
              About Project Steam
            </h2>
            <div
              className="p-6 rounded-lg"
              style={{
                background: currentTheme.glass.cardBackground,
                border: `1px solid ${currentTheme.glass.border}`,
              }}
            >
              <p
                className="mb-4"
                style={{ color: currentTheme.text.secondary }}
              >
                Welcome to my project showcase! This Steam-inspired interface
                displays my development work, from web applications to mobile
                apps and everything in between.
              </p>
              <p
                className="mb-4"
                style={{ color: currentTheme.text.secondary }}
              >
                Each project represents hours of learning, problem-solving, and
                creative development. Feel free to explore the code, try the
                live demos, and reach out if you have any questions!
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() =>
                    window.open('https://github.com/yourusername', '_blank')
                  }
                  className="flex items-center space-x-2 px-4 py-2 rounded transition-all duration-200"
                  style={{
                    background: currentTheme.button.backgroundSelected,
                    color: '#ffffff',
                  }}
                >
                  <Github size={18} />
                  <span>View GitHub</span>
                </button>
                <button
                  onClick={() =>
                    window.open('https://yourportfolio.com', '_blank')
                  }
                  className="flex items-center space-x-2 px-4 py-2 rounded transition-all duration-200"
                  style={{
                    background: currentTheme.glass.cardBackground,
                    color: currentTheme.text.primary,
                    border: `1px solid ${currentTheme.glass.border}`,
                  }}
                >
                  <Globe size={18} />
                  <span>Visit Portfolio</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SteamApp;
