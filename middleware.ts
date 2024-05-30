import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareSupabase } from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (request.nextUrl.pathname.startsWith("/admin/login")) {
      return NextResponse.next();
    }
    const supabase = createMiddlewareSupabase();
    const { data, error } = await supabase.auth.getUser();
    const isAuthedUser = !(error || !data?.user);

    return isAuthedUser ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {};
