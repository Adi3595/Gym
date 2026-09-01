'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/layout/PublicNavbar';
import styles from './Team.module.css';

export default function TeamPage() {
  const coaches = [
    { 
      name: 'Rahul Dev', 
      spec: 'Strength & Hypertrophy', 
      exp: '8 Years',
      clients: '300+',
      color: 'var(--color-primary)' 
    },
    { 
      name: 'Anita Desai', 
      spec: 'Mobility & Yoga', 
      exp: '5 Years',
      clients: '500+',
      color: 'var(--color-secondary)' 
    },
    { 
      name: 'Karan Singh', 
      spec: 'CrossFit & Athletics', 
      exp: '6 Years',
      clients: '200+',
      color: 'var(--color-primary)' 
    }
  ];

  return (
    <div className={styles.main}>
      <PublicNavbar />

      <div className={styles.teamContainer}>
        
        <div className={styles.introSection}>
          <motion.h1 
            className={styles.introTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            MEET THE ELITE
          </motion.h1>
          <motion.p 
            className={styles.introText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            We don't hire standard floor trainers. Our coaching staff consists of industry-leading professionals 
            who have dedicated their lives to mastering human performance and biomechanics.
          </motion.p>
        </div>

        <div className={styles.rosterGrid}>
          {coaches.map((coach, i) => (
            <motion.div 
              key={i}
              className={styles.coachCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.coachImage} style={{ background: coach.color }}></div>
              <div className={styles.coachInfo}>
                <h3 className={styles.coachName}>{coach.name}</h3>
                <span className={styles.coachSpec}>{coach.spec}</span>
                
                <div className={styles.coachStats}>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{coach.exp}</span>
                    <span className={styles.statLabel}>Experience</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statValue}>{coach.clients}</span>
                    <span className={styles.statLabel}>Transformations</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
