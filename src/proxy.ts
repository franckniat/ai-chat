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
	const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
	const isPasswordRoute = passwordRoutes.includes(request.nextUrl.pathname);
	const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);
	const isApiAuthRoute = apiAuthRoutes.some((route) => request.nextUrl.pathname.startsWith(route));

	if (!session) {
		if (isAuthRoute || isPasswordRoute || isApiAuthRoute) {
			return NextResponse.next();
		}
	}

	if (isProtectedRoute && !session?.user.emailVerified) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (session && isAuthRoute) {
		return NextResponse.redirect(new URL("/chat", request.url));
	}

	return NextResponse.next();
	//Todo: handle callback url
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};