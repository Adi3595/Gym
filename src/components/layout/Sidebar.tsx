import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Users, ShoppingBag, Package, Settings, LogOut, BarChart3, Contact } from 'lucide-react';
import styles from './Sidebar.module.css';
import clsx from 'clsx';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Activity },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Trainers', path: '/trainers', icon: Contact },
    { name: 'Store POS', path: '/store', icon: ShoppingBag },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className={`liquid-glass ${styles.sidebar}`}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}></div>
        <h1 className="glow-text">AURA</h1>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          
          return (
            <Link 
              href={item.path} 
              key={item.path}
              className={clsx(styles.navItem, { [styles.active]: isActive })}
            >
              <Icon size={20} /> {item.name}
            </Link>
          );
        })}
      </nav>

      <div className={styles.bottomNav}>
        <button className={styles.navItem}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </aside>
  );
}
