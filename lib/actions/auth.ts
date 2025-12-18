"use server";

import { signIn } from "@/auth";

export async function handleSignIn() {
  // ✅ HER ZAMAN HOMEPAGE
  await signIn("github", { redirectTo: "/" });
}