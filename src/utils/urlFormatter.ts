export const formatUrl = (url: string): string => {
  console.log('urlFormatter: Starting URL formatting for:', url);
  
  if (!url || url.trim() === '') {
    console.error('urlFormatter: Empty or invalid URL provided');
    throw new Error('Invalid URL: URL cannot be empty');
  }
  
  // Remove leading/trailing whitespace
  url = url.trim();
  console.log('urlFormatter: Trimmed URL:', url);
  
  // Check if URL already has a protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log('urlFormatter: URL already has protocol:', url);
    return url;
  }
  
  // Add https:// as default protocol
  const formattedUrl = `https://${url}`;
  console.log('urlFormatter: Formatted URL with HTTPS:', formattedUrl);
  
  // Basic URL validation
  try {
    new URL(formattedUrl);
  } catch (error) {
    console.error('urlFormatter: Invalid URL format:', error);
    throw new Error('Invalid URL format');
  }
  
  return formattedUrl;
};