import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import SalesClient from './SalesClient'

export const dynamic = 'force-dynamic'

export default async function SalesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: sales, error } = await supabase
    .from('sales')
    .select(`
      *,
      members (
        id,
        first_name,
        last_name,
        phone
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching sales:', error)
  }

  return <SalesClient initialSales={sales || []} />
}
