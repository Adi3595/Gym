'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './PublicNavbar.module.css';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <Link href="/" className={styles.logo}>
        <div style={{ width: 24, height: 24, background: 'var(--color-primary)', borderRadius: 4 }}></div>
        AURA
      </Link>
      <div className={styles.navLinks}>
        <Link href="/about" className={styles.navLink}>Gym</Link>
        <Link href="/supplements" className={styles.navLink}>Supplements</Link>
        <Link href="/membership" className={styles.navLink}>Membership</Link>
        <Link href="/team" className={styles.navLink}>Elite Team</Link>
        <Link href="/blog" className={styles.navLink}>Journal</Link>
        <Link href="/dashboard">
          <Button variant="primary" size="sm">Member Login</Button>
        </Link>
      </div>
    </nav>
  );
}
