// Define theme type to match theme-provider
export type Theme = 'dark' | 'light';

// Universal theme object with optional properties for flexibility
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

// Steam app specific theme properties
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
