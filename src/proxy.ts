import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

<<<<<<< HEAD:src/middleware.ts
export default createMiddleware(routing);
=======
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
>>>>>>> upstream/main:src/proxy.ts

export const config = {
	// Match only internationalized pathnames
	// We exclude api, _next, static files, and auth/chat routes if they shouldn't be localized
	// However, the user asked to localize public pages EXCEPT auth and chat.
	// So we match everything EXCEPT api, _next, auth routes, chat routes, and static files.
	matcher: [
		'/((?!api|_next|_vercel|.*\\..*|auth|login|register|forgot-password|reset-password|chat|dashboard).*)'
	]
};