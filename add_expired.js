require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const phone = '9518573595';

  // 1. Insert or update member
  const { data: members, error: searchError } = await supabase.from('members').select('id').eq('phone', phone);
  let memberId;

  if (members && members.length > 0) {
    memberId = members[0].id;
    console.log('Member exists with ID:', memberId);
  } else {
    const { data: newMember, error: insertError } = await supabase.from('members').insert([{
      first_name: 'Test',
      last_name: 'Expired',
      phone: phone,
      email: 'testexpired@example.com',
      status: 'Active',
      join_date: new Date().toISOString().split('T')[0]
    }]).select().single();
    
    if (insertError) {
      console.error('Error inserting member', insertError);
      return;
    }
    memberId = newMember.id;
    console.log('Created new member:', memberId);
  }

  // 2. Fetch a plan
  const { data: plan } = await supabase.from('membership_plans').select('id, duration_days, price').limit(1).single();

  // 3. Insert expired subscription (exactly 10 days ago)
  const today = new Date();
  const dateExpired10Days = new Date(today);
  dateExpired10Days.setDate(today.getDate() - 10);
  const end_date = dateExpired10Days.toISOString().split('T')[0];
  
  const start_date = new Date(dateExpired10Days);
  start_date.setDate(start_date.getDate() - plan.duration_days);

  const { data: sub, error: subError } = await supabase.from('subscriptions').insert([{
    member_id: memberId,
    plan_id: plan.id,
    start_date: start_date.toISOString().split('T')[0],
    end_date: end_date,
    amount_paid: plan.price,
    payment_status: 'Completed',
    payment_method: 'Cash'
  }]).select().single();

  if (subError) {
    console.error('Error inserting sub', subError);
    return;
  }
  
  console.log('Created expired subscription ending on:', end_date);
  
  // 4. Trigger the cron endpoint to send the messages!
  console.log('Triggering cron endpoint...');
  try {
    const res = await fetch('http://localhost:3000/api/cron/subscriptions', {
      method: 'GET' // the endpoint is a GET handler
    });
    const result = await res.json();
    console.log('Cron Job Response:', result);
  } catch (err) {
    console.error('Cron job trigger failed (is the Next.js server running on port 3000?):', err.message);
  }
}

main();
