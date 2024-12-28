import { supabase } from './supabaseClient';

type ImageType = 'logo' | 'cover' | 'gallery' | 'founder';

export async function uploadBrandImage(
  file: File,
  type: ImageType,
  brandName: string
): Promise<{ url: string; path: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const safeBrandName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `${type}/${safeBrandName}-${Date.now()}.${fileExt}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('brand-assets')
      .upload(filename, file);

    if (error) {
      throw error;
    }

    // Get both the public URL and the relative path
    const { data: { publicUrl } } = supabase.storage
      .from('brand-assets')
      .getPublicUrl(filename);

    return {
      url: publicUrl,
      path: `brand-assets/${filename}` // Store this in Airtable for consistency
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
