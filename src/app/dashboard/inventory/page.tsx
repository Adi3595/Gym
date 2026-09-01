import React from 'react'
import { createClient } from '@/utils/supabase/server'
import InventoryClient from './InventoryClient'

export const revalidate = 0 // always fetch live data

export default async function InventoryPage() {
  const supabase = await createClient()

  // Fetch products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
  }

  return <InventoryClient initialProducts={products || []} />
}
