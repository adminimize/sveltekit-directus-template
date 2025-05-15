import { fail, redirect } from '@sveltejs/kit';
import { getDirectusInstance, constructCookieOpts } from '$lib/directus';
import { PUBLIC_APIURL } from '$env/static/public';
import type { Actions, PageServerLoad } from './$types';
import { login } from "@directus/sdk";;

const REFRESH_TOKEN_TTL = 7; // days

export const load: PageServerLoad = async (event) => {
	if (event.locals.token) redirect(302, '/profile');
	return {};
};

const loginUser = async (request: Request, email: string, password: string) => {
	let req = await fetch(`${PUBLIC_APIURL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'user-agent': request.headers.get("user-agent") || "",
		},
		body: JSON.stringify({ email, password })
	});
	if (req.status >= 300) {
		throw new Error(await req.text());
	}
	const json = await req.json();
	return json.data;
};

export const actions: Actions = {
	login: async ({ cookies, request, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const redirectedFrom = url.searchParams.get('redirectedFrom');

		if (!email || !password) {
			return fail(400, { message: 'Email and password are required.' });
		}

		try {
            let tokens = await loginUser(request,email as string,password as string);
            console.log("Tokens", tokens);
            // save cookies
            console.log("accesstoken", tokens.access_token);
            cookies.set('access_token',tokens.access_token, constructCookieOpts(Math.floor(tokens.expires/1000)));
            cookies.set('refresh_token', tokens.refresh_token, constructCookieOpts(60 * 60 * 24 * REFRESH_TOKEN_TTL));
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            return fail(400, { message });
        }

        // event.cookies.set('access_token', access_token, constructCookieOpts(expires));
		// event.cookies.set('refresh_token', refresh_token, constructCookieOpts(60 * 60 * 24 * 30)); // 30 days
		
		

		return redirect(302, '/profile');

		// throw redirect(302, redirectedFrom ? redirectedFrom : `/profile`);
	}
}; 