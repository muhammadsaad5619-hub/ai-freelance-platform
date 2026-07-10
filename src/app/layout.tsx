import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "FreelanceAI — AI-Powered Freelancing Platform",
  description:
    "Connect with top freelancers and clients on the AI-powered freelancing platform. Smart matching, automated workflows, and seamless collaboration.",
  keywords: ["freelance", "AI", "projects", "hiring", "remote work"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col">
        <ClerkProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
