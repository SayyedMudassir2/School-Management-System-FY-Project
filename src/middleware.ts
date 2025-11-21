
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/dashboard') {
    const role = request.nextUrl.searchParams.get('role')
    const validRoles = ['admin', 'parent', 'student', 'teacher'];
    
    if (role && validRoles.includes(role)) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url))
    }
    
    // Fallback to a default dashboard if role is missing or invalid
    return NextResponse.redirect(new URL('/dashboard/admin', request.url))
  }
 
  return NextResponse.next()
}
 
export const config = {
  matcher: '/dashboard',
}
