import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || "hospital-calendar-super-secret-key-12345"
const encodedKey = new TextEncoder().encode(JWT_SECRET)

// Add routes that don't require authentication here
const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    
    // Skip middleware for static files and images
    if (pathname.includes('.') || pathname.startsWith('/_next/')) {
        return NextResponse.next()
    }

    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
    const token = request.cookies.get('auth_token')?.value

    let isValidToken = false
    
    if (token) {
        try {
            await jwtVerify(token, encodedKey)
            isValidToken = true
        } catch (error) {
            // Token is invalid/expired
            isValidToken = false
        }
    }

    // Redirect unauthenticated users trying to access protected routes
    if (!isValidToken && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect authenticated users trying to access login/register pages
    if (isValidToken && isPublicRoute && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
