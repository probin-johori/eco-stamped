import { airtableBase, AIRTABLE_CONFIG } from './config';

export async function testAirtableConnection() {
  try {
    if (!airtableBase) {
      throw new Error('Airtable base not initialized');
    }

    // Test connection by fetching a single record
    const table = airtableBase(AIRTABLE_CONFIG.tables.BRANDS);
    const records = await table.select({ maxRecords: 1 }).firstPage();
    
    console.log('Airtable connection test:', {
      success: true,
      recordsFound: records.length,
      baseId: AIRTABLE_CONFIG.baseId?.substring(0, 10) + '...',
      tables: Object.keys(AIRTABLE_CONFIG.tables)
    });

    return true;
  } catch (error) {
    console.error('Airtable connection test failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      config: {
        hasToken: !!AIRTABLE_CONFIG.token,
        hasBaseId: !!AIRTABLE_CONFIG.baseId,
        tables: Object.keys(AIRTABLE_CONFIG.tables)
      }
    });
    return false;
  }
}
