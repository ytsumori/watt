export { default } from "next-auth";

export const config = {
  matcher: ["/[^/]((?!api|login|restaurant-dashboard).*)"],
};
