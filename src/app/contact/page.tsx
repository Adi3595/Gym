'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingTop: '100px' }}>
      <PublicNavbar />

      <div style={{ padding: '0 4rem 4rem 4rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'left' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Name</label>
              <input type="text" style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} placeholder="Your Name" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Email</label>
              <input type="email" style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} placeholder="you@example.com" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500, color: 'var(--text-dark)' }}>Message</label>
              <textarea rows={5} style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} placeholder="How can we help you?"></textarea>
            </div>
            <Button variant="primary" size="lg" fullWidth>Send Message</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
