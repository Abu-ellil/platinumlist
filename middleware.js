import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  
  // Extract subdomain from hostname
  const subdomain = getSubdomain(hostname);
  
  // Define paths that should NOT be rewritten to city routes
  const globalPaths = ['/login', '/checkout', '/api', '/_next', '/favicon.ico'];
  const isGlobalPath = globalPaths.some(path => url.pathname.startsWith(path));
  
  // Create response
  let response;
  
  // If there's a subdomain and it's not 'www', treat it as a city
  if (subdomain && subdomain !== 'www' && !isGlobalPath) {
    // Check if the path is already a city route to avoid infinite loops
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      // Rewrite to the city route
      url.pathname = `/${subdomain}${url.pathname}`;
      response = NextResponse.rewrite(url);
    }
  }
  
  if (!response) {
    response = NextResponse.next();
  }
  
  // Add pathname to headers for server-side access
  response.headers.set('x-pathname', request.nextUrl.pathname);
  
  return response;
}

/**
 * Extract subdomain from hostname
 * @param {string} hostname - The request hostname
 * @returns {string|null} - The subdomain or null if none
 */
function getSubdomain(hostname) {
  // Remove port if present
  const cleanHostname = hostname.split(':')[0];
  
  // Split by dots
  const parts = cleanHostname.split('.');
  
  // For development (localhost), return null
  if (parts.length < 3 || cleanHostname.includes('localhost')) {
    return null;
  }
  
  // Return the first part as subdomain
  // cairo.platinumlist.net -> ["cairo", "platinumlist", "net"]
  return parts[0];
}

// Configure which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}; 