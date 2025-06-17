// middleware.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 로그인 없이 접근 가능한 경로
const publicPaths = ["/", "/sign-in", "/sign-up"];

function isPublic(path: string) {
  return publicPaths.some((p) => path === p || path.startsWith(p + "/"));
}

export async function middleware(req: NextRequest) {
  const { userId } = auth();
  const path = req.nextUrl.pathname;

  if (!userId && !isPublic(path)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};