<script>
  import RenderPost from '$lib/components/blocks/RenderPost.svelte';
  import { page } from '$app/state';

  // Find the post by slug from the page data
  let slug = page.url.pathname.split('/').pop();
  let post = page.data?.posts?.find(p => p.slug === slug) || page.data?.installs?.find(p => p.slug === slug);
</script>

{#if post}
  <RenderPost {post} />
{:else}
  <div class="p-8 text-center text-gray-500">Post not found.</div>
{/if}
