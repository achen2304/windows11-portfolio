// Generate consistent random color for user avatars
export const generateUserColor = (username: string): string => {
  const colors = [
    '#1d9bf0', // Twitter blue
    '#ff6b6b', // Red
    '#4ecdc4', // Teal
    '#45b7d1', // Light blue
    '#96ceb4', // Mint green
    '#ffa726', // Orange
    '#ab47bc', // Purple
    '#ef5350', // Pink
    '#26a69a', // Dark teal
    '#5c6bc0', // Indigo
    '#42a5f5', // Blue
    '#66bb6a', // Green
    '#ffca28', // Amber
    '#ec407a', // Pink
    '#7e57c2', // Deep purple
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
  });
};
