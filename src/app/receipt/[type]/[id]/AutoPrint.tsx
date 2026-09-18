'use client'

import { useEffect } from 'react'

export default function AutoPrint() {
  useEffect(() => {
    // Wait a brief moment for styles/images to fully load before triggering the print dialog
    const timer = setTimeout(() => {
      window.print()
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
