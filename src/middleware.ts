import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { authRoutes } from "@/routes";
 
export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request);
	const isAuthRoute = authRoutes.includes(request.nextUrl.pathname);
 
	if (!sessionCookie && isAuthRoute ) {
		return null
	}
	if (sessionCookie && isAuthRoute) {
		return NextResponse.redirect(new URL("/chat", request.url));
	}
}
 
export const config = {
	matcher: ["/dashboard", "/chat", "/settings", "/login", "/register"],
};