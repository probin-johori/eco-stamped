import Airtable from 'airtable';

// Add debug logging
console.log('Environment Check:', {
  hasToken: !!process.env.NEXT_PUBLIC_AIRTABLE_TOKEN,
  tokenLength: process.env.NEXT_PUBLIC_AIRTABLE_TOKEN?.length,
  hasBaseId: !!process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
  env: process.env.NODE_ENV
});

// Define environment variables with type checking
const TOKEN = process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
const BASE_ID = process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID;

// Define table IDs as constants
export const AIRTABLE_TABLES = {
  BRANDS: 'tblzRzFdFnFfwmzlW',
  RETAILERS: 'tblbobbpQEss4b0Zm'
} as const;

// Type for table IDs
export type AirtableTableIds = typeof AIRTABLE_TABLES[keyof typeof AIRTABLE_TABLES];

// Validate required environment variables
if (!TOKEN) {
  console.error('Airtable TOKEN is missing');
  throw new Error('Airtable TOKEN is missing in environment variables');
}

if (!BASE_ID) {
  console.error('Airtable BASE_ID is missing');
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

// Create and export base instance with logging
const base = new Airtable({ apiKey: TOKEN }).base(BASE_ID);

// Add a wrapper function for better error handling
export const airtableBase = (tableId: AirtableTableIds) => {
  console.log('Accessing table:', {
    tableId,
    hasToken: !!TOKEN,
    hasBaseId: !!BASE_ID
  });
  return base(tableId);
};
