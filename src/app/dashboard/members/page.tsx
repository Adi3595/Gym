import React from 'react'
import { createClient } from '@/utils/supabase/server'
import MembersClient from './MembersClient'

export const revalidate = 0 // always fetch live data

export default async function MembersPage() {
  const supabase = await createClient()

  // Fetch members
  const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching members:', error)
  }

  return <MembersClient initialMembers={members || []} />
}
