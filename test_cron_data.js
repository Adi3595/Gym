require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedTestData() {
  console.log('Seeding Cron Test Data for Gaurav...');

  // Target Dates
  const today = new Date();
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dateEndingSoon = tomorrow.toISOString().split('T')[0];

  const tenDaysAgo = new Date(today);
  tenDaysAgo.setDate(today.getDate() - 10);
  const dateExpired10Days = tenDaysAgo.toISOString().split('T')[0];

  // 1. Fetch Gaurav's existing member profile (if any)
  const { data: member, error: fetchErr } = await supabase
    .from('members')
    .select('id')
    .eq('email', 'gaurav_test@example.com')
    .single();

  let memberId;

  if (!member) {
    // If somehow not found, insert
    const { data: newMember } = await supabase.from('members').insert({
      first_name: 'Gaurav',
      last_name: 'Test',
      email: 'gaurav_test@example.com',
      phone: '+918329713663',
      status: 'Active',
      join_date: '2023-01-01'
    }).select().single();
    memberId = newMember.id;
  } else {
    memberId = member.id;
  }

  // 2. Fetch a valid membership plan ID to link
  const { data: plans } = await supabase.from('membership_plans').select('id').limit(1);
  const planId = plans && plans.length > 0 ? plans[0].id : null;

  // 3. Insert 2 Subscriptions for Gaurav
  const { error: s1Err } = await supabase.from('subscriptions').insert({
    member_id: memberId,
    plan_id: planId,
    start_date: '2024-01-01',
    end_date: dateEndingSoon,
    payment_status: 'Completed',
    amount_paid: 100
  });

  const { error: s2Err } = await supabase.from('subscriptions').insert({
    member_id: memberId,
    plan_id: planId,
    start_date: '2023-01-01',
    end_date: dateExpired10Days,
    payment_status: 'Completed',
    amount_paid: 100
  });

  if (s1Err || s2Err) {
    console.error('Error inserting subscriptions:', s1Err || s2Err);
  } else {
    console.log(`✅ Success! Seeded subscription ending tomorrow (${dateEndingSoon}) and one expired 10 days ago (${dateExpired10Days}) for Gaurav.`);
  }
}

seedTestData();
