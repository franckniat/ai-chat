import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
	// Match only internationalized pathnames
	// We exclude api, _next, static files, and auth/chat routes if they shouldn't be localized
	// However, the user asked to localize public pages EXCEPT auth and chat.
	// So we match everything EXCEPT api, _next, auth routes, chat routes, and static files.
	matcher: [
		'/((?!api|_next|_vercel|.*\\..*|auth|login|register|forgot-password|reset-password|chat|dashboard).*)'
	]
};