import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint should be called daily via Vercel Cron or a similar scheduler
export async function GET(request: Request) {
  // 1. Authenticate the Cron request to prevent public abuse
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Initialize Supabase Admin Client (bypasses RLS so cron can read all data)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const today = new Date()
  
  // Calculate Target Dates
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dateEndingSoon = tomorrow.toISOString().split('T')[0]

  const tenDaysAgo = new Date(today)
  tenDaysAgo.setDate(today.getDate() - 10)
  const dateExpired10Days = tenDaysAgo.toISOString().split('T')[0]

  try {
    // ---------------------------------------------------------
    // SCENARIO 1: Subscriptions ending tomorrow
    // ---------------------------------------------------------
    const { data: endingSoonData, error: endingError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, end_date, members(id, first_name, email)')
      .eq('end_date', dateEndingSoon)
      .eq('payment_status', 'Completed')

    if (endingError) throw endingError

    // ---------------------------------------------------------
    // SCENARIO 2: Subscriptions that ended exactly 10 days ago
    // ---------------------------------------------------------
    // We only want to email them if they haven't renewed since then.
    const { data: expiredData, error: expiredError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, end_date, member_id, members(id, first_name, email)')
      .eq('end_date', dateExpired10Days)

    if (expiredError) throw expiredError

    // Verify they haven't purchased a newer subscription
    const expiredMembersToEmail = []
    if (expiredData && expiredData.length > 0) {
      for (const sub of expiredData) {
        const { data: newerSubs } = await supabaseAdmin
          .from('subscriptions')
          .select('id')
          .eq('member_id', sub.member_id)
          .gt('end_date', dateExpired10Days)
        
        if (!newerSubs || newerSubs.length === 0) {
          expiredMembersToEmail.push(sub)
        }
      }
    }

    // ---------------------------------------------------------
    // REAL EMAIL SENDING LOGIC (Using Free Gmail SMTP)
    // ---------------------------------------------------------
    const emailsSent = {
      endingSoon: 0,
      expired10Days: 0
    }

    // ---------------------------------------------------------
    // WHATSAPP BOT LOGIC (Twilio API)
    // ---------------------------------------------------------
    const sendWhatsAppMessage = async (phone: string, message: string) => {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g., 'whatsapp:+14155238886'
      
      if (!accountSid || !authToken || !twilioNumber) return;
      
      try {
        // Format phone number (ensure country code exists, e.g. +919876543210 for India)
        // Twilio requires the format 'whatsapp:+[country_code][number]'
        const cleanPhone = phone.replace(/\D/g, ''); 
        const formattedPhone = `whatsapp:+${cleanPhone}`; 
        
        const params = new URLSearchParams();
        params.append('To', formattedPhone);
        params.append('From', twilioNumber);
        params.append('Body', message);

        await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params
        });
      } catch (err) {
        console.error('[WHATSAPP ERROR]', err);
      }
    };

    // Only configure Nodemailer if the user has provided SMTP credentials in .env.local
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      const nodemailer = await import('nodemailer')
      
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })

      // Send Ending Soon Emails & WhatsApp
      if (endingSoonData) {
        for (const sub of endingSoonData) {
          if (sub.members?.email) {
            await transporter.sendMail({
              from: `"Aura Gym" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
              to: sub.members.email,
              subject: 'Your Membership is Ending Tomorrow! ⚠️',
              html: `<p>Hi ${sub.members.first_name},</p><p>This is a quick reminder that your gym membership expires tomorrow! Renew today to keep your streak alive and avoid any joining fees.</p>`,
            })
            emailsSent.endingSoon++
          }
          
          // Send WhatsApp Alert
          if (sub.members?.phone) {
            await sendWhatsAppMessage(
              sub.members.phone, 
              `⚠️ Hi ${sub.members.first_name}, your Aura Gym membership expires tomorrow! Please renew at the front desk to avoid losing your streak. 💪`
            );
          }
        }
      }

      // Send 10 Days Expired Emails & WhatsApp
      for (const sub of expiredMembersToEmail) {
        if (sub.members?.email) {
          await transporter.sendMail({
            from: `"Aura Gym" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: sub.members.email,
            subject: 'Your Membership has Expired ❌',
            html: `<p>Hi ${sub.members.first_name},</p><p>We miss you at the gym! Your membership ended 10 days ago. Reply to this email or drop by the front desk to renew your plan.</p>`,
          })
          emailsSent.expired10Days++
        }

        // Send WhatsApp Alert
        if (sub.members?.phone) {
          await sendWhatsAppMessage(
            sub.members.phone, 
            `❌ Hi ${sub.members.first_name}, your Aura Gym membership ended 10 days ago. We miss seeing you! Drop by the gym to renew your plan and get back to grinding. 🏋️‍♂️`
          );
        }
      }
    } else {
      console.log('[CRON] Skipping actual email/whatsapp sending because credentials are not set in .env.local')
    }

    return NextResponse.json({
      success: true,
      message: 'Cron job executed successfully',
      stats: emailsSent
    })

  } catch (error: any) {
    console.error('[CRON ERROR]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
