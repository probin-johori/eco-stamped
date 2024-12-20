import Airtable from 'airtable';

// Define environment variables with type checking
const TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN as string;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID as string;

// Define table IDs as constants
export const AIRTABLE_TABLES = {
  BRANDS: 'tblzRzFdFnFfwmzlW',
  RETAILERS: 'tblbobbpQEss4b0Zm'  // Added from service.ts
} as const;

// Type for table IDs
export type AirtableTableIds = typeof AIRTABLE_TABLES[keyof typeof AIRTABLE_TABLES];

// Validate required environment variables
if (!TOKEN) {
  throw new Error('Airtable TOKEN is missing in environment variables');
}

if (!BASE_ID) {
  throw new Error('Airtable BASE_ID is missing in environment variables');
}

// Configure Airtable with Personal Access Token
Airtable.configure({ 
  apiKey: TOKEN,
  endpointUrl: 'https://api.airtable.com',
  requestTimeout: 30000
});

// Export configuration object
export const AIRTABLE_CONFIG = {
  token: TOKEN,
  baseId: BASE_ID,
  tables: AIRTABLE_TABLES
} as const;

// Create and export base instance
export const airtableBase = new Airtable({ apiKey: TOKEN }).base(BASE_ID);
