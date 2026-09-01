'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/layout/PublicNavbar';
import styles from './About.module.css';

export default function AboutPage() {
  return (
    <div className={styles.main}>
      <PublicNavbar />

      <div className={styles.container}>
        
        <div className={styles.pageHeader}>
          <motion.h1 
            className={styles.pageTitle}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            THE AURA EXPERIENCE
          </motion.h1>
        </div>

        {/* Feature 1 */}
        <motion.div 
          className={styles.featureBlock}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className={styles.featureImage}></div>
          <div className={styles.featureContent}>
            <h2 className={styles.featureTitle}>Uncompromising Standards</h2>
            <p className={styles.featureText}>
              Every single piece of equipment has been hand-selected for optimal biomechanics. 
              We don't buy in bulk from a single supplier; we curate the absolute best machines 
              from around the world. The environment is designed to foster focus and intensity.
            </p>
            <div className={styles.statGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15,000</span>
                <span className={styles.statLabel}>Sq Ft Facility</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>24/7</span>
                <span className={styles.statLabel}>Access</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature 2 (Reversed) */}
        <motion.div 
          className={styles.featureBlockReverse}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className={styles.featureImage} style={{ background: 'var(--color-secondary)' }}></div>
          <div className={styles.featureContent}>
            <h2 className={styles.featureTitle}>The Science of Recovery</h2>
            <p className={styles.featureText}>
              Training breaks you down; recovery builds you up. Aura features a dedicated recovery zone 
              equipped with the latest modalities to ensure you bounce back faster and stronger. Stop 
              leaving your gains on the table by ignoring what happens after the workout.
            </p>
            <div className={styles.statGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>04</span>
                <span className={styles.statLabel}>Ice Baths</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>02</span>
                <span className={styles.statLabel}>Infrared Saunas</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature 3 */}
        <motion.div 
          className={styles.featureBlock}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className={styles.featureImage} style={{ background: '#0a1f24' }}></div>
          <div className={styles.featureContent}>
            <h2 className={styles.featureTitle}>In-House Nutrition</h2>
            <p className={styles.featureText}>
              You cannot out-train a bad diet, and you shouldn't have to guess what's in your supplements. 
              Our integrated store offers only 100% authentic, third-party tested products.
            </p>
            <div className={styles.statGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>100%</span>
                <span className={styles.statLabel}>Authentic</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>50+</span>
                <span className={styles.statLabel}>Premium Brands</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
