import { airtableBase, AIRTABLE_CONFIG } from './config';
import { 
  type SustainableBrand, 
  SustainableFeature, 
  Marketplace,
  Category,
  Certification 
} from '@/lib/brands';
import type { FieldSet } from 'airtable';

const TABLES = {
  BRANDS: AIRTABLE_CONFIG.tables.BRANDS,
  RETAILERS: AIRTABLE_CONFIG.tables.RETAILERS
};

interface RetailerInfo {
  id: string;
  name: Marketplace;
  logo: string;
  website: string;
}

// Helper functions for mapping Airtable values to enums
const mapAirtableToCertification = (value: string): Certification => {
  const certificationMap = Object.entries(Certification).reduce((acc, [enumKey, stringValue]) => {
    acc[stringValue] = enumKey as keyof typeof Certification;
    return acc;
  }, {} as Record<string, keyof typeof Certification>);
  
  const enumKey = certificationMap[value];
  
  if (!enumKey) {
    console.warn(`Unknown certification value: ${value}`);
    return Certification.ORGANIC;
  }
  
  return Certification[enumKey];
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
      console.log('Fetching retailers - Config:', {
        hasToken: !!AIRTABLE_CONFIG.token,
        baseId: AIRTABLE_CONFIG.baseId,
        tableId: TABLES.RETAILERS
      });

      const table = airtableBase(TABLES.RETAILERS);
      const records = await table.select().all();

      console.log('Retailers fetch response:', {
        recordCount: records.length,
        hasRecords: records.length > 0,
        firstRecord: records[0]?.id
      });

      return records.map(record => ({
        id: record.id,
        name: record.fields.Name as Marketplace,
        logo: record.fields.Logo as string || '',
        website: record.fields.Website as string
      }));
    } catch (error) {
      console.error('Retailer fetch error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return [];
    }
  }

  static async fetchAllBrands(): Promise<SustainableBrand[]> {
    try {
      console.log('Fetching brands - Config:', {
        hasToken: !!AIRTABLE_CONFIG.token,
        tokenLength: AIRTABLE_CONFIG.token?.length,
        baseId: AIRTABLE_CONFIG.baseId,
        tableId: TABLES.BRANDS
      });

      if (!AIRTABLE_CONFIG.token) {
        throw new Error('Airtable token is missing');
      }
      if (!AIRTABLE_CONFIG.baseId) {
        throw new Error('Airtable base ID is missing');
      }

      const table = airtableBase(TABLES.BRANDS);
      console.log('Table instance created:', {
        hasBase: !!table,
        baseConfig: !!table._base
      });

      const records = await table.select().all();
      const retailers = await AirtableService.fetchRetailers();
      
      console.log('Brands fetch response:', {
        recordCount: records.length,
        hasRecords: records.length > 0,
        firstRecord: records[0]?.id
      });

      return records.map(record => {
        const fields = record.fields as any;
        
        console.log('Processing brand:', {
          name: fields.Name,
          isCuratorsPick: fields.IsCuratorsPick,
          fieldsAvailable: Object.keys(fields),
          logo: fields.Logo,
          cover: fields.Cover
        });

        try {
          const features = Array.isArray(fields.SustainableFeatures) 
            ? Array.from(new Set(fields.SustainableFeatures as string[]))
            : [];

          const descriptions = fields.FeatureDescription 
            ? fields.FeatureDescription.split(';').map((d: string) => d.trim())
            : [];

          const sustainableFeatures = features.map((feature: string, index: number) => ({
            title: feature as SustainableFeature,
            description: descriptions[index] || ''
          }));

          const categories = Array.isArray(fields.Categories)
            ? Array.from(
                new Set(
                  (fields.Categories as string[]).map((cat: string) => mapAirtableToCategory(cat))
                )
              )
            : [Category.CLOTHING];

          // Handle images array as direct URLs
          const images = Array.isArray(fields.Images)
            ? fields.Images.map((url: string, index: number) => ({
                url,
                description: fields.ImageDescriptions?.split(';')[index]?.trim() || ''
              }))
            : [];

          const founderNames = fields.FoundersNames?.split(';') || [];
          const founderRoles = fields.FounderRoles?.split(';') || [];
          const founderImages = fields.FounderImages || [];

          const founders = founderNames.map((name: string, index: number) => ({
            name: name.trim(),
            role: founderRoles[index]?.trim() || '',
            imageUrl: founderImages[index] || '/placeholder-founder.jpg'
          }));

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

          const certifications = Array.isArray(fields.Certifications)
            ? Array.from(
                new Set(
                  (fields.Certifications as string[]).map((cert: string) => mapAirtableToCertification(cert))
                )
              )
            : [];

          const productRange = typeof fields.ProductRange === 'string'
            ? fields.ProductRange.split(';').map((item: string) => item.trim())
            : Array.isArray(fields.ProductRange)
              ? Array.from(new Set(fields.ProductRange as string[]))
              : [];

          const brand: SustainableBrand = {
            id: record.id,
            name: fields.Name || '',
            logo: fields.Logo || '',
            cover: fields.Cover || '',
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

          return brand;
        } catch (parseError) {
          console.error('Error parsing record:', {
            recordId: record.id,
            error: parseError,
            fields: Object.keys(fields)
          });
          throw parseError;
        }
      });
    } catch (error) {
      console.error('Brand fetch error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
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
      
      const retailers = await AirtableService.fetchRetailers();
      const retailerIds = data.retailers
        .map(retailer => 
          retailers.find(r => r.name === retailer.marketplace)?.id
        )
        .filter(id => id) as string[];

      const airtableData = {
        Name: data.name,
        Logo: data.logo || '',
        Cover: data.cover || '',
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
        Images: data.images.map(img => img.url),
        ImageDescriptions: data.images.map(img => img.description).join(';'),
        FoundersNames: data.founder.map(f => f.name).join(';'),
        FounderRoles: data.founder.map(f => f.role).join(';'),
        FounderImages: data.founder
          .filter(f => f.imageUrl && f.imageUrl !== '/placeholder-founder.jpg')
          .map(f => f.imageUrl),
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
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  static async updateBrand(brandId: string, data: Partial<SustainableBrand>): Promise<void> {
    try {
      console.log('Starting brand update:', { brandId });

      const airtableData: Partial<FieldSet> = {};

      if (data.name) airtableData.Name = data.name;
      if (data.logo) airtableData.Logo = data.logo;
      if (data.cover) airtableData.Cover = data.cover;
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
        airtableData.Images = data.images.map(img => img.url);
        airtableData.ImageDescriptions = data.images.map(img => img.description).join(';');
      }
      if (data.founder) {
        airtableData.FoundersNames = data.founder.map(f => f.name).join(';');
        airtableData.FounderRoles = data.founder.map(f => f.role).join(';');
        airtableData.FounderImages = data.founder
          .filter(f => f.imageUrl && f.imageUrl !== '/placeholder-founder.jpg')
          .map(f => f.imageUrl);
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
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
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
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      console.log('Testing Airtable connection with config:', {
        hasToken: !!AIRTABLE_CONFIG.token,
        baseId: AIRTABLE_CONFIG.baseId,
        tableId: TABLES.BRANDS
      });

      const table = airtableBase(TABLES.BRANDS);
      const records = await table.select({ maxRecords: 1 }).firstPage();
      
      console.log('Connection test successful:', {
        recordsFound: records.length,
        tableId: TABLES.BRANDS,
        hasRecords: records.length > 0,
        firstRecord: records[0]?.id
      });
      
      return true;
    } catch (error) {
      console.error('Connection test failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
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
