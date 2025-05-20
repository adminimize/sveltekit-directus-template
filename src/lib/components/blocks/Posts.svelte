<script>
    import { page } from "$app/state";
  let { block, data } = $props();

  // Find the collection name from the block's item
  let collection = block?.item?.collection;
  let posts = page.data?.[collection] || [];
  console.log("POSTS", posts);
</script>

<div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
  <div class="px-4 py-5 sm:p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {#each posts as post (post.slug)}
      <div class="bg-gray-50 rounded-lg shadow p-4 flex flex-col">
        <h3 class="text-lg font-semibold mb-2">{post.title}</h3>
        <p class="text-gray-600 mb-4 truncate">{@html post.content || ''}</p>
        <a class="text-blue-600 hover:underline mt-auto" href={`/${collection}/${post.slug}`}>Read more</a>
      </div>
    {/each}
  </div>
</div> 