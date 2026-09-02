import React from 'react'
import { createClient } from '@/utils/supabase/server'
import POSClient from './POSClient'

export const revalidate = 0 // live data

export default async function POSPage() {
  const supabase = await createClient()

  // Fetch available products
  const { data: products } = await supabase
    .from('products')
    .select('id, name, sku, selling_price, current_stock, product_image')
    .eq('status', 'Active')
    .gt('current_stock', 0)
    .order('name')

  // Fetch members for assignment
  const { data: members } = await supabase
    .from('members')
    .select('id, first_name, last_name, phone')
    .eq('status', 'Active')
    .order('first_name')

  return <POSClient products={products || []} members={members || []} />
}
