'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, ShoppingBag, ShoppingCart, Settings, LogOut, Activity } from 'lucide-react'
import styles from './Dashboard.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    const { createClient } = await import('@/utils/supabase/client')
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>AURA</div>
          <span className={styles.roleTag}>Admin</span>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <span className={styles.navLabel}>Overview</span>
            <Link href="/dashboard" className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}>
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
            <Link href="/dashboard/analytics" className={`${styles.navItem} ${pathname.includes('/analytics') ? styles.active : ''}`}>
              <Activity size={18} />
              Analytics
            </Link>
          </div>

          <div className={styles.navGroup}>
            <span className={styles.navLabel}>Management</span>
            <Link href="/dashboard/members" className={`${styles.navItem} ${pathname.includes('/members') ? styles.active : ''}`}>
              <Users size={18} />
              Members
            </Link>
            <Link href="/dashboard/billing" className={`${styles.navItem} ${pathname.includes('/billing') ? styles.active : ''}`}>
              <CreditCard size={18} />
              Billing
            </Link>
          </div>

          <div className={styles.navGroup}>
            <span className={styles.navLabel}>Store</span>
            <Link href="/dashboard/pos" className={`${styles.navItem} ${pathname.includes('/pos') ? styles.active : ''}`}>
              <ShoppingCart size={18} />
              Point of Sale (POS)
            </Link>
            <Link href="/dashboard/inventory" className={`${styles.navItem} ${pathname.includes('/inventory') ? styles.active : ''}`}>
              <ShoppingBag size={18} />
              Inventory
            </Link>
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/dashboard/settings" className={`${styles.navItem} ${pathname.includes('/settings') ? styles.active : ''}`}>
            <Settings size={18} />
            Settings
          </Link>
          <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={handleSignOut}>
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.searchBar}>
            <input type="text" placeholder="Search members, orders..." className={styles.searchInput} />
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>A</div>
          </div>
        </header>

        {/* Page Content */}
        <div className={styles.contentContainer}>
          {children}
        </div>
      </main>
    </div>
  )
}
