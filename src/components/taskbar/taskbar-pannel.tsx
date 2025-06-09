'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { StartPanelProps, QuickLink } from './taskbar-types';
import { startPanelApps, getQuickLinks } from '@/data/apps/taskbar-pannel-apps';
import { Search, Power, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { copyToClipboard } from '@/lib/notification-utils';
import { useWindowManager } from '../webpage/window-manager';
import { handleAppClick } from '@/lib/window-utils';
import Image from 'next/image';

const StartPanel: React.FC<StartPanelProps> = ({
  isOpen,
  onClose,
  apps = [],
  quickLinks = [],
  onAppClick = () => {},
  className = '',
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { addToast } = useToast();
  const { windows, focusWindow, minimizeWindow } = useWindowManager();

  const [searchQuery, setSearchQuery] = useState('');
  const [maxPanelHeight, setMaxPanelHeight] = useState('80vh');

  // Set max height based on window size
  useEffect(() => {
    const updateMaxHeight = () => {
      // Calculate max height based on viewport height, leaving space for taskbar
      const maxHeight = Math.min(window.innerHeight - 60, 700); // 60px for taskbar, max 700px
      setMaxPanelHeight(`${maxHeight}px`);
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  // Use centralized app data
  const allApps = apps.length > 0 ? apps : startPanelApps;
  const allQuickLinks =
    quickLinks.length > 0 ? quickLinks : getQuickLinks(theme);
  const pinnedApps = allApps.filter((app) => app.isPinned);

  const filteredApps = searchQuery
    ? allApps.filter((app) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        // Split app name into words and check if any word starts with the query
        const nameWords = app.name.toLowerCase().split(/\s+/);
        return nameWords.some((word) => word.startsWith(query));
      })
    : pinnedApps;

  // Reusable hover methods
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor =
      theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  };

  // Handle start panel app click - focus if open, otherwise open new
  const handleStartPanelAppClick = (appId: string) => {
    // Use the centralized utility function
    handleAppClick(appId, windows, focusWindow, minimizeWindow, onAppClick);
  };

  return (
    <>
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.2)'
            : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: background 0.2s ease;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.35)'
            : 'rgba(0, 0, 0, 0.35)'};
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(0, 0, 0, 0.5)'};
          background-clip: content-box;
        }

        .custom-scrollbar::-webkit-scrollbar-corner {
          background: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.05)'};
        }

        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${theme === 'dark'
            ? 'rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)'};
        }
      `}</style>

      {/* Start Panel */}
      <div
        className={`fixed bottom-14 left-2 z-[200] w-[520px] max-w-[90vw] rounded-lg backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out custom-scrollbar ${className}`}
        style={{
          background: currentTheme.glass.background,
          border: `1px solid ${currentTheme.glass.border}`,
          WebkitBackdropFilter: 'blur(30px)',
          transform: isOpen ? 'translateY(0)' : 'translateY(calc(100%))',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
          maxHeight: maxPanelHeight,
          overflowY: 'auto',
        }}
      >
        {/* Search Bar */}
        <div className="px-4 sm:px-8 pt-4 sm:pt-8 pb-3 sm:pb-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2"
              style={{ color: currentTheme.text.muted }}
            />
            <input
              type="text"
              placeholder="Search for apps, settings, and documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-md text-sm transition-colors duration-200"
              style={{
                backgroundColor: currentTheme.glass.cardBackground,
                border: `1px solid ${currentTheme.glass.border}`,
                color: currentTheme.text.primary,
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="px-4 sm:px-8">
          {searchQuery ? (
            /* Search Results */
            <div className="mb-3 sm:mb-6">
              <h3
                style={{ color: currentTheme.text.primary }}
                className="text-sm font-semibold mb-3 sm:mb-6"
              >
                Search results for &quot;{searchQuery}&quot;
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-6">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      handleStartPanelAppClick(app.id);
                      onClose();
                    }}
                    className="flex flex-col items-center p-4 rounded-lg transition-colors duration-200"
                    style={{
                      backgroundColor: 'transparent',
                      color: currentTheme.text.primary,
                      height: '100px',
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src={app.icon}
                      alt={app.name}
                      className="w-6 h-6 sm:w-8 sm:h-8 object-contain mb-3"
                      width={32}
                      height={32}
                    />
                    <span className="text-xs text-center font-medium leading-tight">
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Pinned Section */}
              <div className="mb-3 sm:mb-6">
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <h3
                    style={{ color: currentTheme.text.primary }}
                    className="text-sm font-semibold"
                  >
                    All Apps
                  </h3>
                </div>
                <div
                  className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-6"
                  style={{ minHeight: '140px' }}
                >
                  {pinnedApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        handleStartPanelAppClick(app.id);
                        onClose();
                      }}
                      className="flex flex-col items-center p-2 sm:p-4 rounded-lg transition-colors duration-200"
                      style={{
                        backgroundColor: 'transparent',
                        color: currentTheme.text.primary,
                        height: '80px',
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image
                        src={
                          theme === 'dark' && app.iconLight !== undefined
                            ? app.icon || '/app icons/quick links/default.svg'
                            : app.iconLight ||
                              app.icon ||
                              '/app icons/quick links/default.svg'
                        }
                        alt={app.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain mb-2 sm:mb-3"
                        width={32}
                        height={32}
                      />
                      <span className="text-xs text-center font-medium leading-tight">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links Section */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-6">
                  <h3
                    style={{ color: currentTheme.text.primary }}
                    className="text-sm font-semibold"
                  >
                    Quick Links
                  </h3>
                </div>
                <div
                  className="grid grid-cols-3 gap-2 sm:gap-3"
                  style={{ minHeight: '100px' }}
                >
                  {allQuickLinks.slice(0, 6).map((item: QuickLink) => (
                    <button
                      key={item.id}
                      className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-4 px-4 rounded-lg text-left transition-colors duration-200 cursor-pointer"
                      style={{
                        backgroundColor: 'transparent',
                        color: currentTheme.text.primary,
                        height: '48px',
                      }}
                      onClick={async () => {
                        if (item.url) {
                          if (
                            item.type === 'copy' &&
                            item.url &&
                            item.url.startsWith('mailto:')
                          ) {
                            // Extract email from mailto: link and copy to clipboard
                            const email = item.url.replace('mailto:', '');
                            const success = await copyToClipboard(
                              email,
                              'Email copied!',
                              addToast
                            );

                            if (!success) {
                              // Fallback to opening in mail client
                              if (item.url) window.location.href = item.url;
                            }
                          } else if (item.newTab === true) {
                            window.open(item.url, '_blank');
                          } else {
                            window.location.href = item.url;
                          }
                        }
                      }}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Image
                        src={
                          theme === 'dark' && item.iconLight !== undefined
                            ? item.icon || '/app icons/quick links/default.svg'
                            : item.iconLight ||
                              item.icon ||
                              '/app icons/quick links/default.svg'
                        }
                        alt={item.name}
                        className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                        width={32}
                        height={32}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-small truncate">
                          {item.name}
                        </div>
                        <div
                          className="text-xs truncate flex items-center space-x-1"
                          style={{ color: currentTheme.text.muted }}
                        >
                          <span>
                            {item.type === 'copy' ? 'Copy' : 'New Tab'}
                          </span>
                          {item.type === 'copy' ? (
                            <Copy size={10} />
                          ) : (
                            <ExternalLink size={10} />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="border-b border-gray-600"></div>

        {/* Profile Footer */}
        <div
          className="px-4 sm:px-8 py-2 "
          style={{ background: currentTheme.glass.backgroundDark }}
        >
          <div className="flex items-center justify-between">
            <button
              className="flex items-center space-x-3 p-2 rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                backgroundColor: 'transparent',
                color: currentTheme.text.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentTheme.glass.cardBackground;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: currentTheme.glass.cardBackground,
                  border: `1px solid ${currentTheme.glass.border}`,
                }}
              >
                <Image
                  src="/other/profile.png"
                  alt="Profile"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                  width={32}
                  height={32}
                />
              </div>
              <span className="text-sm font-medium">Profile</span>
            </button>

            <button
              className="flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200 hover:scale-[1.02] active:scale-95"
              style={{
                color: currentTheme.text.primary,
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  currentTheme.glass.cardBackground;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              title="Power options"
            >
              <Power size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartPanel;
