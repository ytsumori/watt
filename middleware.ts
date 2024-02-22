export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/((?!api|restaurant-dashboard|admin|_next/static|_next/image|favicon.ico).*)",
  ],
};
