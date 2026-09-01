'use client'

import React, { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, signup } from './actions'
import styles from './Login.module.css'
import { Button } from '@/components/ui/Button'
import { Lock, Mail, ArrowRight, Loader2, Phone, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    setError(null)
    
    // Quick validation for phone since Supabase phone auth requires setup
    if (loginMethod === 'phone') {
      setError("Phone authentication requires an SMS provider (like Twilio) to be configured in your Supabase dashboard. Please use Email for now.")
      return
    }

    startTransition(async () => {
      const result = authMode === 'signin' ? await login(formData) : await signup(formData)
      
      if (result?.error) {
        if (result.error.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link to sign in. (Or disable Email Confirmation in Supabase Auth settings).')
        } else {
          setError(result.error)
        }
      }
    })
  }

  const formVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  }

  return (
    <div className={styles.main}>
      
      {/* Left side Cinematic Panel */}
      <div className={styles.imagePanel}>
        <div className={styles.imagePanelContent}>
          <motion.h1 
            className={styles.imagePanelTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Access The<br/>Elite.
          </motion.h1>
          <motion.p 
            className={styles.imagePanelText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to the Aura administrative dashboard. Manage your members, track your point of sale, and oversee facility operations securely.
          </motion.p>
        </div>
      </div>

      {/* Right side Form Panel */}
      <div className={styles.formPanel}>
        <motion.div 
          className={styles.loginContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.header}>
            <div className={styles.logo}>AURA ERP</div>
            <p className={styles.subtitle}>Secure backend access.</p>
          </div>

          <div className={styles.authTabs}>
            <button className={`${styles.tab} ${authMode === 'signin' ? styles.activeTab : ''}`} onClick={() => { setAuthMode('signin'); setError(null); }}>
              Sign In
              {authMode === 'signin' && <motion.div layoutId="authTab" className={styles.activeIndicator} />}
            </button>
            <button className={`${styles.tab} ${authMode === 'signup' ? styles.activeTab : ''}`} onClick={() => { setAuthMode('signup'); setError(null); }}>
              Create Account
              {authMode === 'signup' && <motion.div layoutId="authTab" className={styles.activeIndicator} />}
            </button>
          </div>

          <div className={styles.methodTabs}>
            <button className={`${styles.methodTab} ${loginMethod === 'email' ? styles.activeMethodTab : ''}`} onClick={() => { setLoginMethod('email'); setError(null); }}>
              Email
            </button>
            <button className={`${styles.methodTab} ${loginMethod === 'phone' ? styles.activeMethodTab : ''}`} onClick={() => { setLoginMethod('phone'); setError(null); }}>
              Phone Number
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                className={styles.errorBox}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form action={handleSubmit} className={styles.form}>
            <AnimatePresence mode="wait">
              {loginMethod === 'email' ? (
                <motion.div 
                  key="email-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className={styles.inputGroup}
                >
                  <label htmlFor="email" className={styles.label}>Email Address</label>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} size={20} />
                    <input type="email" id="email" name="email" required className={styles.input} placeholder="name@example.com" autoComplete="email" />
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="phone-form"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2 }}
                  className={styles.inputGroup}
                >
                  <label htmlFor="phone" className={styles.label}>Mobile Number</label>
                  <div className={styles.inputWrapper}>
                    <span className={styles.phonePrefix}>+91</span>
                    <input type="tel" id="phone" name="phone" required className={`${styles.input} ${styles.phoneInput}`} placeholder="98765 43210" autoComplete="tel" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <Lock className={styles.inputIcon} size={20} />
                <input type="password" id="password" name="password" required className={styles.input} placeholder="••••••••" minLength={6} />
              </div>
            </div>

            <Button variant="primary" fullWidth size="lg" type="submit" disabled={isPending} style={{ marginTop: '0.5rem' }}>
              {isPending ? (
                <Loader2 className="animate-spin" size={20} style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <>
                  {authMode === 'signin' ? 'Sign In' : 'Create Admin Account'} 
                  <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                </>
              )}
            </Button>
          </form>

          <div className={styles.divider}>OR</div>

          <button 
            type="button" 
            className={styles.googleBtn}
            onClick={async () => {
              const { createClient } = await import('@/utils/supabase/client');
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              });
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {authMode === 'signup' && (
            <p className={styles.helpText}>
              Note: After creating an account, you may need to check your email for a confirmation link depending on your Supabase settings.
            </p>
          )}
        </motion.div>
      </div>

    </div>
  )
}
