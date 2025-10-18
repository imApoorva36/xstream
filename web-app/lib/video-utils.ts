/**
 * Video utility functions for handling database/API data
 */

/**
 * Format duration from seconds (number) to MM:SS string
 */
export function formatDuration(durationInSeconds: number): string {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Parse duration from string (MM:SS) to seconds (number)
 * Handles both string and number inputs for backwards compatibility
 */
export function parseDuration(duration: string | number): number {
  if (typeof duration === 'number') {
    return duration;
  }
  const [minutes, seconds] = duration.split(':').map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

/**
 * Format relative time from date
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = typeof date === 'string' ? new Date(date) : date;
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'Just now';
}

/**
 * Get placeholder image URL for video thumbnails
 */
export function getPlaceholderImage(category?: string): string {
  const placeholders: Record<string, string> = {
    Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=360&fit=crop',
    Technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&h=360&fit=crop',
    Web3: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=640&h=360&fit=crop',
    Gaming: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=640&h=360&fit=crop',
    Finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=640&h=360&fit=crop',
    Entertainment: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=640&h=360&fit=crop',
    Music: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop',
    Business: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=640&h=360&fit=crop',
    default: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=640&h=360&fit=crop'
  };
  
  return placeholders[category || 'default'] || placeholders.default;
}

/**
 * Get placeholder profile image
 */
export function getPlaceholderProfile(name?: string): string {
  // Use UI Avatars API for consistent profile images
  const displayName = name || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=128`;
}

/**
 * Format creator name from creator object or string
 */
export function formatCreatorName(creator: any): string {
  if (typeof creator === 'string') {
    return creator;
  }
  if (creator?.displayName) return creator.displayName;
  if (creator?.username) return creator.username;
  if (creator?.walletAddress) {
    return `${creator.walletAddress.slice(0, 6)}...${creator.walletAddress.slice(-4)}`;
  }
  return 'Unknown Creator';
}
