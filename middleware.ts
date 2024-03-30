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
    // @todo: できれば許可するメールアドレスを@kiizan-kiizan.co.jpのみにするというのをgoogleの認証側で行いたい
    const isValidMailAddress =
      data?.user?.email &&
      (data.user.email.endsWith("@kiizan-kiizan.co.jp") || data.user.email === "miso.devel@gmail.com");

    return isAuthedUser && isValidMailAddress
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {};
