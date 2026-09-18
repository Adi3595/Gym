require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  // Check column exists in products table
  const { data, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error("Error fetching products:", error);
  } else {
    console.log("Product schema:", data.length > 0 ? Object.keys(data[0]) : "No products yet");
  }

  // Ensure bucket exists
  const { data: buckets, error: bError } = await supabase.storage.listBuckets();
  if (bError) {
    console.error("Error fetching buckets:", bError);
  } else {
    let exists = buckets.find(b => b.name === 'product-images');
    if (!exists) {
      console.log("Bucket 'product-images' does not exist. Attempting to create...");
      const { data: createData, error: createError } = await supabase.storage.createBucket('product-images', { public: true });
      if (createError) console.error("Error creating bucket:", createError);
      else console.log("Created bucket:", createData);
    } else {
      console.log("Bucket 'product-images' already exists.");
    }
  }
}

run();
