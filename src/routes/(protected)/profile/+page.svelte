<script lang="ts">
	import type { PageServerData } from './$types';
	let { data }: { data: any } = $props();
</script>

<h1>Profile</h1>
{#if data && data.user}
	<ul>
		<li><b>ID:</b> {data.user.id}</li>
		<li><b>Name:</b> {data.user.first_name} {data.user.last_name}</li>
		<li><b>Email:</b> {data.user.email}</li>
		<li><b>Status:</b> {data.user.status}</li>
	</ul>
{:else}
	<p>Could not load user profile.</p>
{/if} 