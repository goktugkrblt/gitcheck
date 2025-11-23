import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Şimdilik basit bir middleware
  // NextAuth session kontrolü sonra ekleyeceğiz
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/roadmap/:path*"],
};