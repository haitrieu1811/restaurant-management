import { NextResponse, NextRequest } from "next/server";

const privatePaths = ["/manage"];
const unAuthPaths = ["/login"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = !!request.cookies.get("accessToken");
  if (privatePaths.some((path) => pathname.startsWith(path)) && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && isAuth) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
