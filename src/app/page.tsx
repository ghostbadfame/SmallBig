"use client";


import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SignoutButton from "@/components/SignoutButton";
import LeadList from "@/components/LeadList";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Redirect to login if no session is found
  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lead Dashboard</h1>
          <SignoutButton />
        </div>
        <LeadList/>
        
        
        <p>Welcome to your dashboard. Click the button above to view your lead list.</p>
      </div>
    </main>
  );
}
