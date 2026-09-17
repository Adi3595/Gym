'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './PublicNavbar.module.css';

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      
      <button className={`showOnMobileFlex ${styles.hamburger}`} onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X size={24} color="var(--color-primary)" /> : <Menu size={24} color="var(--color-primary)" />}
      </button>

      <div className={`${styles.navLinks} ${mobileOpen ? styles.mobileNavOpen : ''}`}>
        <Link href="/about" className={`${styles.navLink} ${pathname === '/about' ? styles.active : ''}`} onClick={() => setMobileOpen(false)}>Gym</Link>
        <Link href="/supplements" className={`${styles.navLink} ${pathname === '/supplements' ? styles.active : ''}`} onClick={() => setMobileOpen(false)}>Supplements</Link>
        <Link href="/membership" className={`${styles.navLink} ${pathname === '/membership' ? styles.active : ''}`} onClick={() => setMobileOpen(false)}>Membership</Link>
        <Link href="/team" className={`${styles.navLink} ${pathname === '/team' ? styles.active : ''}`} onClick={() => setMobileOpen(false)}>Elite Team</Link>
        <Link href="/blog" className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`} onClick={() => setMobileOpen(false)}>Journal</Link>
        <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
          <Button variant="primary" size="sm">Member Login</Button>
        </Link>
      </div>
    </nav>
  );
}
