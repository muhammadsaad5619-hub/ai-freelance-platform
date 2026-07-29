import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-400">Sign in to your FreelanceAI account</p>
        </div>
        <SignIn
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-gray-900 border border-white/10 shadow-2xl rounded-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton:
                "bg-white/5 border border-white/10 text-white hover:bg-white/10",
              dividerLine: "bg-white/10",
              dividerText: "text-gray-500",
              formFieldLabel: "text-gray-300",
              formFieldInput:
                "bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-violet-500",
              formButtonPrimary:
                "bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90",
              footerActionLink: "text-violet-400 hover:text-violet-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-violet-400",
            },
          }}
        />
      </div>
    </div>
  );
}
