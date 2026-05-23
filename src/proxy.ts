import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySessionFromRequest } from "@/lib/session";

const protectedPrefixes = ["/dashboard", "/routines", "/logs"];
const authOnlyPaths = ["/login", "/register"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  const isAuthOnly = authOnlyPaths.some((p) => pathname.startsWith(p));

  const session = await verifySessionFromRequest(req);

  if (isProtected && !session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAuthOnly && session) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
