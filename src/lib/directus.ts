import { createDirectus, rest, authentication, realtime } from "@directus/sdk";
import { PUBLIC_APIURL, PUBLIC_COOKIE_DOMAIN } from '$env/static/public';

export function getDirectusInstance(fetch?: typeof window.fetch, token?: string) {
	console.log('[Directus] getDirectusInstance called with fetch:', !!fetch, 'token:', token);
	const options = fetch ? { globals: { fetch } } : {};
	const directus = createDirectus(PUBLIC_APIURL, options)
		.with(authentication('cookie', { credentials: 'include' }))
		.with(rest())
		.with(realtime());
	if (token) directus.setToken(token);
	console.log('[Directus] getDirectusInstance returning directus instance:', !!directus);
	return directus;
}

export function constructCookieOpts(age: number) {
	const opts: any = {
		path: '/',
		httpOnly: true,
		sameSite: 'strict' as const,
		secure: process.env.NODE_ENV === 'production',
		maxAge: age
	};
	if (process.env.NODE_ENV === 'production') {
		opts.domain = PUBLIC_COOKIE_DOMAIN;
	}
	console.log('[Directus] constructCookieOpts called with age:', age, 'returning:', opts);
	return opts;
} 