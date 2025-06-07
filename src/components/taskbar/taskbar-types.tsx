export interface TaskbarApp {
  id: string;
  name: string;
  icon: string;
}

export interface StartApp {
  id: string;
  name: string;
  icon: string;
  category?: string;
  isPinned?: boolean;
  description?: string;
}

export interface QuickLink {
  id: string;
  name: string;
  newTab?: boolean;
  type?: 'link' | 'copy';
  url?: string;
  icon?: string;
}

export interface SystemTrayItem {
  id: string;
  icon: React.ReactNode;
  tooltip: string;
  isActive?: boolean;
  hasNotification?: boolean;
}

export interface WifiNetwork {
  ssid: string;
  signalStrength: number;
  isSecured: boolean;
  isConnected?: boolean;
}

export interface AudioDevice {
  id: string;
  name: string;
  type: 'speaker' | 'headphone' | 'microphone';
  isDefault?: boolean;
  volume?: number;
}

export interface BatteryInfo {
  percentage: number;
  isCharging: boolean;
  timeRemaining?: string;
  powerMode: 'battery-saver' | 'balanced' | 'performance';
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  location?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  app: string;
  isRead?: boolean;
  priority: 'low' | 'normal' | 'high';
}

export interface TaskbarProps {
  apps?: TaskbarApp[];
  onAppClick?: (appId: string) => void;
  onStartClick?: () => void;
  className?: string;
}

export interface StartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  apps?: StartApp[];
  quickLinks?: QuickLink[];
  onAppClick?: (appId: string) => void;
  className?: string;
}

export interface RightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCalendarClick?: () => void;
  onNotificationClick?: () => void;
  className?: string;
}

export interface CalendarPanelProps {
  isOpen: boolean;
  onClose: () => void;
  events?: CalendarEvent[];
  notifications?: NotificationItem[];
  onEventClick?: (eventId: string) => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export interface SystemPanelProps {
  isOpen: boolean;
  onClose: () => void;
  wifiNetworks?: WifiNetwork[];
  audioDevices?: AudioDevice[];
  batteryInfo?: BatteryInfo;
  onWifiConnect?: (ssid: string) => void;
  onAudioDeviceSelect?: (deviceId: string) => void;
  onVolumeChange?: (volume: number) => void;
  className?: string;
}

export type PanelType =
  | 'start'
  | 'calendar'
  | 'system'
  | 'notifications'
  | null;
