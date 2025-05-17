import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";
import { Session } from "@/lib/auth";

const authRoutes = ["/login", "/register", "/email-verified"];
const passwordRoutes = ["/reset-password", "/forgot-password"];
const protectedRoutes = ["/chat"];

export async function middleware(request: NextRequest) {

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

	if (!session) {
		if (isAuthRoute || isPasswordRoute) {
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
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};