'use client';

import React, { useState } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { StartPanelProps, StartApp, RecentItem } from './taskbar-types';
import {
  Search,
  Settings,
  Power,
  User,
  Folder,
  FileText,
  Star,
  X,
} from 'lucide-react';

const StartPanel: React.FC<StartPanelProps> = ({
  isOpen,
  onClose,
  apps = [],
  recentItems = [],
  onAppClick = () => {},
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];

  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<
    'pinned' | 'all' | 'recent'
  >('pinned');

  const defaultApps: StartApp[] = [
    {
      id: 'edge',
      name: 'Microsoft Edge',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Microsoft_Edge_logo_%282019%29.svg/64px-Microsoft_Edge_logo_%282019%29.svg.png',
      isPinned: true,
      category: 'Web Browser',
    },
    {
      id: 'word',
      name: 'Microsoft Word',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Microsoft_Office_Word_%282019–present%29.svg/64px-Microsoft_Office_Word_%282019–present%29.svg.png',
      isPinned: true,
      category: 'Productivity',
    },
    {
      id: 'excel',
      name: 'Microsoft Excel',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019–present%29.svg/64px-Microsoft_Office_Excel_%282019–present%29.svg.png',
      isPinned: true,
      category: 'Productivity',
    },
    {
      id: 'powerpoint',
      name: 'PowerPoint',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Microsoft_Office_PowerPoint_%282019–present%29.svg/64px-Microsoft_Office_PowerPoint_%282019–present%29.svg.png',
      isPinned: true,
      category: 'Productivity',
    },
    {
      id: 'code',
      name: 'Visual Studio Code',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/64px-Visual_Studio_Code_1.35_icon.svg.png',
      isPinned: true,
      category: 'Development',
    },
    {
      id: 'calculator',
      name: 'Calculator',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Calculator_icon.svg/64px-Calculator_icon.svg.png',
      isPinned: true,
      category: 'Utilities',
    },
    {
      id: 'notepad',
      name: 'Notepad',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Notepad_icon.svg/64px-Notepad_icon.svg.png',
      category: 'Utilities',
    },
    {
      id: 'paint',
      name: 'Paint',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Microsoft_Paint_Logo.svg/64px-Microsoft_Paint_Logo.svg.png',
      category: 'Graphics',
    },
  ];

  const defaultRecentItems: RecentItem[] = [
    {
      id: 'doc1',
      name: 'Portfolio Draft.docx',
      type: 'file',
      path: 'Documents',
      lastAccessed: new Date(),
    },
    {
      id: 'img1',
      name: 'Project Screenshots',
      type: 'folder',
      path: 'Pictures',
      lastAccessed: new Date(),
    },
    {
      id: 'pdf1',
      name: 'Resume.pdf',
      type: 'file',
      path: 'Documents',
      lastAccessed: new Date(),
    },
    {
      id: 'xlsx1',
      name: 'Budget 2024.xlsx',
      type: 'file',
      path: 'Documents',
      lastAccessed: new Date(Date.now() - 86400000), // 1 day ago
    },
  ];

  const allApps = apps.length > 0 ? apps : defaultApps;
  const allRecentItems =
    recentItems.length > 0 ? recentItems : defaultRecentItems;
  const pinnedApps = allApps.filter((app) => app.isPinned);

  const filteredApps = searchQuery
    ? allApps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeSection === 'pinned'
    ? pinnedApps
    : allApps;

  const getFileIcon = (type: 'file' | 'folder') => {
    switch (type) {
      case 'folder':
        return <Folder size={20} />;
      case 'file':
        return <FileText size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  // Reusable hover methods
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor =
      theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  return (
    <>
      {/* Start Panel */}
      <div
        className={`fixed bottom-12 left-2 z-[110] w-96 h-[600px] rounded-lg backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out ${className}`}
        style={{
          background:
            theme === 'dark'
              ? 'rgba(32, 32, 32, 0.95)'
              : 'rgba(248, 248, 248, 0.95)',
          border: `1px solid ${currentTheme.glass.border}`,
          WebkitBackdropFilter: 'blur(30px)',
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="p-4 border-b"
          style={{ borderColor: currentTheme.glass.border }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    theme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                }}
              >
                <User size={20} style={{ color: currentTheme.text.primary }} />
              </div>
              <div>
                <div
                  style={{ color: currentTheme.text.primary }}
                  className="font-medium"
                >
                  User
                </div>
                <div
                  style={{ color: currentTheme.text.muted }}
                  className="text-sm"
                >
                  user@portfolio
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-opacity-10 transition-colors duration-200"
              style={{ color: currentTheme.text.muted }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Universal Search */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              style={{ color: currentTheme.text.muted }}
            />
            <input
              type="text"
              placeholder="Type here to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md text-sm transition-colors duration-200"
              style={{
                backgroundColor:
                  theme === 'dark'
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.1)',
                border: `1px solid ${currentTheme.glass.border}`,
                color: currentTheme.text.primary,
              }}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        {!searchQuery && (
          <div
            className="flex border-b"
            style={{ borderColor: currentTheme.glass.border }}
          >
            {[
              { id: 'pinned', label: 'Pinned', icon: <Star size={16} /> },
              { id: 'all', label: 'All apps', icon: null },
              { id: 'recent', label: 'Recent', icon: null },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className="flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors duration-200"
                style={{
                  color:
                    activeSection === tab.id
                      ? currentTheme.text.primary
                      : currentTheme.text.muted,
                  backgroundColor:
                    activeSection === tab.id
                      ? theme === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                  borderBottom:
                    activeSection === tab.id
                      ? `2px solid ${currentTheme.text.primary}`
                      : 'none',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeSection === 'recent' && !searchQuery ? (
            /* Recent Items */
            <div>
              <h3
                style={{ color: currentTheme.text.primary }}
                className="text-sm font-semibold mb-3"
              >
                Recent
              </h3>
              <div className="space-y-2">
                {allRecentItems.map((item) => (
                  <button
                    key={item.id}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200"
                    style={{
                      backgroundColor: 'transparent',
                      color: currentTheme.text.primary,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div style={{ color: currentTheme.text.muted }}>
                      {getFileIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{item.name}</div>
                      <div
                        className="text-xs truncate"
                        style={{ color: currentTheme.text.muted }}
                      >
                        {item.path}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Apps Grid */
            <div>
              {searchQuery && (
                <h3
                  style={{ color: currentTheme.text.primary }}
                  className="text-sm font-semibold mb-3"
                >
                  Search results for "{searchQuery}"
                </h3>
              )}
              <div className="grid grid-cols-4 gap-3">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onAppClick(app.id);
                      onClose();
                    }}
                    className="flex flex-col items-center p-3 rounded-lg transition-colors duration-200"
                    style={{
                      backgroundColor: 'transparent',
                      color: currentTheme.text.primary,
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-8 h-8 object-contain mb-2"
                    />
                    <span className="text-xs text-center font-medium leading-tight">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-4 border-t flex items-center justify-between"
          style={{ borderColor: currentTheme.glass.border }}
        >
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200"
            style={{ color: currentTheme.text.primary }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Settings size={16} />
            <span className="text-sm">Settings</span>
          </button>

          <button
            className="flex items-center space-x-2 px-3 py-2 rounded-md transition-colors duration-200"
            style={{ color: currentTheme.text.primary }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Power size={16} />
            <span className="text-sm">Power</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default StartPanel;
