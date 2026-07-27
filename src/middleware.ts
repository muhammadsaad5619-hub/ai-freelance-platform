import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/projects(.*)',
  '/messages(.*)',
  '/find-work(.*)',
  '/onboarding(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Protect routes — redirect to sign-in if not authenticated
  if (isProtectedRoute(req) && !userId) {
    return (await auth()).redirectToSignIn({ returnBackUrl: req.url });
  }

  // If signed in and NOT on the onboarding/auth page, verify THIS user has onboarded
  if (userId && !isOnboardingRoute(req) && !isAuthRoute(req)) {
    // Cookie stores the userId of the onboarded user — must match current user
    const onboardedUserId = req.cookies.get('onboarded')?.value;
    const isOnboarded = onboardedUserId === userId;

    if (!isOnboarded) {
      return NextResponse.redirect(new URL('/onboarding', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
