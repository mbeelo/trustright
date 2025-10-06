import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function migrateDatabase() {
  try {
    console.log('🚀 Starting database migration...');

    // Drop and recreate websites table
    console.log('📋 Dropping existing websites table...');
    await sql`DROP TABLE IF EXISTS websites CASCADE`;

    console.log('🏗️ Creating new comprehensive websites table...');
    await sql`
      CREATE TABLE websites (
        id SERIAL PRIMARY KEY,
        domain TEXT NOT NULL UNIQUE,

        -- Store complete analysis as JSON
        analysis_data JSONB,

        -- Key searchable fields
        company_name TEXT,
        trust_score INTEGER,

        -- Legacy fields for compatibility
        name TEXT,
        owner TEXT,
        ultimate_control TEXT,
        bias TEXT,
        stakeholders JSONB,
        revenue JSONB,
        flags JSONB,

        last_updated TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('✅ Database migration completed successfully!');
    console.log('🎯 New schema includes:');
    console.log('   - analysis_data: Full comprehensive trust analysis');
    console.log('   - company_name: Searchable company name');
    console.log('   - trust_score: Searchable trust score');
    console.log('   - Legacy fields: Backwards compatibility');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateDatabase();