// middleware.ts
import { withClerkMiddleware } from '@clerk/nextjs/server';

export default withClerkMiddleware();

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - public routes
     */
    '/((?!_next/image|_next/static|favicon.ico|sign-in|sign-up).*)',
  ],
};