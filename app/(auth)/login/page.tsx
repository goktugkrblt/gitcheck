"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            GitTrack<span className="text-blue-500">.me</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Analyze your GitHub profile and unlock your potential
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">
              Get Started
            </h2>
            <p className="text-gray-400 mb-6">
              Sign in with GitHub to analyze your developer profile and get
              personalized insights.
            </p>

            <Button
              onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>Free forever • No credit card required</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
            <div className="text-2xl font-bold text-blue-500">1-10</div>
            <div className="text-xs text-gray-400 mt-1">Score Range</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
            <div className="text-2xl font-bold text-green-500">Free</div>
            <div className="text-xs text-gray-400 mt-1">First Scan</div>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
            <div className="text-2xl font-bold text-purple-500">24/7</div>
            <div className="text-xs text-gray-400 mt-1">Access</div>
          </div>
        </div>
      </div>
    </div>
  );
}