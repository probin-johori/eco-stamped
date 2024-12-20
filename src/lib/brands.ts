import { ReactNode } from "react";
import { AirtableService } from '@/lib/airtableBase/service';

export interface BrandImage {
  url: string;
  description: string;
}

export interface Founder {
  role: ReactNode;
  name: string;
  imageUrl: string;
}

export interface Workforce {
  description: string;
}

export interface BrandOrigin {
  city: string;
  country: string;
}

export enum SustainableFeature {
  ORGANIC_MATERIALS = "Organic Materials",
  RECYCLED_MATERIALS = "Recycled Materials",
  ZERO_WASTE = "Zero Waste",
  CARBON_NEUTRAL = "Carbon Neutral",
  WATER_CONSERVATION = "Water Conservation",
  RENEWABLE_ENERGY = "Renewable Energy",
  LOCAL_PRODUCTION = "Local Production",
  FAIR_TRADE = "Fair Trade",
  VEGAN = "Vegan",
  PLASTIC_FREE = "Plastic Free",
  CIRCULAR_ECONOMY = "Circular Economy",
  BIODEGRADABLE = "Biodegradable",
  ETHICAL_LABOR = "Ethical Labor",
  SUSTAINABLE_PACKAGING = "Sustainable Packaging",
  CHEMICAL_FREE = "Chemical Free",
  TREE_PLANTING = "Tree Planting",
  UPCYCLED = "Upcycled",
  NATURAL_DYES = "Natural Dyes",
  HANDCRAFTED = "Handcrafted",
  CRUELTY_FREE = "Cruelty Free"
}

export const sustainableFeatureDefinitions: Record<SustainableFeature, string> = {
  [SustainableFeature.ORGANIC_MATERIALS]: "Sprout",
  [SustainableFeature.RECYCLED_MATERIALS]: "Recycle",
  [SustainableFeature.ZERO_WASTE]: "CircleDot",
  [SustainableFeature.CARBON_NEUTRAL]: "Leaf",
  [SustainableFeature.WATER_CONSERVATION]: "Droplets",
  [SustainableFeature.RENEWABLE_ENERGY]: "Sun",
  [SustainableFeature.LOCAL_PRODUCTION]: "MapPin",
  [SustainableFeature.FAIR_TRADE]: "HeartHandshake",
  [SustainableFeature.VEGAN]: "Flower2",
  [SustainableFeature.PLASTIC_FREE]: "PackageX",
  [SustainableFeature.CIRCULAR_ECONOMY]: "RefreshCw",
  [SustainableFeature.BIODEGRADABLE]: "Trees",
  [SustainableFeature.ETHICAL_LABOR]: "Users",
  [SustainableFeature.SUSTAINABLE_PACKAGING]: "Package",
  [SustainableFeature.CHEMICAL_FREE]: "ShieldCheck",
  [SustainableFeature.TREE_PLANTING]: "Palmtree",
  [SustainableFeature.UPCYCLED]: "ArrowUpCircle",
  [SustainableFeature.NATURAL_DYES]: "Palette",
  [SustainableFeature.HANDCRAFTED]: "Hand",
  [SustainableFeature.CRUELTY_FREE]: "Heart"
}

export enum Marketplace {
  AMAZON = "Amazon",
  FLIPKART = "Flipkart",
  WALMART = "Walmart",
  MEESHO = "Meesho",
  SWIFT = "Swift",
  TATA_CLIQ = "Tata CLiQ",
  MYNTRA = "Myntra",
  SNAPDEAL = "Snapdeal",
  PAYTM_MALL = "Paytm Mall"
}

export enum Category {
  CLOTHING = "Clothing",
  ACCESSORIES = "Accessories",
  FOOD_BEVERAGE = "Food & Beverage",
  HOME = "Home",
  BEAUTY = "Beauty",
  ELECTRONICS = "Electronics",
  TOYS = "Toys",
  OUTDOOR = "Outdoor",
  SPORTS = "Sports",
  GIFTS = "Gifts",
  HEALTH = "Health",
  STATIONERY = "Stationery",
  PETS = "Pets",
  TRAVEL = "Travel",
  GARDEN = "Garden",
  BOOKS = "Books",
  AUTOMOTIVE = "Automotive",
  CRAFTS = "Crafts",
  ART = "Art",
  FURNITURE = "Furniture",
  DECOR = "Decor",
  TEXTILES = "Textiles",
  FARMING = "Farming",
  JEWELRY = "Jewelry",
  FOOTWEAR = "Footwear",
  CLEANING = "Cleaning"
}

export enum Certification {
  GOTS = "GOTS Certified",
  FAIR_TRADE = "Fair Trade Certified",
  VEGAN = "Vegan Certified",
  ORGANIC = "Organic Certified",
  B_CORPORATION = "B Corporation",
  CRADLE_TO_CRADLE = "Cradle to Cradle",
  FSC = "FSC Certified",
  ENERGY_STAR = "Energy Star"
}

export interface SustainableFeatureContent {
  title: SustainableFeature;
  description: string;
}

export interface BrandContent {
  about: string;
  impact: string;
  sustainableFeatures: SustainableFeatureContent[];
}

export interface MarketplaceAvailability {
  marketplace: Marketplace;
  url: string;
  logo?: string;
}

export interface SustainableBrand {
  id: string;
  name: string;
  logo: string;       // Brand logo
  cover: string;      // Brand cover image (previously named logo)
  isCuratorsPick?: boolean;  // Flag for curator's favorite brands
  categories: Category[];
  content: BrandContent;
  url: string;
  businessStartDate: string;
  images: BrandImage[];
  founder: Founder[];
  workforce?: Workforce;
  brandVideo?: string;
  productRange: string[];
  certifications: Certification[];
  retailers: MarketplaceAvailability[];
  origin: BrandOrigin;
}

export async function getBrands(): Promise<SustainableBrand[]> {
  try {
    return await AirtableService.fetchAllBrands();
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

export async function createBrand(brand: Omit<SustainableBrand, 'id'>): Promise<string> {
  return await AirtableService.createBrand(brand);
}

export async function updateBrand(id: string, brand: Partial<SustainableBrand>): Promise<void> {
  await AirtableService.updateBrand(id, brand);
}

export async function deleteBrand(id: string): Promise<void> {
  await AirtableService.deleteBrand(id);
}

export async function testAirtableConnection(): Promise<boolean> {
  try {
    const brands = await getBrands();
    return Array.isArray(brands);
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    return false;
  }
}

export const getMarketplaceBaseUrl = (marketplace: Marketplace): string => {
  const urlMap: Record<Marketplace, string> = {
    [Marketplace.AMAZON]: "https://www.amazon.in",
    [Marketplace.FLIPKART]: "https://www.flipkart.com",
    [Marketplace.WALMART]: "https://www.walmart.com",
    [Marketplace.MEESHO]: "https://www.meesho.com",
    [Marketplace.SWIFT]: "https://www.swift.com",
    [Marketplace.TATA_CLIQ]: "https://www.tatacliq.com",
    [Marketplace.MYNTRA]: "https://www.myntra.com",
    [Marketplace.SNAPDEAL]: "https://www.snapdeal.com",
    [Marketplace.PAYTM_MALL]: "https://paytmmall.com"
  };
  return urlMap[marketplace];
};

export const getMarketplaceLogo = (marketplace: Marketplace): string => {
  return `/logos/${marketplace.toLowerCase().replace(/ /g, '-')}.svg`;
};
