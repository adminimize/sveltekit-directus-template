import { getDirectusInstance } from '$lib/directus';
import { readMe, readItems, readUsers } from '@directus/sdk';
import type { LayoutServerLoad } from './$types';
import type { DirectusUser, BulkData, directusUsers } from '$lib/types/directus';
import { redirect } from '@sveltejs/kit';
import { collectionsToSync } from '$lib/local/syncConfig';


import { keysToCamelCase } from '$lib/utils/case';

async function loadBulkData(directus: any) {
  const items: Record<string, any> = {};

  for (const col of collectionsToSync) {
    // Fetch all items from the collection
    console.log("syncing", col.endpoint);
    const response = await directus.request((readItems as any)(col.endpoint));
    const colItems = keysToCamelCase(response);
    // console.log("all items syncwheee", colItems);
    items[col.name] = colItems;
  }

  return items;
}


export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	if (!locals.user) {
		return redirect(302, '/demo/lucia/login');
	}
    const directus = getDirectusInstance(fetch, locals.token ?? undefined);

    const items = await loadBulkData(directus);
    console.log('SERVER: items', items);
	// const directus = getDirectusInstance(fetch, locals.token ?? undefined);
	const userRaw = await directus.request(readMe());
  const allUsers = keysToCamelCase(await directus.request(readUsers({
    fields: ["id", "email"],
  }))) as DirectusUser[];
  console.log("All users", allUsers);
  console.log('SERVER: allUsers', allUsers);
	const currentUser = keysToCamelCase(userRaw) as DirectusUser;
  console.log('SERVER: currentUser', currentUser);
  const bulkData = keysToCamelCase(items) as BulkData;

    // console.log("User", user);
	return { currentUser, bulkData, allUsers, token: locals.token };
};
