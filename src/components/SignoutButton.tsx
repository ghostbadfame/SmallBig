"use client";
import React from "react";
import { signOut } from "next-auth/react";

export default function SignoutButton({ type }: { type?: string }) {
  return (
    <div>
      <button
        className="p-3 bg-blue-500 text-black rounded-md border border-x-2"
        onClick={() =>
          signOut({
            callbackUrl: "/login",
            redirect: true,
          })
        }
      >
        Sign Out
      </button>
    </div>
  );
}
