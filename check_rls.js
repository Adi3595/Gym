require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.rpc('get_policies_placeholder'); // Supabase JS can't directly query pg_policies via REST unless exposed
  // Let's just try to query sales using the ANON key to prove if it's RLS
  const anonSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { data: anonData, error: anonError } = await anonSupabase.from('sales').select('*').limit(1);
  console.log('ANON query result:', anonData, anonError);
}

run();
