'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Plus } from 'lucide-react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import { Button } from '@/components/ui/Button';
import styles from './Supplements.module.css';

export default function SupplementsPage() {
  const products = [
    { name: 'Creatine Monohydrate', category: 'Strength', price: '₹999', image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Pre-Workout Igniter', category: 'Energy', price: '₹1,899', image: 'https://images.unsplash.com/photo-1579722839958-3f5f3e4e94b2?auto=format&fit=crop&q=80&w=400' },
    { name: 'BCAA Recovery', category: 'Endurance', price: '₹1,499', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400' },
    { name: 'Casein Protein', category: 'Recovery', price: '₹2,899', image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400' },
    { name: 'Multivitamin Elite', category: 'Wellness', price: '₹799', image: 'https://images.unsplash.com/photo-1577253313708-8abeb28387bc?auto=format&fit=crop&q=80&w=400' },
    { name: 'Omega-3 Fish Oil', category: 'Wellness', price: '₹899', image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=400' },
    { name: 'Mass Gainer Pro', category: 'Size', price: '₹3,499', image: 'https://images.unsplash.com/photo-1622486981880-928ccf2e21b0?auto=format&fit=crop&q=80&w=400' },
    { name: 'Glutamine', category: 'Recovery', price: '₹1,199', image: 'https://images.unsplash.com/photo-1511690521873-157929497e55?auto=format&fit=crop&q=80&w=400' },
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
            {/* Background image set in CSS */}
          </div>
          <div className={styles.heroContent}>
            <span className={styles.heroTag}>Best Seller</span>
            <h1 className={styles.heroTitle}>SMFitness Pure Whey Isolate</h1>
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
          <h2>SMFITNESS IN-STORE SUPPLEMENTS</h2>
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
              <div 
                className={styles.productImage}
                style={{ backgroundImage: `url('${product.image}')` }}
              ></div>
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
