<script lang="ts">
	import { db } from '$lib/local/dexie';
	import type { DirectusUser } from '$lib/types/directus';

	// SvelteKit passes server data as `data`
	let { data }: { data: { user: DirectusUser } } = $props();
	let user = data.user; // Make user reactive
	// console.log(user);

	// // Optionally, you could have a localUser state for Dexie
	// let localUser = $state(null);
	
	// $effect(() => {
	// 	if (user) {
	// 		(async () => {
	// 			await db.users.put(user);
	// 			localUser = await db.users.get(user.id);
	// 		})();
	// 	}
	// });
</script>

<h1>Profile</h1>
{#if user}
	<p>Server user:</p>
	<p>{user.firstName} {user.lastName}</p>
	<p>Local (Dexie) user:</p>
	<!-- <p>{localUser?.firstName} {localUser?.lastName}</p> -->
{:else}
	<p>Loading...</p>
{/if}