import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Session } from "@/lib/auth";

const authRoutes = ["/login", "/register", "/email-verified"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const protectedRoutes = ["/chat"];
const apiAuthRoutes = ["/api/auth/"];

export async function proxy(request: NextRequest) {

	const { data: session } = await betterFetch<Session>(
		"/api/auth/get-session",
		{
			baseURL: process.env.BETTER_AUTH_URL,
			headers: {
				//get the cookie from the request
				cookie: request.headers.get("cookie") || "",
			},
		},
	);
	const { pathname } = request.nextUrl;
	const isAuthRoute = authRoutes.includes(pathname);
	const isPasswordRoute = passwordRoutes.includes(pathname);
	// Comparaison par prefixe : `.includes()` en egalite stricte laissait
	// `/chat/<id>` hors du perimetre protege.
	const isProtectedRoute = protectedRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
	const isApiAuthRoute = apiAuthRoutes.some((route) => pathname.startsWith(route));

	if (!session) {
		if (isAuthRoute || isPasswordRoute || isApiAuthRoute) {
			return NextResponse.next();
		}
	}

	if (isProtectedRoute && !session?.user.emailVerified) {
		// On conserve la destination pour que le login y renvoie ensuite.
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
		return NextResponse.redirect(loginUrl);
	}

	if (session && isAuthRoute) {
		return NextResponse.redirect(new URL("/chat", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};