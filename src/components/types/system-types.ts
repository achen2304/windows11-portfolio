// Define theme type to match theme-provider
export type Theme = 'dark' | 'light';

export interface ThemeObject {
  text: {
    primary: string;
    secondary: string;
    muted: string;
    accent: string;
    [key: string]: string | undefined;
  };
  glass: {
    background: string;
    backgroundDark: string;
    cardBackground: string;
    cardBackgroundDark: string;
    cardHover: string;
    border: string;
    [key: string]: string | undefined;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    [key: string]: string | undefined;
  };
  surface: string;
  background: string;
  border: string;
  borderLight: string;
  [key: string]: unknown;
}

export interface SteamTheme {
  content: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  highlight: string;
  divider: string;
  buttonGradientStart: string;
  buttonGradientEnd: string;
  inputBg: string;
  priceBg: string;
  sidebarHover: string;
  [key: string]: string;
}

export interface SlackTheme {
  background: string;
  sidebarBackground: string;
  sidebarText: string;
  sidebarHover: string;
  sidebarActive: string;
  contentBackground: string;
  messageBackground: string;
  messageHover: string;
  divider: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  mentionBadge: string;
  buttonPrimary: string;
  welcomeBackground: string;
  threadBackground: string;
  searchBackground: string;
  channelActiveBackground: string;
  notification: string;
}
