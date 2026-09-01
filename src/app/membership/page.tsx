'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { Button } from '@/components/ui/Button';
import styles from './Membership.module.css';

export default function MembershipPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className={styles.main}>
      <PublicNavbar />

      <div className={styles.pageHeader}>
        <motion.h1 
          className={styles.pageTitle}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          JOIN THE ELITE
        </motion.h1>
        
        <motion.div 
          className={styles.toggleContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className={`${styles.toggleLabel} ${isAnnual ? styles.inactive : ''}`}>Monthly</span>
          <label className={styles.switch}>
            <input type="checkbox" checked={isAnnual} onChange={() => setIsAnnual(!isAnnual)} />
            <span className={styles.slider}></span>
          </label>
          <span className={`${styles.toggleLabel} ${!isAnnual ? styles.inactive : ''}`}>Annually <span style={{ color: 'var(--status-success)', fontSize: '0.75rem', marginLeft: '4px' }}>Save 20%</span></span>
        </motion.div>
      </div>

      <div className={styles.pricingGrid}>
        
        {/* Standard Plan */}
        <motion.div 
          className={styles.planCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className={styles.planName}>Standard</h3>
          <div className={styles.planPrice}>
            <span className={styles.priceAmount}>₹{isAnnual ? '1,500' : '2,000'}</span>
            <span className={styles.pricePeriod}>/ mo</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Perfect for getting started with your fitness journey.</p>
          
          <div className={styles.featuresList}>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> 24/7 Gym Access</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> Free Locker Usage</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> 1 Fitness Consultation</div>
          </div>
          
          <Button variant="secondary" fullWidth size="lg">Choose Standard</Button>
        </motion.div>

        {/* Pro Plan (Highlighted) */}
        <motion.div 
          className={`${styles.planCard} ${styles.highlight}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={styles.popularBadge}>Recommended</div>
          <h3 className={styles.planName}>Aura Pro</h3>
          <div className={styles.planPrice}>
            <span className={styles.priceAmount}>₹{isAnnual ? '2,400' : '3,000'}</span>
            <span className={styles.pricePeriod}>/ mo</span>
          </div>
          <p style={{ color: 'var(--color-light)' }}>Everything you need for serious results.</p>
          
          <div className={styles.featuresList}>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> All Standard Features</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> Group Fitness Classes</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> 10% Off In-Store Supplements</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> Monthly Body Composition Scan</div>
          </div>
          
          <Button variant="primary" fullWidth size="lg">Get Aura Pro</Button>
        </motion.div>

        {/* Elite PT Plan */}
        <motion.div 
          className={styles.planCard}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className={styles.planName}>Elite Coaching</h3>
          <div className={styles.planPrice}>
            <span className={styles.priceAmount}>₹{isAnnual ? '7,500' : '9,000'}</span>
            <span className={styles.pricePeriod}>/ mo</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Dedicated 1-on-1 personal training and nutrition.</p>
          
          <div className={styles.featuresList}>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> All Pro Features</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> 3 PT Sessions per Week</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> Custom Nutrition Plan</div>
            <div className={styles.featureItem}><CheckCircle2 size={18} className={styles.featureIcon} /> 20% Off In-Store Supplements</div>
          </div>
          
          <Button variant="secondary" fullWidth size="lg">Contact Us</Button>
        </motion.div>

      </div>
    </div>
  );
}
