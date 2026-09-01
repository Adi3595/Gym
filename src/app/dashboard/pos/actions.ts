'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function processSale(cart: any[], memberId: string | null, paymentMethod: string) {
  const supabase = await createClient()

  // 1. Calculate totals
  const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const discount = 0
  const tax = 0
  const finalAmount = totalAmount - discount + tax

  // 2. Insert Sale Record
  const { data: saleData, error: saleError } = await supabase.from('sales').insert([{
    member_id: memberId || null,
    total_amount: totalAmount,
    discount,
    tax,
    final_amount: finalAmount,
    payment_method: paymentMethod,
    payment_status: 'Completed'
  }]).select().single()

  if (saleError) return { error: saleError.message }

  // 3. Insert Sale Items & Deduct Stock
  const saleId = saleData.id

  for (const item of cart) {
    // Insert sale_item
    await supabase.from('sale_items').insert([{
      sale_id: saleId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }])

    // Deduct stock (RPC or just simple update for MVP)
    // Note: In production, use an RPC for atomic decrement to prevent race conditions
    const { data: prodData } = await supabase.from('products').select('current_stock').eq('id', item.product_id).single()
    if (prodData) {
      await supabase.from('products').update({ 
        current_stock: prodData.current_stock - item.quantity 
      }).eq('id', item.product_id)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/inventory')
  
  return { success: true, saleId }
}
