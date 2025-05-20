<script>
    let { block } = $props();
</script>

<section class="py-16 flex flex-col md:flex-row items-center">
  <div class="flex-1">
    {#if block.item.headline}
      <h1 class="text-4xl font-bold mb-4">{block.item.headline}</h1>
    {/if}
    {#if block.item.description}
      <div class="mb-6 text-lg">{@html block.item.description}</div>
    {/if}
    <!-- Add button group if needed -->
  </div>
  {#if block.item.image}
    <img src={block.item.image.url} alt={block.item.image.title} class="w-1/2 rounded shadow" />
  {/if}
</section>