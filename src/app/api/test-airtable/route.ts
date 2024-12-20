import { NextResponse } from 'next/server';
import { airtableBase, AIRTABLE_CONFIG } from '@/lib/airtableBase/config';

// Define an interface for the error type
interface AirtableError extends Error {
  error?: string;
  statusCode?: number;
}

export async function GET() {
  try {
    // Log the full token prefix for debugging (first 10 chars)
    const tokenPrefix = AIRTABLE_CONFIG.token?.substring(0, 10);
    console.log('Testing Airtable connection with config:', {
      hasToken: !!AIRTABLE_CONFIG.token,
      tokenPrefix: tokenPrefix ? `${tokenPrefix}...` : 'missing',
      baseId: AIRTABLE_CONFIG.baseId,
      tableId: AIRTABLE_CONFIG.tables.BRANDS
    });

    // Try to access the base first
    const base = airtableBase;
    if (!base) {
      throw new Error('Failed to initialize Airtable base');
    }

    // Try to get the table
    const table = base(AIRTABLE_CONFIG.tables.BRANDS);
    if (!table) {
      throw new Error('Failed to get table reference');
    }

    // Try to fetch records
    const records = await table.select({
      maxRecords: 1,
      fields: ['Name'] // Only fetch the name field as a minimal test
    }).firstPage();

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      recordCount: records.length,
      firstRecordId: records[0]?.id
    });
  } catch (error) {
    console.error('Airtable connection test failed:', error);
    
    const airtableError = error as AirtableError;

    return NextResponse.json({
      success: false,
      message: airtableError.message || 'Unknown error occurred',
      error: {
        type: airtableError.error || 'UNKNOWN_ERROR',
        message: airtableError.message,
        statusCode: airtableError.statusCode,
        config: {
          hasToken: !!AIRTABLE_CONFIG.token,
          baseId: AIRTABLE_CONFIG.baseId,
          tableId: AIRTABLE_CONFIG.tables.BRANDS
        }
      }
    }, { status: airtableError.statusCode || 500 });
  }
}
