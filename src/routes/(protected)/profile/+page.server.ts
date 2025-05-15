import { getDirectusInstance } from '$lib/directus';
import { readMe } from '@directus/sdk';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ fetch, locals }) => {
    console.log("PROFILE EVENT", locals);
    console.log("PROFILE EVENT - user:", locals.user);
    console.log("PROFILE EVENT - token:", locals.token);

	if (!locals.user) {
        console.log("NOT GOOD bro");
		return redirect(302, '/demo/lucia/login');
	}

    const directus = getDirectusInstance(fetch, locals.token ?? undefined);
    const user = await directus.request(readMe());
    console.log("User", user);
	return { user };
};