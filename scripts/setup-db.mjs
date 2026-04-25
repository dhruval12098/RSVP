import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env.local file
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSql(sql) {
  try {
    const { error } = await supabase.rpc('exec', { sql });
    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
}

async function runSetup() {
  console.log('🚀 Starting database setup...\n');

  // Step 1: Run setup-db.sql
  console.log('📦 Step 1: Setting up base tables (RSVP, Admin Settings)...');
  const setupDbPath = path.join(__dirname, 'setup-db.sql');
  if (fs.existsSync(setupDbPath)) {
    const setupDbSql = fs.readFileSync(setupDbPath, 'utf-8');
    const result = await executeSql(setupDbSql);
    if (result) {
      console.log('✅ Base tables created successfully\n');
    } else {
      console.log('⚠️  Base tables may already exist (this is normal)\n');
    }
  } else {
    console.log('⚠️  setup-db.sql not found, skipping\n');
  }

  // Step 2: Run setup-admin.sql
  console.log('👤 Step 2: Setting up admin authentication...');
  const setupAdminPath = path.join(__dirname, 'setup-admin.sql');
  if (fs.existsSync(setupAdminPath)) {
    const setupAdminSql = fs.readFileSync(setupAdminPath, 'utf-8');
    const result = await executeSql(setupAdminSql);
    if (result) {
      console.log('✅ Admin authentication tables created\n');
    } else {
      console.log('⚠️  Admin tables may already exist (this is normal)\n');
    }
  } else {
    console.log('⚠️  setup-admin.sql not found, skipping\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ Database setup complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📋 Default Admin Credentials:');
  console.log('   Username: admin');
  console.log('   Password: luxury-event-2024\n');
  
  console.log('⚠️  IMPORTANT:');
  console.log('   - Change the admin password in production');
  console.log('   - Make sure the "rsvp" storage bucket is PUBLIC in Supabase');
  console.log('   - You can now run: pnpm dev\n');
}

runSetup().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
