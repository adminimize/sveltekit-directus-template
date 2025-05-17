import { getDirectusInstance } from '$lib/directus';
import { readMe } from '@directus/sdk';
import type { PageServerLoad } from './$types';
import type { DirectusUser } from '$lib/types/directus';
import { redirect } from '@sveltejs/kit';

import { keysToCamelCase } from '$lib/utils/case';


export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) {
		return redirect(302, '/demo/lucia/login');
	}
	const directus = getDirectusInstance(fetch, locals.token ?? undefined);
	const userRaw = await directus.request(readMe());
	const user = keysToCamelCase(userRaw) as DirectusUser;
    // console.log("User", user);
	return { user };
};
