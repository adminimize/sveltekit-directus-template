<script>
    let { images } = $props();

    let showViewer = $state(false);
    let viewerImage = $state(null);

    function openViewer(image) {
      viewerImage = image;
      showViewer = true;
    }

    function closeViewer() {
      showViewer = false;
      viewerImage = null;
    }
</script>

<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
  {#each images as image}
    <div class="aspect-w-1 aspect-h-1 w-full cursor-pointer" onclick={() => openViewer(image)}>
      <img src={image.url} alt={image.title} class="object-cover w-full h-full rounded shadow" />
    </div>
  {/each}
</div>

{#if showViewer}
  <div class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onclick={closeViewer}>
    <img src={viewerImage.url} alt={viewerImage.title} class="max-w-full max-h-full rounded shadow-lg" />
    <button class="absolute top-4 right-4 text-white text-3xl font-bold" onclick={closeViewer}>&times;</button>
  </div>
{/if}