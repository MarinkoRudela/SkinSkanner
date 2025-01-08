export const formatUrl = (url: string): string => {
  if (!url) return url;
  
  // Remove leading/trailing whitespace
  url = url.trim();
  
  // Check if URL already has a protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Add https:// as default protocol
  return `https://${url}`;
};