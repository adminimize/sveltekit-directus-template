<script lang="ts">
	import '../app.css';
	import { getDirectusInstance } from '$lib/directus'; 
	import { setContext } from 'svelte';

	let { children, data } = $props(); 
	
	
	const directus = getDirectusInstance(fetch,data.token ?? undefined) 
	setContext('directus', directus); 
	
	console.log("DATA", data);

</script>


<div class="flex flex-col items-center justify-center bg-gray-100">
{#if data.token} 
<a href="/logout" class="border border-black rounded-md p-2">logout</a> 
{:else} 
<a href="/login">Login</a> 
{/if} 


<div class="flex flex-col items-center justify-center h-screen">
	{@render children()}
</div>

</div>