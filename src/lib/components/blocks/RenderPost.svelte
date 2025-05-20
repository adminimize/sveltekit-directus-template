<script>
  let { post } = $props();
</script>

<article class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
    {#if post.headline}
      <p class="text-lg text-gray-500 mb-4">{post.headline}</p>
    {/if}
  </header>
  <section class="prose prose-lg max-w-none">
    {@html post.content}
  </section>
</article> 