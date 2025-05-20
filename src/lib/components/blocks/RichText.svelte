<script>
  let { block } = $props();
  // block.item.content is HTML
</script>

<section class="prose max-w-none">
  {#if block.item.headline}
    <h2 class="mb-2">{block.item.headline}</h2>
  {/if}
  <div>{@html block.item.content}</div>
</section>
