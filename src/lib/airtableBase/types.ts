import { type Attachment } from 'airtable';

export interface AirtableBrandRecord {
  Name: string;
  Logo: Attachment[];
  Categories: string[];
  About: string;
  Impact: string;
  URL: string;
  BusinessStartDate: string;
  BrandVideo?: string;
  WorkforceDescription?: string;
  Origin_City: string;
  Origin_Country: string;
  ProductRange: string[];
  Certifications: string[];
  
  // For sustainable features
  SustainableFeatures: string[];  // Change to array for multiple select
  FeatureDescriptions: string;    // Keep as string for long text
  
  // For images
  Images: Attachment[];
  ImageDescriptions: string;
  
  // For founders
  FoundersNames: string;
  FounderRoles: string;
  
  // For retailers
  Retailers: string;  // Keep as string with format "marketplace|url,marketplace2|url2"
}
