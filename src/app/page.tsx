'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ArrowRight, Activity, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import PublicNavbar from '@/components/layout/PublicNavbar';
import styles from './Landing.module.css';

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PublicLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRefs = useRef<HTMLSpanElement[]>([]);
  const statementRefs = useRef<HTMLSpanElement[]>([]);
  
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical', 
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const tl = gsap.timeline();
    
    // Animate Hero Image Container (Clip Path Reveal)
    tl.fromTo('.hero-image-container', 
      { clipPath: 'inset(100% 0 0 0)' }, 
      { clipPath: 'inset(0% 0 0 0)', duration: 1.5, ease: 'power4.inOut' }
    )
    // Stagger Title Words
    .fromTo(titleRefs.current, 
      { y: '110%' }, 
      { y: '0%', duration: 1, stagger: 0.15, ease: 'power3.out' },
      "-=1"
    )
    // Fade in Subtitle and Actions
    .fromTo(['.hero-subtitle', '.hero-actions'], 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power2.out' },
      "-=0.5"
    )
    // Stagger Floating Cards
    .fromTo(['.floating-card-1', '.floating-card-2'],
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.2)' },
      "-=0.8"
    );

    // Subtle parallax on the background typography
    gsap.to('.hero-bg-type', {
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 100,
      opacity: 0
    });

    // ScrollTrigger: Brand Statement
    gsap.to(statementRefs.current, {
      scrollTrigger: {
        trigger: '.brand-statement',
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: 1,
      },
      opacity: 1,
      stagger: 0.1
    });

    gsap.to('.accent-line', {
      scrollTrigger: {
        trigger: '.brand-statement',
        start: 'top 70%',
        end: 'bottom 50%',
        scrub: true,
      },
      width: '100%'
    });

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className={styles.main}>
      <PublicNavbar />

      {/* Cinematic Hero */}
      <section ref={heroRef} className={styles.hero}>
        <div className={`${styles.heroBackgroundType} hero-bg-type`}>AURA</div>
        
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroLine}>
              <span className={styles.heroWord} ref={el => { if(el) titleRefs.current[0] = el }}>BUILD</span>
            </span>
            <span className={styles.heroLine}>
              <span className={styles.heroWord} ref={el => { if(el) titleRefs.current[1] = el }}>YOUR</span>
            </span>
            <span className={styles.heroLine}>
              <span className={styles.heroWord} ref={el => { if(el) titleRefs.current[2] = el }}>STRONGER</span>
            </span>
            <span className={styles.heroLine}>
              <span className={styles.heroWord} ref={el => { if(el) titleRefs.current[3] = el }} style={{ color: 'var(--color-accent)' }}>SELF.</span>
            </span>
          </h1>
          
          <p className={`${styles.heroSubtitle} hero-subtitle`}>
            Experience the next generation of fitness. Premium equipment, expert coaching, 
            and authentic supplements—all under one roof.
          </p>
          
          <div className={`${styles.heroActions} hero-actions`}>
            <Button variant="primary" size="lg" icon={<ArrowRight size={20} />}>
              Start Your Journey
            </Button>
            <Button variant="secondary" size="lg">
              Explore Gym
            </Button>
          </div>
        </div>

        {/* Right side off-center visual */}
        <div className={styles.heroVisual}>
          <div className={`${styles.heroImageContainer} hero-image-container`}>
            <div className={styles.heroImage}></div>
          </div>
          
          {/* Floating Stats */}
          <div className={`${styles.floatingCard1} floating-card-1`}>
            <Activity size={24} color="var(--color-accent)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>8,000+</h3>
            <p style={{ fontSize: '0.875rem' }}>Active Members Daily.</p>
          </div>
          
          <div className={`${styles.floatingCard2} floating-card-2`}>
            <ShoppingBag size={24} color="var(--color-primary)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '0.25rem' }}>Authentic</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Supplements in-store.</p>
          </div>
        </div>
      </section>

      {/* Brand Statement - Scroll Reveal */}
      <section className={`brand-statement ${styles.brandStatement}`}>
        <h2 className={styles.statementText}>
          {['DISCIPLINE', 'IS', 'A', 'LIFESTYLE.'].map((word, i) => (
            <span key={i} className={styles.statementWord} ref={el => { if(el) statementRefs.current[i] = el }}>
              {word}
            </span>
          ))}
        </h2>
        <div className={`accent-line ${styles.accentLine}`}></div>
      </section>

      {/* Shop By Goal - Bento Grid */}
      <section className={styles.bentoSection}>
        <div className={styles.sectionHeader}>
          <h2>SHOP BY GOAL</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>Tailored nutrition for your specific objective.</p>
        </div>
        
        <div className={styles.goalGrid}>
          <div className={`${styles.goalCard} ${styles.goalCard1}`}>
            <div className={styles.cardBg}></div>
            <div className={styles.cardContent}>
              <h3>BUILD MUSCLE</h3>
              <span className={styles.arrow}>Explore Products →</span>
            </div>
          </div>
          
          <div className={`${styles.goalCard} ${styles.goalCard2}`}>
            <div className={styles.cardContent}>
              <h3>LOSE FAT</h3>
              <span className={styles.arrow} style={{ color: 'var(--color-primary)' }}>Explore Products →</span>
            </div>
          </div>
          
          <div className={`${styles.goalCard} ${styles.goalCard3}`}>
            <div className={styles.cardContent}>
              <h3>RECOVER</h3>
              <span className={styles.arrow}>Explore Products →</span>
            </div>
          </div>
          
          <div className={`${styles.goalCard} ${styles.goalCard4}`}>
            <div className={styles.cardContent}>
              <h3>PERFORM</h3>
              <span className={styles.arrow} style={{ color: 'var(--color-accent)' }}>Explore Products →</span>
            </div>
          </div>

          <div className={`${styles.goalCard} ${styles.goalCard5}`}>
            <div className={styles.cardContent}>
              <h3 style={{ color: 'var(--color-light)' }}>BEGINNER STACK</h3>
              <span className={styles.arrow}>Explore Products →</span>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
