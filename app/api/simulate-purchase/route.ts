import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // User'ı PRO yap
    await prisma.user.update({
      where: { email: session.user.email },
      data: { plan: "PRO" }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Simulate purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to simulate purchase' },
      { status: 500 }
    );
  }
}