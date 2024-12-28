import { supabase } from './supabaseClient';

export async function verifyImageUrl(url) {
  if (!url) return false;
  
  try {
    // Check if the URL is from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url.includes(supabaseUrl)) return false;

    // Extract the path from the URL, ignoring query parameters
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const bucket = pathParts[2]; // After /storage/v1/object/public/
    const filePath = pathParts.slice(3).join('/');

    // Verify the file exists in Supabase
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .download(filePath);

    if (error) {
      console.error('Error verifying image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error processing image URL:', error);
    return false;
  }
}

export function getImageUrl(path) {
  if (!path) return '';
  
  // If it's already a full URL (including Supabase URL), return it as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // If it's a path, construct the Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fullPath = `${supabaseUrl}/storage/v1/object/public/${path}`;
  
  // Get the current timestamp
  const timestamp = new Date().toISOString();
  
  // Add timestamp parameter to prevent caching issues
  return `${fullPath}?t=${encodeURIComponent(timestamp)}`;
}

export function handleImageError(e) {
  const img = e.target;
  img.onerror = null; // Prevent infinite loop
  img.src = '/placeholder-image.jpg'; // Replace with your placeholder image path
  console.error('Image failed to load:', img.src);
}

// Helper function to extract base path from Supabase URL
export function extractSupabasePath(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Get parts after 'public/'
    const relevantParts = pathParts.slice(pathParts.indexOf('public') + 1);
    return relevantParts.join('/');
  } catch (error) {
    console.error('Error extracting Supabase path:', error);
    return null;
  }
}
export { supabase };

