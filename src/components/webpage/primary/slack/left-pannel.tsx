import React from 'react';
import { useTheme } from '../../../theme-provider';
import { themes } from '@/lib/themes';
import { SlackTheme } from '@/components/types/system-types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getQuickLinks } from '@/data/apps/taskbar-pannel-apps';
import { ExternalLink, Copy } from 'lucide-react';
import { copyToClipboard } from '@/lib/notification-utils';
import { QuickLink } from '@/components/taskbar/taskbar-types';
import { useToast } from '@/components/ui/toast';

// Type for the channel
type Channel = 'general' | 'skills' | 'experience';

// Props for the LeftPanel component
export interface LeftPanelProps {
  activeChannel: Channel;
  onChannelSelect: (channel: Channel) => void;
  channels: {
    id: Channel;
    name: string;
    notificationCount: number;
  }[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

// Header component
const PanelHeader = ({ slackTheme }: { slackTheme: SlackTheme }) => (
  <div
    className="h-14 flex items-center px-4 border-b"
    style={{
      borderColor: slackTheme.divider,
      background: slackTheme.sidebarBackground,
    }}
  >
    <Image
      src="/app icons/slack.png"
      alt="Slack"
      width={20}
      height={20}
      className="mr-2"
    />
    <span
      className="text-lg font-semibold"
      style={{ color: slackTheme.sidebarText }}
    >
      Slack
    </span>
  </div>
);

// Search component
const SearchBar = ({
  searchQuery,
  onSearchChange,
  slackTheme,
}: {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  slackTheme: SlackTheme;
}) => (
  <motion.div
    className="p-3"
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    style={{ background: slackTheme.sidebarBackground }}
  >
    <div
      className="rounded flex items-center px-2 py-1 transition-all duration-300"
      style={{
        background: slackTheme.searchBackground,
        boxShadow: searchQuery ? `0 1px 4px ${slackTheme.divider}` : 'none',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: slackTheme.textSecondary }}
        className="opacity-70"
      >
        <path
          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <input
        type="text"
        placeholder="Search channels"
        className="ml-2 bg-transparent w-full outline-none text-sm transition-all duration-300"
        style={{ color: slackTheme.textSecondary }}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  </motion.div>
);

// Channel item component
const ChannelItem = ({
  channel,
  isActive,
  onClick,
  slackTheme,
  index,
}: {
  channel: LeftPanelProps['channels'][0];
  isActive: boolean;
  onClick: () => void;
  slackTheme: SlackTheme;
  index: number;
}) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{
      duration: 0.3,
      ease: 'easeOut',
      delay: index * 0.05, // Staggered animation
    }}
    whileHover={{
      scale: 1.02,
      transition: { duration: 0.2 },
    }}
    whileTap={{ scale: 0.98 }}
    className={`
      flex items-center justify-between py-1 px-2 rounded cursor-pointer
      ${isActive ? 'font-medium' : ''}
    `}
    style={{
      background: isActive ? slackTheme.sidebarActive : 'transparent',
      color: isActive ? '#FFFFFF' : slackTheme.sidebarText,
    }}
    onClick={onClick}
  >
    <div className="flex items-center">
      <span className="mr-2 opacity-70">#</span>
      <span>{channel.name}</span>
    </div>
    {channel.notificationCount > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-xs font-medium px-1.5 py-0.5 rounded-full"
        style={{ background: slackTheme.notification }}
      >
        {channel.notificationCount}
      </motion.span>
    )}
  </motion.li>
);

// Quick link item component
const QuickLinkItem = ({
  item,
  slackTheme,
  index,
}: {
  item: QuickLink;
  slackTheme: SlackTheme;
  index: number;
}) => {
  const { addToast } = useToast();

  const handleLinkClick = async () => {
    if (item.url) {
      if (item.type === 'copy' && item.url.startsWith('mailto:')) {
        // Extract email from mailto: link and copy to clipboard
        const email = item.url.replace('mailto:', '');
        await copyToClipboard(email, 'Email copied!', addToast);
      } else if (item.newTab === true) {
        window.open(item.url, '_blank');
      } else {
        window.location.href = item.url;
      }
    }
  };

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
        delay: index * 0.05, // Staggered animation
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
        background: slackTheme.sidebarHover,
      }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between py-2 px-2 rounded cursor-pointer mb-1"
      style={{
        color: slackTheme.sidebarText,
        background: 'transparent',
      }}
      onClick={handleLinkClick}
    >
      <div className="flex items-center space-x-2">
        {item.icon && (
          <div className="w-5 h-5 flex items-center justify-center">
            <Image
              src={item.icon}
              alt={item.name}
              width={16}
              height={16}
              className="object-contain"
            />
          </div>
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      <div className="flex items-center space-x-1 text-xs opacity-70">
        <span>{item.type === 'copy' ? 'Copy' : 'Link'}</span>
        {item.type === 'copy' ? <Copy size={12} /> : <ExternalLink size={12} />}
      </div>
    </motion.li>
  );
};

// Channel List component
const ChannelList = ({
  channels,
  activeChannel,
  onChannelSelect,
  slackTheme,
}: {
  channels: LeftPanelProps['channels'];
  activeChannel: Channel;
  onChannelSelect: (channel: Channel) => void;
  slackTheme: SlackTheme;
}) => (
  <div
    className="p-3 pt-0"
    style={{
      color: slackTheme.sidebarText,
      background: slackTheme.sidebarBackground,
    }}
  >
    <motion.div
      className="flex items-center mb-2 mt-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 opacity-70 mr-1"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clipRule="evenodd"
        />
      </svg>
      <span className="text-sm font-medium">Channels</span>
    </motion.div>

    {channels.length === 0 ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-sm opacity-70 px-4 py-2"
      >
        No channels found
      </motion.div>
    ) : (
      <ul>
        {channels.map((channel, index) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isActive={activeChannel === channel.id}
            onClick={() => onChannelSelect(channel.id)}
            slackTheme={slackTheme}
            index={index}
          />
        ))}
      </ul>
    )}
  </div>
);

// Quick Links component
const QuickLinks = ({ slackTheme }: { slackTheme: SlackTheme }) => {
  const { theme } = useTheme();
  const quickLinks = getQuickLinks(theme);

  return (
    <div
      className="p-3 pt-0"
      style={{
        color: slackTheme.sidebarText,
        background: slackTheme.sidebarBackground,
      }}
    >
      <motion.div
        className="flex items-center mb-2 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 opacity-70 mr-1"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">Quick Links</span>
      </motion.div>

      <ul>
        {quickLinks.map((item, index) => (
          <QuickLinkItem
            key={item.id}
            item={item}
            slackTheme={slackTheme}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

// Main Left Panel component
const LeftPanel: React.FC<LeftPanelProps> = ({
  activeChannel,
  onChannelSelect,
  channels,
  searchQuery,
  onSearchChange,
}) => {
  const { theme } = useTheme();
  const currentTheme = themes[theme as keyof typeof themes];
  const slackTheme = currentTheme.slack as SlackTheme;

  return (
    <motion.div
      className="flex flex-col h-full overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ background: slackTheme.sidebarBackground }}
    >
      <PanelHeader slackTheme={slackTheme} />
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        slackTheme={slackTheme}
      />
      <ChannelList
        channels={channels}
        activeChannel={activeChannel}
        onChannelSelect={onChannelSelect}
        slackTheme={slackTheme}
      />
      <QuickLinks slackTheme={slackTheme} />
    </motion.div>
  );
};

export default LeftPanel;
