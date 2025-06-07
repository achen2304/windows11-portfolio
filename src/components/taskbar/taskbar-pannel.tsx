'use client';

import React, { useState } from 'react';
import { useTheme } from '../theme-provider';
import { themes } from '@/lib/themes';
import { StartPanelProps, QuickLink } from './taskbar-types';
import { startPanelApps, getQuickLinks } from '@/data/apps/taskbar-pannel-apps';
import { Search, Power, User, ExternalLink, Copy } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { copyToClipboard } from '@/lib/notification-utils';

const StartPanel: React.FC<StartPanelProps> = ({
  isOpen,
  onClose,
  apps = [],
  quickLinks = [],
  onAppClick = () => {},
  className = '',
}) => {
  const { theme, setTheme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  // Use centralized app data
  const allApps = apps.length > 0 ? apps : startPanelApps;
  const allQuickLinks =
    quickLinks.length > 0 ? quickLinks : getQuickLinks(theme);
  const pinnedApps = allApps.filter((app) => app.isPinned);

  const filteredApps = searchQuery
    ? allApps.filter((app) =>
        app.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pinnedApps;

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
        className={`fixed bottom-14 left-2 z-[200] w-[640px] rounded-lg backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out ${className}`}
        style={{
          background: currentTheme.glass.background,
          border: `1px solid ${currentTheme.glass.border}`,
          WebkitBackdropFilter: 'blur(30px)',
          transform: isOpen ? 'translateY(0)' : 'translateY(calc(100%))',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
      >
        {/* Search Bar */}
        <div className="px-8 pt-8 pb-6">
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
        <div className="px-8">
          {searchQuery ? (
            /* Search Results */
            <div className="mb-6">
              <h3
                style={{ color: currentTheme.text.primary }}
                className="text-sm font-semibold mb-6"
              >
                Search results for "{searchQuery}"
              </h3>
              <div className="grid grid-cols-6 gap-6">
                {filteredApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      onAppClick(app.id);
                      onClose();
                    }}
                    className="flex flex-col items-center p-4 rounded-lg transition-colors duration-200"
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
                      className="w-10 h-10 object-contain mb-3"
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
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    style={{ color: currentTheme.text.primary }}
                    className="text-sm font-semibold"
                  >
                    Pinned
                  </h3>
                </div>
                <div
                  className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6"
                  style={{ minHeight: '160px' }}
                >
                  {pinnedApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        onAppClick(app.id);
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
                      <img
                        src={app.icon}
                        alt={app.name}
                        className="w-10 h-10 object-contain mb-3"
                      />
                      <span className="text-xs text-center font-medium leading-tight">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    style={{ color: currentTheme.text.primary }}
                    className="text-sm font-semibold"
                  >
                    Quick Links
                  </h3>
                </div>
                <div
                  className="grid grid-cols-2 gap-3"
                  style={{ minHeight: '120px' }}
                >
                  {allQuickLinks.slice(0, 6).map((item: QuickLink) => (
                    <button
                      key={item.id}
                      className="flex items-center space-x-3 p-4 rounded-lg text-left transition-colors duration-200 cursor-pointer"
                      style={{
                        backgroundColor: 'transparent',
                        color: currentTheme.text.primary,
                        height: '56px',
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
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="w-10 h-10 object-contain"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
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
          className="px-8 py-4"
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
                <User size={16} style={{ color: currentTheme.text.primary }} />
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
