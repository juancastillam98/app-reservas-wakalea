import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Only run middleware on routes that need auth checking
    '/dashboard/:path*',
    '/admin/:path*',
    '/checkout/:path*',
    '/auth/:path*',
  ],
}
