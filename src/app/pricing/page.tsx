import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900 to-gray-950 p-12 max-w-2xl w-full mx-auto shadow-2xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 opacity-20 blur-3xl" />
        
        <h1 className="text-4xl font-bold text-white mb-4 relative z-10">
          Pricing
        </h1>
        <p className="text-lg text-gray-400 mb-8 relative z-10">
          This page is currently under construction and will be coming soon. Stay tuned!
        </p>
        
        <Link href="/" className="relative z-10">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
