import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-browser cookies.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isApiRoute = request.nextUrl.pathname.startsWith('/api')
  const isProtectedPath = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/admin')

  // If user is not authenticated and trying to access protected paths
  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated, check if they are in the ADMIN_EMAILS list
  if (user && isProtectedPath) {
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase()) : []
    
    // If ADMIN_EMAILS is configured, restrict access
    if (adminEmails.length > 0 && user.email && !adminEmails.includes(user.email.toLowerCase())) {
      // User is not an admin. Forcefully delete their auth cookies to log them out
      supabaseResponse.cookies.getAll().forEach(cookie => {
        if (cookie.name.includes('-auth-token')) {
          supabaseResponse.cookies.delete(cookie.name)
        }
      })
      
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('error', 'Unauthorized access. Your email is not whitelisted for the ERP.')
      
      // Override response to redirect with cleared cookies
      const redirectResponse = NextResponse.redirect(url)
      supabaseResponse.cookies.getAll().forEach(cookie => {
        if (cookie.name.includes('-auth-token')) {
          redirectResponse.cookies.delete(cookie.name)
        }
      })
      return redirectResponse
    }
  }

  // If user is authenticated and trying to access login/register, redirect to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
