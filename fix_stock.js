require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixStock() {
  await supabase.from('products').update({ stock_quantity: 50 }).gt('price', 0);
  console.log('Stock restocked to 50 for all products!');
}
fixStock();
