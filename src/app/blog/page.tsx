'use client';

import React from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { ArrowRight } from 'lucide-react';
import styles from './Blog.module.css';

export default function BlogPage() {
  const articles = [
    { title: 'Optimizing Protein Intake', cat: 'Nutrition', date: 'Oct 05' },
    { title: 'Active Recovery Strategies', cat: 'Recovery', date: 'Sep 28' },
    { title: 'Pre-Workout Ingredients Explained', cat: 'Supplements', date: 'Sep 20' },
    { title: 'Mobility Drills for Squats', cat: 'Training', date: 'Sep 15' },
    { title: 'Hydration for Performance', cat: 'Nutrition', date: 'Sep 02' },
    { title: 'The Mental Game of Lifting', cat: 'Mindset', date: 'Aug 22' },
  ];

  return (
    <div className={styles.main}>
      <PublicNavbar />

      <div className={styles.featuredSection}>
        
        <motion.h1 
          className={styles.pageTitle}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          KNOWLEDGE HUB
        </motion.h1>

        {/* Featured Article Block */}
        <motion.div 
          className={styles.featuredArticle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.featuredImage}></div>
          <div className={styles.featuredContent}>
            <span className={styles.categoryTag}>Training Science</span>
            <h1 className={styles.featuredTitle}>The Science of Hypertrophy</h1>
            <p className={styles.excerpt}>
              Understanding the mechanical tension and metabolic stress required to force your body to adapt. 
              We break down exactly how muscle fibers grow and the most optimal rep ranges for size.
            </p>
            <div className={styles.readMore}>
              Read Full Article <ArrowRight size={16} />
            </div>
          </div>
        </motion.div>

        {/* Secondary Articles Grid */}
        <div className={styles.gridHeader}>
          <h2>Latest Journal Entries</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View All</span>
        </div>

        <div className={styles.gridSection}>
          {articles.map((post, i) => (
            <motion.div 
              key={i}
              className={styles.articleCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.cardImage}>
                <div className={styles.cardImageInner}></div>
              </div>
              <div className={styles.cardMeta}>
                <span style={{ color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase' }}>{post.cat}</span>
                <span style={{ color: 'var(--text-muted)' }}>{post.date}</span>
              </div>
              <h3 className={styles.cardTitle}>{post.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Learn the fundamental principles behind {post.cat.toLowerCase()} and how to apply them to your routine to accelerate progress.
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
