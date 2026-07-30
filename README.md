# AI-Powered Freelance Platform

A modern, full-stack freelance marketplace built to connect talented freelancers with clients efficiently. This platform leverages AI to streamline the hiring process, offering smart proposal generation and resume analysis to help users find the perfect match.

🔗 **[Live Demo](https://ai-freelance-platform-bpmf-psi.vercel.app/)**

## ✨ Features

- **Role-Based Authentication:** Secure login using Clerk with custom onboarding flows for Clients and Freelancers.
- **Project Management:** Clients can seamlessly post, manage, and browse full project listings.
- **Proposal Workflow:** Freelancers can submit proposals for projects. Includes a complete accept/reject workflow for clients with automatic status transitions.
- **AI Proposal Generator:** Integrated with Google Gemini API to help freelancers automatically generate tailored, high-quality project proposals based on project requirements and their skills.
- **AI Resume Analyzer:** Upload a PDF resume and get AI-driven insights and skill extraction using the Gemini API.
- **Real-Time Dashboards:** Dedicated interactive dashboards for both clients and freelancers showing real-time stats (proposals sent/received, active projects, success rates).

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Authentication:** Clerk
- **AI Capabilities:** Google Gemini API

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites
Make sure you have Node.js installed. You will also need accounts for Clerk (Authentication), Neon (PostgreSQL Database), and Google AI Studio (Gemini API Key).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/muhammadsaad5619-hub/ai-freelance-platform.git
   cd ai-freelance-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the required environment variables:
   ```env
   # Clerk Auth
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Database (Neon/PostgreSQL)
   DATABASE_URL="your_postgresql_connection_string"

   # Google Gemini AI
   GEMINI_API_KEY="your_google_gemini_api_key"
   ```

4. **Initialize the database**
   Run Prisma migrations to set up your database schema:
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🔮 Future Enhancements

The following features are planned for future releases to make the platform even more robust:

- **Real-Time Messaging:** Direct chat between clients and freelancers.
- **Stripe Payment Integration:** Secure escrow and milestone-based payments.
- **Admin Dashboard:** Platform management and moderation tools.
- **Reviews & Ratings:** Trust-building system for completed contracts.
- **Notifications System:** In-app and email alerts for proposals, messages, and project updates.
