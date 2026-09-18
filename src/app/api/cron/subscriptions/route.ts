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
  
  // Helper to get date string in Indian Standard Time (IST)
  const getISTDateString = (date: Date) => {
    return new Intl.DateTimeFormat('en-CA', { 
        timeZone: 'Asia/Kolkata', 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    }).format(date)
  }
  
  // Calculate Target Dates in IST
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const dateEndingSoon = getISTDateString(tomorrow)

  const tenDaysAgo = new Date(today)
  tenDaysAgo.setDate(today.getDate() - 10)
  const dateExpired10Days = getISTDateString(tenDaysAgo)

  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const dateExpiredYesterday = getISTDateString(yesterday)

  try {
    // ---------------------------------------------------------
    // SCENARIO 1: Subscriptions ending tomorrow
    // ---------------------------------------------------------
    const { data: endingSoonData, error: endingError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, end_date, members(id, first_name, email, phone)')
      .eq('end_date', dateEndingSoon)
      .eq('payment_status', 'Completed')

    if (endingError) throw endingError

    // ---------------------------------------------------------
    // SCENARIO 2: Subscriptions that ended exactly 10 days ago
    // ---------------------------------------------------------
    // We only want to email them if they haven't renewed since then.
    const { data: expired10DaysData, error: expired10DaysError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, end_date, member_id, members(id, first_name, email, phone)')
      .eq('end_date', dateExpired10Days)

    if (expired10DaysError) throw expired10DaysError

    // ---------------------------------------------------------
    // SCENARIO 3: Subscriptions that ended exactly yesterday
    // ---------------------------------------------------------
    const { data: expiredYesterdayData, error: expiredYesterdayError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, end_date, member_id, members(id, first_name, email, phone)')
      .eq('end_date', dateExpiredYesterday)

    if (expiredYesterdayError) throw expiredYesterdayError

    // Verify they haven't purchased a newer subscription (10 Days)
    const expired10DaysMembersToEmail = []
    if (expired10DaysData && expired10DaysData.length > 0) {
      for (const sub of expired10DaysData) {
        const { data: newerSubs } = await supabaseAdmin
          .from('subscriptions')
          .select('id')
          .eq('member_id', sub.member_id)
          .gt('end_date', dateExpired10Days)
        
        if (!newerSubs || newerSubs.length === 0) {
          expired10DaysMembersToEmail.push(sub)
        }
      }
    }

    // Verify they haven't purchased a newer subscription (Yesterday)
    const expiredYesterdayMembersToEmail = []
    if (expiredYesterdayData && expiredYesterdayData.length > 0) {
      for (const sub of expiredYesterdayData) {
        const { data: newerSubs } = await supabaseAdmin
          .from('subscriptions')
          .select('id')
          .eq('member_id', sub.member_id)
          .gt('end_date', dateExpiredYesterday)
        
        if (!newerSubs || newerSubs.length === 0) {
          expiredYesterdayMembersToEmail.push(sub)
        }
      }
    }

    // ---------------------------------------------------------
    // REAL EMAIL SENDING LOGIC (Using Free Gmail SMTP)
    // ---------------------------------------------------------
    const emailsSent = {
      endingSoon: 0,
      expiredYesterday: 0,
      expired10Days: 0
    }

    let transporter: any = null;
    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD && !process.env.SMTP_USER.includes('example.com')) {
      const nodemailer = await import('nodemailer')
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    }

    // ---------------------------------------------------------
    // CUSTOM WHATSAPP MICROSERVICE LOGIC (whatsapp-web.js)
    // ---------------------------------------------------------
    const sendWhatsAppMessage = async (phone: string, message: string) => {
      // The URL where your WhatsApp microservice is hosted (e.g. Render.com URL or localhost for testing)
      const microserviceUrl = process.env.WHATSAPP_MICROSERVICE_URL || 'http://localhost:4000/api/send';
      const microserviceSecret = process.env.MICROSERVICE_SECRET || 'smfitness_gym_whatsapp_secret_key_123';
      
      try {
        const response = await fetch(microserviceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: microserviceSecret,
            phone: phone,
            message: message
          })
        });

        if (!response.ok) {
           console.error('[WHATSAPP MICROSERVICE ERROR]', await response.text());
        }
      } catch (err) {
        console.error('[WHATSAPP MICROSERVICE FETCH ERROR]', err);
      }
    };

    // Send Ending Soon Emails & WhatsApp
    if (endingSoonData) {
      for (const sub of endingSoonData) {
        const member: any = Array.isArray(sub.members) ? sub.members[0] : sub.members;
        
        if (member?.email && transporter) {
          try {
            await transporter.sendMail({
              from: `"SMFitness Gym" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
              to: member.email,
              subject: 'Your Membership is Ending Tomorrow! ⚠️',
              html: `<p>Hi ${member.first_name},</p><p>This is a quick reminder that your gym membership expires tomorrow! Renew today to keep your streak alive and avoid any joining fees.</p>`,
            })
            emailsSent.endingSoon++
          } catch (mailErr) {
            console.error('[SMTP ERROR] Failed to send ending soon email', mailErr)
          }
        }
        
        // Send WhatsApp Alert
        if (member?.phone) {
          await sendWhatsAppMessage(
            member.phone, 
            `*SMFITNESS GYM - MEMBERSHIP NOTIFICATION*\n\nDear *${member.first_name}*,\n\n[ENGLISH]\nThis is a friendly reminder that your SMFitness Gym membership is scheduled to expire *tomorrow*. Kindly renew your membership at the front desk to ensure uninterrupted access to our facilities. If you have recently renewed, please disregard this notice.\n\n[मराठी]\nही एक आठवण करून देण्यासाठी सूचना आहे की तुमची एसएम फिटनेस जिम मेंबरशिप *उद्या* संपणार आहे. जिमचा विनाअडथळा लाभ घेण्यासाठी, कृपया रिसेप्शनवर मेंबरशिपचे नूतनीकरण (renew) करा. तुम्ही आधीच नूतनीकरण केले असल्यास, कृपया या सूचनेकडे दुर्लक्ष करा.\n\n[हिंदी]\nयह आपको याद दिलाने के लिए है कि आपकी एसएम फिटनेस जिम की मेंबरशिप *कल* समाप्त होने वाली है। जिम सुविधाओं का निर्बाध उपयोग सुनिश्चित करने के लिए, कृपया रिसेप्शन पर अपनी मेंबरशिप का नवीनीकरण (renew) करें। यदि आपने हाल ही में अपनी मेंबरशिप नवीनीकृत की है, तो कृपया इस सूचना को अनदेखा करें。\n\nThank you / धन्यवाद!\n*SMFitness Gym Management*`
          );
        }
      }
    }

    // Send Yesterday Expired Emails & WhatsApp
    for (const sub of expiredYesterdayMembersToEmail) {
      const member: any = Array.isArray(sub.members) ? sub.members[0] : sub.members;
      
      if (member?.email && transporter) {
        try {
          await transporter.sendMail({
            from: `"SMFitness Gym" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: member.email,
            subject: 'Your Membership Expired Yesterday ⚠️',
            html: `<p>Hi ${member.first_name},</p><p>Your gym membership expired yesterday. Please renew your plan at the front desk to continue your fitness journey!</p>`,
          })
          emailsSent.expiredYesterday++
        } catch (mailErr) {
          console.error('[SMTP ERROR] Failed to send expired yesterday email', mailErr)
        }
      }

      // Send WhatsApp Alert
      if (member?.phone) {
        await sendWhatsAppMessage(
          member.phone, 
          `*SMFITNESS GYM - MEMBERSHIP EXPIRED*\n\nDear *${member.first_name}*,\n\n[ENGLISH]\nYour SMFitness Gym membership expired *yesterday*. Kindly visit the front desk to renew it and continue your fitness journey with us. If you have already renewed, please ignore this message.\n\n[मराठी]\nतुमची एसएम फिटनेस जिम मेंबरशिप *काल* संपली आहे. कृपया रिसेप्शनवर मेंबरशिपचे नूतनीकरण (renew) करा. तुम्ही आधीच नूतनीकरण केले असल्यास, कृपया या सूचनेकडे दुर्लक्ष करा.\n\n[हिंदी]\nआपकी एसएम फिटनेस जिम की मेंबरशिप *कल* समाप्त हो गई है। अपनी मेंबरशिप का नवीनीकरण (renew) करने के लिए कृपया रिसेप्शन पर आएं। यदि आपने पहले ही नवीनीकरण कर लिया है, तो कृपया इस संदेश को अनदेखा करें。\n\nThank you / धन्यवाद!\n*SMFitness Gym Management*`
        );
      }
    }

    // Send 10 Days Expired Emails & WhatsApp
    for (const sub of expired10DaysMembersToEmail) {
      const member: any = Array.isArray(sub.members) ? sub.members[0] : sub.members;
      
      if (member?.email && transporter) {
        try {
          await transporter.sendMail({
            from: `"SMFitness Gym" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
            to: member.email,
            subject: 'Your Membership has Expired ❌',
            html: `<p>Hi ${member.first_name},</p><p>We miss you at the gym! Your membership ended 10 days ago. Reply to this email or drop by the front desk to renew your plan.</p>`,
          })
          emailsSent.expired10Days++
        } catch (mailErr) {
          console.error('[SMTP ERROR] Failed to send expired email', mailErr)
        }
      }

      // Send WhatsApp Alert
      if (member?.phone) {
        await sendWhatsAppMessage(
          member.phone, 
          `*SMFITNESS GYM - MEMBERSHIP UPDATE*\n\nDear *${member.first_name}*,\n\n[ENGLISH]\nOur records indicate that your SMFitness Gym membership expired 10 days ago. We have sincerely missed your presence at the facility! We invite you to visit the front desk to renew your membership so we can continue supporting your fitness goals.\n\n[मराठी]\nआमच्या रेकॉर्डनुसार, तुमची एसएम फिटनेस जिम मेंबरशिप १० दिवसांपूर्वी संपली आहे. आम्ही तुम्हाला जिममध्ये खूप मिस करत आहोत! मेंबरशिपचे नूतनीकरण (renew) करण्यासाठी लवकरात लवकर रिसेप्शनला भेट द्या.\n\n[हिंदी]\nहमारे रिकॉर्ड के अनुसार, आपकी एसएम फिटनेस जिम की मेंबरशिप 10 दिन पहले समाप्त हो गई है। हम आपको जिम में बहुत मिस कर रहे हैं! अपनी मेंबरशिप का नवीनीकरण (renew) करने के लिए कृपया जल्द से जल्द रिसेप्शन पर आएं।\n\nHope to see you soon! / लवकरच भेटूया!\n*SMFitness Gym Management*`
        );
      }
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
