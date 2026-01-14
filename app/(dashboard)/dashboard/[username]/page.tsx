"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UsernamePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  useEffect(() => {
    // Redirect to dashboard with username query param
    router.replace(`/dashboard?username=${username}`);
  }, [username, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white/60 text-sm font-mono">
        Redirecting to {username}...
      </div>
    </div>
  );
}
