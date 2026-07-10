import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/projects(.*)',
  '/messages(.*)',
  '/find-work(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  const { userId } = auth();

  // If the user is logged in and trying to access any page other than onboarding/sign-in
  if (userId && !req.nextUrl.pathname.startsWith('/onboarding') && !req.nextUrl.pathname.startsWith('/sign-in') && !req.nextUrl.pathname.startsWith('/sign-up')) {
    // Check if the onboarding cookie is set
    const isOnboarded = req.cookies.get('onboarded')?.value === 'true';
    if (!isOnboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
