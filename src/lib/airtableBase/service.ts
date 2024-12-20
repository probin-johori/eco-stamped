import { airtableBase, AIRTABLE_CONFIG } from './config';
import { 
  type SustainableBrand, 
  SustainableFeature, 
  Marketplace,
  Category,
  Certification 
} from '@/lib/brands';
import type { FieldSet, Attachment } from 'airtable';

// Update AIRTABLE_TABLES in config.ts
const TABLES = {
  BRANDS: AIRTABLE_CONFIG.tables.BRANDS,
  RETAILERS: 'tblbobbpQEss4b0Zm'
};

interface RetailerInfo {
  id: string;
  name: Marketplace;
  logo: string;
  website: string;
}

// Helper functions for mapping Airtable values to enums
const mapAirtableToCertification = (value: string): Certification => {
  // Direct mapping - value should exactly match enum values
  const certificationValue = Object.values(Certification).find(cert => cert === value);
  
  if (!certificationValue) {
    console.warn(`Unknown certification value: ${value}`);
    return Certification.ORGANIC;
  }
  
  return certificationValue;
};

const mapAirtableToCategory = (value: string): Category => {
  const categoryValue = Object.values(Category).find(cat => cat === value);
  
  if (!categoryValue) {
    console.warn(`Unknown category value: ${value}`);
    return Category.CLOTHING;
  }
  
  return categoryValue;
};

export class AirtableService {
  static async fetchRetailers(): Promise<RetailerInfo[]> {
    try {
      console.log('Fetching retailers from table:', TABLES.RETAILERS);
      const table = airtableBase(TABLES.RETAILERS);
      const records = await table.select().all();

      console.log('Found retailers:', records.length);

      const retailers = records.map(record => {
        const retailerInfo = {
          id: record.id,
          name: record.fields.Name as Marketplace,
          logo: (record.fields.Logo as unknown as Attachment[])?.[0]?.url || '',
          website: record.fields.Website as string
        };

        console.log('Processed retailer:', {
          id: retailerInfo.id,
          name: retailerInfo.name,
          hasLogo: !!retailerInfo.logo
        });

        return retailerInfo;
      });

      return retailers;
    } catch (error) {
      console.error('Error fetching retailers:', error);
      return [];
    }
  }

