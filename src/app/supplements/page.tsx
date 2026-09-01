'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Plus } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { Button } from '@/components/ui/Button';
import styles from './Supplements.module.css';

export default function SupplementsPage() {
  const products = [
    { name: 'Creatine Monohydrate', category: 'Strength', price: '₹999' },
    { name: 'Pre-Workout Igniter', category: 'Energy', price: '₹1,899' },
    { name: 'BCAA Recovery', category: 'Endurance', price: '₹1,499' },
    { name: 'Casein Protein', category: 'Recovery', price: '₹2,899' },
    { name: 'Multivitamin Elite', category: 'Wellness', price: '₹799' },
    { name: 'Omega-3 Fish Oil', category: 'Wellness', price: '₹899' },
    { name: 'Mass Gainer Pro', category: 'Size', price: '₹3,499' },
    { name: 'Glutamine', category: 'Recovery', price: '₹1,199' },
  ];

  return (
    <div className={styles.main}>
      <PublicNavbar />

      <div className={styles.storeContainer}>
        
        {/* Mega Hero Product */}
        <motion.div 
          className={styles.heroProduct}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.heroVisual}>
            <Package size={150} color="var(--color-accent)" />
          </div>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Best Seller</span>
            <h1 className={styles.heroTitle}>Aura Pure Whey Isolate</h1>
            <p className={styles.heroDesc}>
              Ultra-fast absorbing protein designed for maximum muscle recovery. Zero sugar, 25g protein per scoop. Formulated specifically for serious athletes pushing their limits.
            </p>
            <div className={styles.heroAction}>
              <div className={styles.heroPrice}>₹3,299</div>
              <Button variant="secondary" size="lg" icon={<ShoppingCart size={20} />}>
                Reserve In Store
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className={styles.gridHeader}>
          <h2>AURA IN-STORE SUPPLEMENTS</h2>
          <span style={{ color: 'var(--text-muted)' }}>Sort By: Featured</span>
        </div>

        <div className={styles.productGrid}>
          {products.map((product, i) => (
            <motion.div 
              key={i} 
              className={styles.productCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className={styles.productImage}>
                <Package size={48} color="var(--color-primary)" />
              </div>
              <div className={styles.productCategory}>{product.category}</div>
              <h3 className={styles.productName}>{product.name}</h3>
              <div className={styles.productFooter}>
                <div className={styles.productPrice}>{product.price}</div>
                <div className={styles.cartBtn}>
                  <Plus size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
