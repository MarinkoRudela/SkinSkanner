export const formatUrl = (url: string): string => {
  if (!url) {
    console.error('Received empty URL to format');
    return '#';
  }
  
  // Remove leading/trailing whitespace
  url = url.trim();
  
  // Log the URL being formatted
  console.log('Formatting URL:', url);
  
  // Check if URL already has a protocol
  if (url.startsWith('http://') || url.startsWith('https://')) {
    console.log('URL already has protocol:', url);
    return url;
  }
  
  // Add https:// as default protocol
  const formattedUrl = `https://${url}`;
  console.log('Formatted URL:', formattedUrl);
  return formattedUrl;
};