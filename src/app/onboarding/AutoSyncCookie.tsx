"use client";

import { useEffect } from "react";
import { syncOnboardingCookie } from "../actions/onboarding";

export function AutoSyncCookie() {
  useEffect(() => {
    // This calls the server action from the client, which properly sets the cookie.
    syncOnboardingCookie();
  }, []);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="text-gray-400">Redirecting to dashboard...</p>
    </div>
  );
}
