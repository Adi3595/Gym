require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const id = '7bc368e0-8669-48a3-ac27-a90b101b4543';
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items (
        *,
        products (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error("Fetch Error:", error);
  } else {
    console.log("Found Sale:", data);
  }
}

run();
