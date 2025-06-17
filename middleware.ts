// /middleware.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { userId } = auth();

  const isPublicPath = ["/", "/sign-in", "/sign-up"].includes(req.nextUrl.pathname);

  if (!userId && !isPublicPath) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};