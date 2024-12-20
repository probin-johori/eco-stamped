import { NextResponse } from 'next/server';
import { airtableBase, AIRTABLE_CONFIG } from '@/lib/airtableBase/config';

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
  } catch (error: any) {
    console.error('Airtable connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Unknown error occurred',
      error: {
        type: error.error || 'UNKNOWN_ERROR',
        message: error.message,
        statusCode: error.statusCode,
        config: {
          hasToken: !!AIRTABLE_CONFIG.token,
          baseId: AIRTABLE_CONFIG.baseId,
          tableId: AIRTABLE_CONFIG.tables.BRANDS
        }
      }
    }, { status: error.statusCode || 500 });
  }
}
