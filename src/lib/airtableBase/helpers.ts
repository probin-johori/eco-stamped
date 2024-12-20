import { 
  Category, 
  Certification, 
  SustainableFeature, 
  type SustainableBrand} from '../brands';
import { 
  type AirtableBrandRecord, 
  type AirtableFeatureRecord,
  type AirtableFounderRecord,
  type AirtableImageRecord,
  type AirtableRetailerRecord 
} from './types';

export const transformAirtableToSustainableBrand = async (
  brandRecord: AirtableBrandRecord,
  recordId: string,
  features: AirtableFeatureRecord[],
  founders: AirtableFounderRecord[],
  images: AirtableImageRecord[],
  retailers: AirtableRetailerRecord[]
): Promise<SustainableBrand> => {
  return {
    id: recordId,
    name: brandRecord.Name,
    logo: brandRecord.Logo[0]?.url || '',
    categories: brandRecord.Categories.map(cat => 
      Category[cat as keyof typeof Category]
    ),
    content: {
      about: brandRecord.About,
      impact: brandRecord.Impact,
      sustainableFeatures: features
        .filter(feature => feature.BrandId.includes(recordId))
        .map(feature => ({
          title: SustainableFeature[feature.Title as keyof typeof SustainableFeature],
          description: feature.Description
        }))
    },
    url: brandRecord.URL,
    businessStartDate: brandRecord.BusinessStartDate,
    images: images
      .filter(img => img.BrandId.includes(recordId))
      .map(img => ({
        url: img.URL[0].url,
        description: img.Description
      })),
    founder: founders
      .filter(founder => founder.BrandId.includes(recordId))
      .map(founder => ({
        name: founder.Name,
        role: founder.Role,
        imageUrl: founder.ImageUrl[0]?.url || ''
      })),
    workforce: brandRecord.WorkforceDescription ? {
      description: brandRecord.WorkforceDescription
    } : undefined,
    brandVideo: brandRecord.BrandVideo,
    productRange: brandRecord.ProductRange,
    certifications: brandRecord.Certifications.map(cert =>
      Certification[cert as keyof typeof Certification]
    ),
    retailers: retailers
      .filter(retailer => retailer.BrandId.includes(recordId))
      .map(retailer => ({
        marketplace: retailer.Marketplace,
        url: retailer.URL
      })),
    origin: {
      city: brandRecord.Origin_City,
      country: brandRecord.Origin_Country
    }
  };
};

export const transformBrandToAirtable = (
  data: Partial<SustainableBrand>
): Partial<AirtableBrandRecord> => {
  return {
    Name: data.name,
    Logo: data.logo ? [{ url: data.logo }] : undefined,
    Categories: data.categories?.map(cat => cat.toString()),
    About: data.content?.about,
    Impact: data.content?.impact,
    URL: data.url,
    BusinessStartDate: data.businessStartDate,
    ProductRange: data.productRange,
    Certifications: data.certifications?.map(cert => cert.toString()),
    Origin_City: data.origin?.city,
    Origin_Country: data.origin?.country,
    WorkforceDescription: data.workforce?.description
  };
};
