// If you haven't already, install jsonwebtoken:
// bun add jsonwebtoken
// or
// npm install jsonwebtoken
import jwt from "jsonwebtoken";
import { PUBLIC_APIURL } from '$env/static/public';
import { redirect, type Handle } from '@sveltejs/kit';
import { constructCookieOpts } from '$lib/directus';

const TOKEN_EXPIRATION_BUFFER = 300;

// Extend event.locals type for user and token
declare module '@sveltejs/kit' {
	interface Locals {
		user?: string;
		token?: string;
	}
}

// Suppress TS error for missing jsonwebtoken types
// Remove this if you install @types/jsonwebtoken
declare module 'jsonwebtoken';

async function refreshAccessToken(cookies: import('@sveltejs/kit').Cookies) {
	const res = await fetch(PUBLIC_APIURL + "/auth/refresh", {
		method: "POST",
		headers: {
			Accept: "application/json, text/plain, */*",
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh_token: cookies.get('refresh_token') }),
	});
	if (res.status >= 300) {
		cookies.delete('refresh_token', { path: '/' });
		cookies.delete('access_token', { path: '/' });
		throw new Error("Refresh Token Status != 200");
	}
	const data = (await res.json()).data;
	cookies.set("refresh_token", data.refresh_token, constructCookieOpts(60 * 60 * 24 * 30));
	cookies.set("access_token", data.access_token, constructCookieOpts(Math.floor(data.expires / 1000)));
}

function isTokenExpired(jwtPayload: any) {
	return jwtPayload?.exp < Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_BUFFER;
}

function shouldProtectRoute(routeId: string | null) {
	return routeId ? routeId.split("/").includes("(protected)") : false;
}

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, url, route } = event;

	console.log('[HOOKS] Incoming cookies:', {
		access_token: cookies.get('access_token'),
		refresh_token: cookies.get('refresh_token')
	});

	if (cookies.get('access_token') || cookies.get('refresh_token')) {
		let jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token')) : false;
		console.log('[HOOKS] Decoded JWT payload:', jwtPayload);
		if (isTokenExpired(jwtPayload) || !cookies.get('access_token')) {
			try {
				await refreshAccessToken(cookies);
				jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token')) : false;
				console.log('[HOOKS] Refreshed and decoded JWT payload:', jwtPayload);
			} catch (err) {
				console.log('[HOOKS] Error refreshing token:', err);
				cookies.delete('refresh_token', { path: '/' });
				cookies.delete('access_token', { path: '/' });
			}
		}
		event.locals.user = jwtPayload?.id;
		event.locals.token = cookies.get('access_token');
		console.log('[HOOKS] Set event.locals:', { user: event.locals.user, token: event.locals.token });
	}

	if (route && shouldProtectRoute(route.id) && !event.locals.user) {
		console.log('[HOOKS] Redirecting to signin because user is not authenticated for protected route:', route.id);
		throw redirect(302, `/signin?redirectedFrom=${encodeURIComponent(url.pathname)}`);
	}

	return await resolve(event, {
		filterSerializedResponseHeaders: (key) => key.toLowerCase() === 'content-type'
	});
};
