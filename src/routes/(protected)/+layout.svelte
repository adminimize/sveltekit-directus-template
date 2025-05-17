<script lang="ts">
    import { db } from '$lib/local/dexie';
	import type { DirectusUser } from '$lib/types/directus';
	import type { BulkData } from '$lib/types/directus';

	// SvelteKit passes server data as `data`
	let { children, data }: { children: any, data: { user: DirectusUser } } = $props();
	let user: DirectusUser = data.user; // Make user reactive
	let bulkData: BulkData = data.items;

	// Optionally, you could have a localUser state for Dexie
	let localUser = $state(null);
	
	$effect(() => {
		if (user) {
			(async () => {
				await db.users.put(user);
				localUser = await db.users.get(user.id);
			})();
		}
	});
</script>

<div>
    <h1>Protected Layout</h1>
    {@render children()}
</div>