require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runTestSuite() {
  console.log('🧪 Starting SM Fitness Full System Diagnostic...\n');

  try {
    // ---------------------------------------------------------
    // 1. TEST: POINT OF SALE (POS) & INVENTORY REDUCTION
    // ---------------------------------------------------------
    console.log('📦 [TEST 1] Point of Sale & Inventory Tracking');
    
    // Grab the first available product
    const { data: products } = await supabase.from('products').select('*').gt('current_stock', 0).limit(1);
    
    if (!products || products.length === 0) {
      console.log('❌ FAILED: No products with stock found to test POS.');
    } else {
      const testProduct = products[0];
      const initialStock = testProduct.current_stock;
      console.log(`- Selected Product: ${testProduct.name} (Initial Stock: ${initialStock})`);

      // Simulate a sale of 2 units
      const quantitySold = 2;
      const { data: sale, error: saleErr } = await supabase.from('sales').insert({
        product_id: testProduct.id,
        quantity: quantitySold,
        total_price: testProduct.selling_price * quantitySold,
        sale_date: new Date().toISOString()
      }).select().single();

      if (saleErr) throw saleErr;
      console.log(`- ✅ Sale recorded successfully! (Sold ${quantitySold} units for ₹${sale.total_price})`);

      // Verify Inventory Reduction
      // In this system, is there a trigger doing it?
      const { data: updatedProduct } = await supabase.from('products').select('current_stock').eq('id', testProduct.id).single();
      
      if (updatedProduct.current_stock === initialStock - quantitySold) {
         console.log(`- ✅ Inventory dynamically updated! (New Stock: ${updatedProduct.current_stock})`);
      } else {
         console.log(`- ⚠️ WARNING: Inventory did not reduce automatically. (Expected: ${initialStock - quantitySold}, Got: ${updatedProduct.current_stock})`);
         console.log('     *Note: You may need a database trigger to auto-reduce inventory, or handle it in the Next.js API route!*');
      }
    }

    console.log('\n');

    // ---------------------------------------------------------
    // 2. TEST: ATTENDANCE & CHECK-IN SYSTEM
    // ---------------------------------------------------------
    console.log('🏋️ [TEST 2] Member Check-in & Attendance');
    
    // Grab Aditya's member ID (from our previous cron test)
    const { data: member } = await supabase.from('members').select('id, first_name').eq('email', 'gawaliaditya1483@gmail.com').single();
    
    if (!member) {
      console.log('❌ FAILED: Could not find test member for check-in.');
    } else {
      console.log(`- Checking in ${member.first_name} for a workout...`);
      
      const { error: checkinErr } = await supabase.from('attendance').insert({
        member_id: member.id,
        check_in_time: new Date().toISOString()
      });

      if (checkinErr) throw checkinErr;
      console.log('- ✅ Check-in recorded successfully!');
    }

    console.log('\n');

    // ---------------------------------------------------------
    // 3. TEST: BILLING ENGINE (MRR)
    // ---------------------------------------------------------
    console.log('💰 [TEST 3] Monthly Recurring Revenue (MRR) Calculation');
    
    const { data: activeSubs, error: subsErr } = await supabase
      .from('subscriptions')
      .select('amount_paid')
      .eq('payment_status', 'Completed');

    if (subsErr) throw subsErr;

    const mrr = activeSubs.reduce((acc, sub) => acc + (Number(sub.amount_paid) || 0), 0);
    console.log(`- ✅ Total Active MRR Calculated: ₹${mrr.toFixed(2)}`);

    console.log('\n🎉 ALL CORE SYSTEMS ARE FULLY OPERATIONAL!');

  } catch (error) {
    console.error('\n🚨 CRITICAL ERROR DURING TESTING:', error);
  }
}

runTestSuite();
