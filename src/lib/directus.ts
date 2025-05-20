import { createDirectus, rest, authentication, realtime, readItems } from "@directus/sdk";
import { PUBLIC_APIURL, PUBLIC_COOKIE_DOMAIN } from '$env/static/public';
import { apply } from '@directus/visual-editing';
import { browser } from '$app/environment'

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

export function getPublicDirectusInstance(fetch?: typeof window.fetch, token?: string){
	const options = fetch ? { globals: { fetch } } : {};
	const publicDirectus = createDirectus(PUBLIC_APIURL, options)
		.with(rest());
	return publicDirectus;
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

export async function enableVisualEditing({
	directusUrl,
	customClass = '',
	onSaved = undefined,
	elements = undefined
  }: {
	directusUrl: string,
	customClass?: string,
	onSaved?: (data: any) => void,
	elements?: HTMLElement | HTMLElement[]
  }) {
	if (!browser) return;
	return apply({
	  directusUrl,
	  customClass,
	  onSaved,
	  elements
	});
}

export async function getPublicSiteData() {
	
	const directus = getPublicDirectusInstance();

	const pages = await directus.request(readItems('pages', {
		fields: ['*.*.*.*.*.*'],
	}));

	const navigation = await directus.request(readItems('navigation', {
		fields: ['*.*.*'],
	}));
	const globals = await directus.request(readItems('globals', {
		fields: ['*.*.*'],
	}));
	
	const posts = await directus.request(readItems('posts', {
		fields: ['*.*.*'],
	}));
	const installs = await directus.request(readItems('installs', {
		fields: ['*.*.*'],
	}));
	return {
		navigation,
		globals,
		pages,
		posts,
		installs
	};
}

export function getDirectusImage(id: string){
	const url = PUBLIC_APIURL + '/assets/' + id;
	return url;
}