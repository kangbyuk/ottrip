// middleware.ts
import { authMiddleware } from "@clerk/nextjs/server"; // ← 이게 v6에서 맞는 방식

export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)"],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};