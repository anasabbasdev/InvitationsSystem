import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects /owner/* (except /owner/login) and /admin/* by requiring a valid
 * Supabase Auth session. Also refreshes the session cookie on every request
 * in those trees. Public routes (/, /i/*, /s/*, /t/*, /api/*) never run this
 * middleware — see config.matcher below.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  // Supabase not configured — do not block routes (show login UI with config hint).
  if (!url || !anonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    const isLoginPage = request.nextUrl.pathname === "/owner/login";

    if (!data.user && !isLoginPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/owner/login";
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (data.user && isLoginPage) {
      const eventsUrl = request.nextUrl.clone();
      eventsUrl.pathname = "/owner/events";
      eventsUrl.search = "";
      return NextResponse.redirect(eventsUrl);
    }
  } catch {
    // Edge / Workers: never crash the request — let the page render or redirect.
    const isLoginPage = request.nextUrl.pathname === "/owner/login";
    const isProtected =
      request.nextUrl.pathname.startsWith("/owner/") && !isLoginPage;
    if (isProtected) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/owner/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/owner/:path*", "/admin/:path*"],
};
