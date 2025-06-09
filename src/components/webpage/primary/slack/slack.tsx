'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import {
  NavigationProvider,
  useNavigation,
} from '@/components/webpage/chevron-button';
import {
  WindowSizeProvider,
  useWindowSize,
} from '@/components/webpage/breakpoints';
import { SlackTheme } from '@/components/types/system-types';
import LeftPanel from './left-pannel';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

// Type for the channel
type Channel = 'general' | 'skills' | 'experience' | 'portfolio';

// Channel configuration
const CHANNELS = [
  {
    id: 'general' as Channel,
    name: 'general',
    notificationCount: 0,
  },
  {
    id: 'skills' as Channel,
    name: 'skills',
    notificationCount: 0,
  },
  {
    id: 'experience' as Channel,
    name: 'experience',
    notificationCount: 0,
  },
  {
    id: 'portfolio' as Channel,
    name: 'portfolio',
    notificationCount: 0,
  },
];

// Dynamically import channel components
const ChannelComponents = {
  general: dynamic(() => import('./general/general'), { ssr: false }),
  skills: dynamic(() => import('./skills/skills'), { ssr: false }),
  experience: dynamic(() => import('./experience/experience'), { ssr: false }),
  portfolio: dynamic(() => import('./portfolio/portfolio'), { ssr: false }),
};

// Channel Header Component
const ChannelHeader = ({
  activeChannel,
  slackTheme,
  onBackClick = undefined,
}: {
  activeChannel: Channel;
  slackTheme: SlackTheme;
  onBackClick?: () => void;
}) => (
  <div
    className="h-14 flex items-center px-4 border-b border-solid"
    style={{
      background: slackTheme.contentBackground,
      borderColor: slackTheme.divider,
      borderBottomWidth: '1px',
      marginBottom: 0,
      paddingBottom: 0,
    }}
  >
    {onBackClick && (
      <button
        className="mr-3 text-lg flex items-center"
        onClick={onBackClick}
        style={{ color: slackTheme.textPrimary }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 19L8 12L15 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    )}
    <div className="flex flex-col">
      <span
        className="text-lg font-medium"
        style={{ color: slackTheme.textPrimary }}
      >
        #{activeChannel}
      </span>
    </div>
  </div>
);

// Message Input Component (disabled)
const DisabledMessageInput = ({ slackTheme }: { slackTheme: SlackTheme }) => (
  <div
    className="p-3 border-t"
    style={{
      background: slackTheme.contentBackground,
      borderColor: slackTheme.divider,
    }}
  >
    <div
      className="flex items-center p-2 rounded"
      style={{ background: slackTheme.messageBackground }}
    >
      <div
        className="flex-1 text-sm italic px-2 opacity-70 cursor-not-allowed"
        style={{ color: slackTheme.textSecondary }}
      >
        You don&apos;t have permission to write in this channel
      </div>
      <button
        className="ml-2 p-1 rounded opacity-50 cursor-not-allowed"
        style={{ color: slackTheme.textPrimary }}
        disabled
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
);

// Channel Content Component
const ChannelContent = ({
  activeChannel,
  slackTheme,
}: {
  activeChannel: Channel;
  slackTheme: SlackTheme;
}) => {
  const ChannelComponent = ChannelComponents[activeChannel];

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ background: slackTheme.contentBackground }}
    >
      <ChannelComponent />
    </div>
  );
};

// Main content component
const SlackContent: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;
  const { navigate, getCurrentState } = useNavigation();
  const { isXs, isSm, isMd } = useWindowSize();

  // Active channel state
  const [activeChannel, setActiveChannel] = useState<Channel>('general');

  // Mobile view state
  const [showChannelOnMobile, setShowChannelOnMobile] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredChannels, setFilteredChannels] = useState(CHANNELS);

  // Check if we're on a mobile device
  const isMobile = isXs || isSm || isMd;

  // Effect to handle search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChannels(CHANNELS);
      return;
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const filtered = CHANNELS.filter((channel) =>
      channel.name.toLowerCase().startsWith(trimmedQuery)
    );

    setFilteredChannels(filtered);
  }, [searchQuery]);

  // Effect to handle navigation state
  useEffect(() => {
    const currentState = getCurrentState();

    if (!currentState) {
      navigate('slack-app', { channel: 'general' });
    } else if (currentState.data?.channel) {
      setActiveChannel(currentState.data.channel as Channel);

      if (isMobile) {
        setShowChannelOnMobile(true);
      }
    }
  }, [navigate, getCurrentState, isMobile]);

  // Handle channel change
  const handleChannelChange = (channel: Channel) => {
    if (activeChannel !== channel) {
      setActiveChannel(channel);
      navigate('slack-app', { channel });

      if (isMobile) {
        setShowChannelOnMobile(true);
      }
    }
  };

  return (
    <div className="h-full flex" style={{ background: slackTheme.background }}>
      {/* Mobile View */}
      {isMobile && (
        <AnimatePresence mode="wait" initial={false}>
          {showChannelOnMobile ? (
            <motion.div
              key="channel-content"
              className="flex-1 flex flex-col h-full overflow-hidden w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChannelHeader
                activeChannel={activeChannel}
                slackTheme={slackTheme}
                onBackClick={() => setShowChannelOnMobile(false)}
              />
              <ChannelContent
                activeChannel={activeChannel}
                slackTheme={slackTheme}
              />
              <DisabledMessageInput slackTheme={slackTheme} />
            </motion.div>
          ) : (
            <motion.div
              key="left-panel"
              className="flex-1 h-full w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LeftPanel
                activeChannel={activeChannel}
                onChannelSelect={handleChannelChange}
                channels={filteredChannels}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <>
          <div
            className="w-64 flex-shrink-0 flex flex-col h-full border-r"
            style={{
              background: slackTheme.sidebarBackground,
              borderColor: slackTheme.divider,
            }}
          >
            <LeftPanel
              activeChannel={activeChannel}
              onChannelSelect={handleChannelChange}
              channels={filteredChannels}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <ChannelHeader
              activeChannel={activeChannel}
              slackTheme={slackTheme}
            />
            <ChannelContent
              activeChannel={activeChannel}
              slackTheme={slackTheme}
            />
            <DisabledMessageInput slackTheme={slackTheme} />
          </div>
        </>
      )}
    </div>
  );
};

// Wrapper with window size provider
const SlackAppContent: React.FC = () => {
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="h-full flex flex-col">
      <WindowSizeProvider containerRef={contentRef}>
        <SlackContent />
      </WindowSizeProvider>
    </div>
  );
};

// Wrapper with navigation provider
const SlackApp: React.FC = () => {
  return (
    <NavigationProvider>
      <SlackAppContent />
    </NavigationProvider>
  );
};

export default SlackApp;
