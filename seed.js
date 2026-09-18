require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. DELETE EXISTING DATA (Order matters for Foreign Keys!)
    console.log('🗑️  Deleting existing data...');
    // Delete in reverse dependency order
    await supabase.from('sale_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('sales').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('subscriptions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('members').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('membership_plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    
    console.log('✅ Old data cleared (User logins preserved).');

    // 2. INSERT MEMBERSHIP PLANS
    console.log('📦 Inserting Membership Plans...');
    const plansToInsert = [
      { name: '1 Month Standard', price: 2000, duration_days: 30 },
      { name: '3 Months Standard', price: 5500, duration_days: 90 },
      { name: '6 Months Premium', price: 10000, duration_days: 180 },
      { name: '1 Year VIP', price: 18000, duration_days: 365 },
      { name: '1 Month Personal Training', price: 5000, duration_days: 30 }
    ];
    
    const { data: plans, error: planErr } = await supabase.from('membership_plans').insert(plansToInsert).select();
    if (planErr) throw planErr;

    // 3. INSERT PRODUCTS
    console.log('📦 Inserting Products...');
    const productsToInsert = [
      { name: 'Optimum Nutrition Gold Standard Whey', sku: 'ON-WHEY-2KG', mrp: 7500, selling_price: 6500, purchase_price: 5000, current_stock: 45, status: 'Active' },
      { name: 'MuscleTech NitroTech', sku: 'MT-NITRO-2KG', mrp: 6500, selling_price: 5800, purchase_price: 4500, current_stock: 30, status: 'Active' },
      { name: 'Dymatize ISO 100', sku: 'DYM-ISO-1.3KG', mrp: 8200, selling_price: 7200, purchase_price: 5500, current_stock: 25, status: 'Active' },
      { name: 'BSN Syntha-6', sku: 'BSN-SYN-2.2KG', mrp: 6500, selling_price: 5500, purchase_price: 4200, current_stock: 15, status: 'Active' },
      { name: 'Cellucor C4 Pre-Workout', sku: 'C4-PRE-30', mrp: 3200, selling_price: 2500, purchase_price: 1800, current_stock: 50, status: 'Active' },
      { name: 'BPI Sports 1MR Vortex', sku: 'BPI-1MR-50', mrp: 2800, selling_price: 2200, purchase_price: 1500, current_stock: 40, status: 'Active' },
      { name: 'XTEND BCAA', sku: 'XTEND-BCAA-30', mrp: 3500, selling_price: 2800, purchase_price: 2000, current_stock: 35, status: 'Active' },
      { name: 'MuscleBlaze Biozyme Whey', sku: 'MB-BIO-2KG', mrp: 5200, selling_price: 4500, purchase_price: 3500, current_stock: 60, status: 'Active' },
      { name: 'Isopure Zero Carb', sku: 'ISO-ZERO-3LB', mrp: 9500, selling_price: 8500, purchase_price: 6800, current_stock: 20, status: 'Active' },
      { name: 'GNC Pro Performance Creatine', sku: 'GNC-CRE-250G', mrp: 1200, selling_price: 900, purchase_price: 600, current_stock: 100, status: 'Active' },
      { name: 'Optimum Nutrition Micronized Creatine', sku: 'ON-CRE-300G', mrp: 1500, selling_price: 1200, purchase_price: 850, current_stock: 80, status: 'Active' },
      { name: 'MyProtein Impact Whey', sku: 'MYP-WHEY-1KG', mrp: 4000, selling_price: 3200, purchase_price: 2500, current_stock: 55, status: 'Active' },
      { name: 'Gym Shaker Bottle 700ml', sku: 'EQ-SHAKER-700', mrp: 500, selling_price: 350, purchase_price: 150, current_stock: 120, status: 'Active' },
      { name: 'Pro Lifting Straps', sku: 'EQ-STRAPS', mrp: 600, selling_price: 450, purchase_price: 200, current_stock: 85, status: 'Active' },
      { name: 'Weightlifting Belt (Leather)', sku: 'EQ-BELT-L', mrp: 2000, selling_price: 1500, purchase_price: 800, current_stock: 25, status: 'Active' }
    ];

    const { data: prods, error: prodErr } = await supabase.from('products').insert(productsToInsert).select();
    if (prodErr) throw prodErr;

    // 4. INSERT MEMBERS
    console.log('👤 Inserting 50 Members...');
    const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Riaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Ananya', 'Diya', 'Avni', 'Kavya', 'Sanya', 'Aadhya', 'Myra', 'Prisha', 'Riya', 'Sara', 'Kabir', 'Vivaan', 'Aryan', 'Dhruv', 'Rudra', 'Aarohi', 'Nisha', 'Pooja', 'Neha', 'Kriti', 'Rahul', 'Rohit', 'Amit', 'Sunil', 'Vikram', 'Sanjay', 'Rajesh', 'Deepak', 'Manish', 'Nitin', 'Priya', 'Sneha', 'Anjali', 'Komal', 'Swati', 'Shruti', 'Divya', 'Aarti', 'Megha', 'Pooja'];
    const lastNames = ['Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Joshi', 'Mishra', 'Reddy', 'Rao', 'Das', 'Nair', 'Chopra', 'Malhotra', 'Kapoor', 'Mehta', 'Jain', 'Bansal', 'Agarwal', 'Yadav'];
    
    const membersToInsert = [];
    for (let i = 0; i < 50; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      membersToInsert.push({
        first_name: fName,
        last_name: lName,
        phone: '98' + Math.floor(10000000 + Math.random() * 90000000).toString(),
        email: `${fName.toLowerCase()}.${lName.toLowerCase()}${i}@example.com`,
        status: Math.random() > 0.15 ? 'Active' : 'Inactive',
        join_date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    const { data: members, error: memErr } = await supabase.from('members').insert(membersToInsert).select();
    if (memErr) throw memErr;

    // 5. INSERT SUBSCRIPTIONS
    console.log('📅 Inserting Subscriptions...');
    const subsToInsert = [];
    for (let i = 0; i < 150; i++) {
      const member = members[Math.floor(Math.random() * members.length)];
      const plan = plans[Math.floor(Math.random() * plans.length)];
      
      // Random start date between 1 year ago and today
      const startDate = new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + plan.duration_days * 24 * 60 * 60 * 1000);

      subsToInsert.push({
        member_id: member.id,
        plan_id: plan.id,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        payment_status: 'Paid',
        amount_paid: plan.price,
        created_at: startDate.toISOString()
      });
    }

    const { error: subErr } = await supabase.from('subscriptions').insert(subsToInsert);
    if (subErr) throw subErr;

    // 6. INSERT POS SALES
    console.log('🛒 Inserting POS Sales & Items...');
    const salesToInsert = [];
    const saleDates = [];

    // Generate 300 sales
    for (let i = 0; i < 300; i++) {
      // Date spread out over last 180 days
      const saleDate = new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000);
      saleDates.push(saleDate.toISOString());

      salesToInsert.push({
        member_id: Math.random() > 0.3 ? members[Math.floor(Math.random() * members.length)].id : null,
        total_amount: 0, // Will update after
        final_amount: 0,
        payment_method: ['Card', 'Cash', 'UPI'][Math.floor(Math.random() * 3)],
        payment_status: 'Completed',
        created_at: saleDate.toISOString()
      });
    }

    const { data: sales, error: saleErr } = await supabase.from('sales').insert(salesToInsert).select();
    if (saleErr) throw saleErr;

    const saleItemsToInsert = [];
    
    for (let i = 0; i < sales.length; i++) {
      const sale = sales[i];
      let saleTotal = 0;
      
      // 1 to 4 items per sale
      const numItems = Math.floor(Math.random() * 4) + 1;
      
      for (let j = 0; j < numItems; j++) {
        const prod = prods[Math.floor(Math.random() * prods.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        const total = qty * prod.selling_price;
        saleTotal += total;

        saleItemsToInsert.push({
          sale_id: sale.id,
          product_id: prod.id,
          quantity: qty,
          price: prod.selling_price,
          total: total
        });
      }

      // Update the sale total
      await supabase.from('sales').update({
        total_amount: saleTotal,
        final_amount: saleTotal
      }).eq('id', sale.id);
    }

    // Insert sale items in chunks to avoid payload limits
    console.log(`Injecting ${saleItemsToInsert.length} sale items...`);
    const chunkSize = 200;
    for (let i = 0; i < saleItemsToInsert.length; i += chunkSize) {
      const chunk = saleItemsToInsert.slice(i, i + chunkSize);
      const { error: sItemErr } = await supabase.from('sale_items').insert(chunk);
      if (sItemErr) throw sItemErr;
    }

    console.log('✅ DATABASE SEED COMPLETE! System is fully populated with rich data.');

  } catch (error) {
    console.error('❌ SEED ERROR:', error);
  }
}

seed();