  static async fetchAllBrands(): Promise<SustainableBrand[]> {
    try {
      // Validate configuration
      if (!AIRTABLE_CONFIG.token) {
        throw new Error('Airtable token is missing');
      }
      if (!AIRTABLE_CONFIG.baseId) {
        throw new Error('Airtable base ID is missing');
      }

      console.log('Starting to fetch brands with config:', {
        hasToken: !!AIRTABLE_CONFIG.token,
        baseId: AIRTABLE_CONFIG.baseId,
        tableId: AIRTABLE_CONFIG.tables.BRANDS
      });

      // Get table and fetch records
      const table = airtableBase(TABLES.BRANDS);
      const records = await table.select().all();
      
      // Fetch all retailers once for efficient lookup
      const retailers = await AirtableService.fetchRetailers();
      
      console.log('Fetched records:', {
        count: records.length,
        firstRecordFields: records[0]?.fields 
      });

      return records.map(record => {
        const fields = record.fields as any;
        
        // Debug logging for field values and IsCuratorsPick
        console.log('Processing brand:', {
          name: fields.Name,
          isCuratorsPick: fields.IsCuratorsPick,
          isCuratorsPickType: typeof fields.IsCuratorsPick,
          rawFields: {
            productRange: fields.ProductRange,
            certifications: fields.Certifications,
            categories: fields.Categories,
            sustainableFeatures: fields.SustainableFeatures,
            logo: fields.Logo,
            cover: fields.Cover,
            founderImages: fields.FounderImages
          }
        });

        try {
          // Handle SustainableFeatures and FeatureDescription
          const features = Array.isArray(fields.SustainableFeatures) 
            ? Array.from(new Set(fields.SustainableFeatures as string[]))
            : [];

          const descriptions = fields.FeatureDescription 
            ? fields.FeatureDescription.split(';').map((d: string) => d.trim())
            : [];

          // Create sustainable features array with proper mapping
          const sustainableFeatures = features.map((feature: string, index: number) => ({
            title: feature as SustainableFeature,
            description: descriptions[index] || ''
          }));

          // Handle Categories with proper mapping
          const categories = Array.isArray(fields.Categories)
            ? Array.from(
                new Set(
                  (fields.Categories as string[]).map((cat: string) => mapAirtableToCategory(cat))
                )
              )
            : [Category.CLOTHING];

          // Handle Images
          const images = Array.isArray(fields.Images)
            ? fields.Images.map((img: Attachment, index: number) => ({
                url: img.url,
                description: fields.ImageDescriptions?.split(';')[index]?.trim() || ''
              }))
            : [];

          // Handle Founders with images
          const founderNames = fields.FoundersNames?.split(';') || [];
          const founderRoles = fields.FounderRoles?.split(';') || [];
          const founderImages = fields.FounderImages 
            ? (fields.FounderImages as Attachment[]).map(img => img.url)
            : [];

          const founders = founderNames.map((name: string, index: number) => ({
            name: name.trim(),
            role: founderRoles[index]?.trim() || '',
            imageUrl: founderImages[index] || '/placeholder-founder.jpg'
          }));

          // Handle Retailers with logos
          const linkedRetailers = Array.isArray(fields.Retailers) 
            ? fields.Retailers 
            : [];
          const urls = fields.Retailers_URLs ? fields.Retailers_URLs.split(';') : [];
          
          const retailerMap = new Map();
          
          linkedRetailers.forEach((retailerId: string, index: number) => {
            const retailerInfo = retailers.find(r => r.id === retailerId);
            const url = urls[index]?.trim() || '';
            
            if (retailerInfo && url) {
              const key = `${retailerInfo.name}-${url}`;
              if (!retailerMap.has(key)) {
                retailerMap.set(key, {
                  marketplace: retailerInfo.name,
                  url,
                  logo: retailerInfo.logo || ''
                });
              }
            }
          });
          
          const brandRetailers = Array.from(retailerMap.values());

          // Handle Certifications
          const certifications = Array.isArray(fields.Certifications)
            ? Array.from(
                new Set(
                  fields.Certifications.map((cert: string) => {
                    const mapped = mapAirtableToCertification(cert);
                    console.log('Mapping certification:', {
                      original: cert,
                      mapped,
                      allValues: Object.values(Certification)
                    });
                    return mapped;
                  })
                )
              )
            : [];

          // Handle ProductRange
          const productRange = typeof fields.ProductRange === 'string'
            ? fields.ProductRange.split(';').map((item: string) => item.trim())
            : Array.isArray(fields.ProductRange)
              ? Array.from(new Set(fields.ProductRange as string[]))
              : [];

          // Create brand object with explicit boolean conversion for isCuratorsPick
          const brand: SustainableBrand = {
            id: record.id,
            name: fields.Name || '',
            logo: (fields.Logo as unknown as Attachment[])?.[0]?.url || '',
            cover: (fields.Cover as unknown as Attachment[])?.[0]?.url || '',
            isCuratorsPick: fields.IsCuratorsPick === true || fields.IsCuratorsPick === 'true' || fields.IsCuratorsPick === '✓',
            categories,
            content: {
              about: fields.About || '',
              impact: fields.Impact || '',
              sustainableFeatures
            },
            url: fields.URL || '',
            businessStartDate: fields.BusinessStartDate || '',
            images,
            founder: founders,
            workforce: fields.WorkforceDescription ? {
              description: fields.WorkforceDescription
            } : undefined,
            brandVideo: fields.BrandVideo || '',
            productRange,
            certifications,
            retailers: brandRetailers,
            origin: {
              city: fields.Origin_City || '',
              country: fields.Origin_Country || ''
            }
          };

          // Debug logging for the processed brand
          console.log('Processed brand:', {
            name: brand.name,
            isCuratorsPick: brand.isCuratorsPick,
            isCuratorsPickType: typeof brand.isCuratorsPick
          });

          return brand;
        } catch (parseError) {
          console.error('Error parsing record:', {
            recordId: record.id,
            error: parseError,
            fields: JSON.stringify(fields, null, 2)
          });
          throw parseError;
        }
      });
    } catch (error) {
      console.error('Error fetching brands:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        config: {
          hasToken: !!AIRTABLE_CONFIG.token,
          baseId: AIRTABLE_CONFIG.baseId,
          tableId: TABLES.BRANDS
        }
      });
      return [];
    }
  }

  static async createBrand(data: Omit<SustainableBrand, 'id'>): Promise<string> {
    try {
      console.log('Starting brand creation');
      
      // First, look up retailer IDs
      const retailers = await AirtableService.fetchRetailers();
      const retailerIds = data.retailers
        .map(retailer => 
          retailers.find(r => r.name === retailer.marketplace)?.id
        )
        .filter(id => id) as string[];

      const airtableData = {
        Name: data.name,
        Logo: data.logo ? [{ url: data.logo }] as unknown as Attachment[] : [],
        Cover: data.cover ? [{ url: data.cover }] as unknown as Attachment[] : [],
        IsCuratorsPick: data.isCuratorsPick || false,
        Categories: Array.from(new Set(data.categories)).map(cat => cat.toString()),
        About: data.content.about,
        Impact: data.content.impact,
        SustainableFeatures: Array.from(new Set(data.content.sustainableFeatures.map(f => f.title))),
        FeatureDescription: data.content.sustainableFeatures
          .map(f => f.description)
          .join(';'),
        URL: data.url,
        BusinessStartDate: data.businessStartDate,
        Images: data.images.map(img => ({ url: img.url })) as unknown as Attachment[],
        ImageDescriptions: data.images.map(img => img.description).join(';'),
        FoundersNames: data.founder.map(f => f.name).join(';'),
        FounderRoles: data.founder.map(f => f.role).join(';'),
        FounderImages: data.founder
          .filter(f => f.imageUrl && f.imageUrl !== '/placeholder-founder.jpg')
          .map(f => ({ url: f.imageUrl })) as unknown as Attachment[],
        WorkforceDescription: data.workforce?.description,
        BrandVideo: data.brandVideo,
        ProductRange: data.productRange.join(';'),
        Certifications: Array.from(new Set(data.certifications)).map(cert => cert.toString()),
        Retailers: retailerIds,
        Retailers_URLs: data.retailers.map(r => r.url).join(';'),
        Origin_City: data.origin.city,
        Origin_Country: data.origin.country
      };

      const records = await airtableBase(TABLES.BRANDS)
        .create([{ fields: airtableData as unknown as FieldSet }]);

      const newBrandId = records[0].id;
      console.log('Brand created successfully:', { newBrandId });
      
      return newBrandId;
    } catch (error) {
      console.error('Error creating brand:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  static async updateBrand(brandId: string, data: Partial<SustainableBrand>): Promise<void> {
    try {
      console.log('Starting brand update:', { brandId });

      const airtableData: Partial<FieldSet> = {};

      if (data.name) airtableData.Name = data.name;
      if (data.logo) airtableData.Logo = [{ url: data.logo }] as unknown as Attachment[];
      if (data.cover) airtableData.Cover = [{ url: data.cover }] as unknown as Attachment[];
      if (data.isCuratorsPick !== undefined) airtableData.IsCuratorsPick = data.isCuratorsPick;
      if (data.categories) {
        airtableData.Categories = Array.from(new Set(data.categories)).map(cat => cat.toString());
      }
      if (data.content?.about) airtableData.About = data.content.about;
      if (data.content?.impact) airtableData.Impact = data.content.impact;
      if (data.content?.sustainableFeatures) {
        airtableData.SustainableFeatures = Array.from(new Set(data.content.sustainableFeatures.map(f => f.title)));
        airtableData.FeatureDescription = data.content.sustainableFeatures
          .map(f => f.description)
          .join(';');
      }
      if (data.url) airtableData.URL = data.url;
      if (data.businessStartDate) airtableData.BusinessStartDate = data.businessStartDate;
      if (data.images) {
        airtableData.Images = data.images.map(img => ({ url: img.url })) as unknown as Attachment[];
        airtableData.ImageDescriptions = data.images.map(img => img.description).join(';');
      }
      if (data.founder) {
        airtableData.FoundersNames = data.founder.map(f => f.name).join(';');
        airtableData.FounderRoles = data.founder.map(f => f.role).join(';');
        airtableData.FounderImages = data.founder
          .filter(f => f.imageUrl && f.imageUrl !== '/placeholder-founder.jpg')
          .map(f => ({ url: f.imageUrl })) as unknown as Attachment[];
      }
      if (data.workforce?.description) airtableData.WorkforceDescription = data.workforce.description;
      if (data.brandVideo) airtableData.BrandVideo = data.brandVideo;
      if (data.productRange) {
        airtableData.ProductRange = data.productRange.join(';');
      }
      if (data.certifications) {
        airtableData.Certifications = Array.from(new Set(data.certifications)).map(cert => cert.toString());
      }
      if (data.retailers) {
        const retailers = await AirtableService.fetchRetailers();
        const retailerIds = data.retailers
          .map(retailer => 
            retailers.find(r => r.name === retailer.marketplace)?.id
          )
          .filter(id => id) as string[];

        airtableData.Retailers = retailerIds;
        airtableData.Retailers_URLs = data.retailers.map(r => r.url).join(';');
      }
      if (data.origin?.city) airtableData.Origin_City = data.origin.city;
      if (data.origin?.country) airtableData.Origin_Country = data.origin.country;

      await airtableBase(TABLES.BRANDS).update(brandId, airtableData);
      console.log('Brand updated successfully:', { brandId });
    } catch (error) {
      console.error('Error updating brand:', {
        brandId,
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  static async deleteBrand(brandId: string): Promise<void> {
    try {
      await airtableBase(TABLES.BRANDS).destroy(brandId);
      console.log('Brand deleted successfully:', { brandId });
    } catch (error) {
      console.error('Error deleting brand:', {
        brandId,
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Airtable connection...');
      const table = airtableBase(TABLES.BRANDS);
      const records = await table.select({ maxRecords: 1 }).firstPage();
      console.log('Connection test successful:', {
        recordsFound: records.length,
        tableId: TABLES.BRANDS
      });
      return true;
    } catch (error) {
      console.error('Connection test failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        config: {
          hasToken: !!AIRTABLE_CONFIG.token,
          baseId: AIRTABLE_CONFIG.baseId,
          tableId: TABLES.BRANDS
        }
      });
      return false;
    }
  }
}