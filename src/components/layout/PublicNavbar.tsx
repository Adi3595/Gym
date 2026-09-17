'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import styles from './PublicNavbar.module.css';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
        SMFITNESS
      </Link>
      <div className={styles.navLinks}>
        <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`}>Gym</Link>
        <Link href="/supplements" className={`${styles.navLink} ${pathname === '/supplements' ? styles.active : ''}`}>Supplements</Link>
        <Link href="/membership" className={`${styles.navLink} ${pathname === '/membership' ? styles.active : ''}`}>Membership</Link>
        <Link href="/team" className={`${styles.navLink} ${pathname === '/team' ? styles.active : ''}`}>Elite Team</Link>
        <Link href="/blog" className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}>Journal</Link>
        <Link href="/dashboard">
          <Button variant="primary" size="sm">Member Login</Button>
        </Link>
      </div>
    </nav>
  );
}
