import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(function middleware(request: NextRequest) {
  const nextUrl = request.nextUrl;
  if (nextUrl.pathname.startsWith("/restaurant-dashboard")) {
    // TODO: LIFFログイン実装
    return NextResponse.redirect(new URL("https://example.com"));
  }
});

export const config = {
  matcher: ["/[^/]((?!api|login|restaurant-dashboard).*)"],
};
