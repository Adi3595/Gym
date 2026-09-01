<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Flexed%20Biceps.png" alt="Flexed Biceps" width="80" height="80" />
  
  # AURA GYM ERP 
  ### The Ultimate Fitness Management Operating System
  
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js"></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="https://twilio.com/"><img src="https://img.shields.io/badge/Twilio-WhatsApp_Bot-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio"></a>
  </p>

  *A high-fidelity, production-ready SaaS application designed to manage members, process point-of-sale transactions, and fully automate gym billing.*

  <br />
</div>

---

## ⚡ Core Engine Features

<details>
  <summary><b>🤖 Automated WhatsApp & Email Bot</b> <i>(Click to expand)</i></summary>
  <br/>
  Powered by a Vercel Cron Job, the backend automatically scans the database at midnight. It uses <b>Brevo (SMTP)</b> and <b>Twilio</b> to instantly send emails and WhatsApp messages to members whose subscriptions are expiring tomorrow, or expired 10 days ago!
</details>

<details>
  <summary><b>💳 Smart Billing & Grace Periods</b> <i>(Click to expand)</i></summary>
  <br/>
  No more members cheating the system. If a member renews during their 5-day grace period, the engine automatically <b>backdates</b> their new subscription to start exactly when the old one ended. 
</details>

<details>
  <summary><b>🛒 Integrated Point of Sale (POS)</b> <i>(Click to expand)</i></summary>
  <br/>
  A blazing fast POS interface. Staff can add supplements to a cart, assign the purchase directly to a member's profile (or walk-ins), and deduct inventory stock in real-time. 
</details>

<details>
  <summary><b>🎨 Premium "Icy Cyan" Aesthetic</b> <i>(Click to expand)</i></summary>
  <br/>
  Say goodbye to boring software. Built with bespoke CSS modules, the dashboard features glassmorphism, soft `#f6f6f6` contrasts, and vibrant accent colors designed to WOW staff and members alike.
</details>

---

## 🚀 Getting Started (Local Development)

Want to spin this up on your local machine? Follow these exact steps:

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/aura-gym-erp.git
cd aura-gym-erp
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory and add your keys:

```env
# Supabase Backend
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Brevo SMTP Settings (For Automated Emails)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_login_email@example.com
SMTP_PASSWORD=your_brevo_smtp_key
SMTP_FROM_EMAIL=no-reply@auragym.com

# Twilio WhatsApp Bot
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Vercel Cron Secret
CRON_SECRET=super_secret_cron_key_123
```

### 3. Deploy the Database Schema
Head to your Supabase project's SQL Editor. Copy the entire contents of `supabase/migrations/00000000000000_initial_schema.sql` and run it. This will build the entire relational architecture in 2 seconds.

### 4. Start the Engine!
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🛡️ Architecture & Routing

We utilized Next.js 15 App Router to its absolute maximum potential:
- **Server Actions**: All database mutations (adding members, processing sales) happen securely on the server without exposing API routes.
- **Suspense Boundaries (`loading.tsx`)**: Instant route transitions using beautiful CSS shimmer skeletons to eliminate perceived loading latency.
- **Error Boundaries (`error.tsx`)**: Graceful degradation. If the database drops, the UI remains perfectly intact with a stylized "System Disruption" screen.

<div align="center">
  <br />
  <sub>Built with ❤️ for the fitness industry.</sub>
</div>
