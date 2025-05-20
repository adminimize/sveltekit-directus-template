<script>
    import { getDirectusImage } from '$lib/directus';
    import GridGallery from './Galleries/GridGallery.svelte';
    // Placeholder imports for future gallery types
    // import CarouselGallery from './Galleries/CarouselGallery.svelte';
    // import MosaicGallery from './Galleries/MosaicGallery.svelte';
   let { block } = $props();
    // block.item.type: 'carousel' | 'mosaic'
    // block.item.items: array of image objects with directus_file
    // You'll need to fetch image data from Directus if you only have IDs
    
    let images = block.item.items.map(item => {
      // directus_file can be an object or a string
      let fileId = typeof item.directus_file === 'object' ? item.directus_file.id : item.directus_file;
      return {
        url: getDirectusImage(fileId),
        title: item.directus_file.title || item.title || fileId
      };
    });
    console.log("IMAGES in gallery", images);

    let type = block.item.type || 'grid';
  </script>
  
  <section class="py-8">
    {#if block.item.headline}
      <h2 class="mb-4 text-xl font-bold">{block.item.headline}</h2>
    {/if}
  
    {#if type === 'grid'}
      <GridGallery {images} />
    {:else if type === 'carousel'}
      <!-- CarouselGallery placeholder -->
      <div>Carousel Gallery coming soon...</div>
    {:else if type === 'mosaic'}
      <!-- MosaicGallery placeholder -->
      <div>Mosaic Gallery coming soon...</div>
    {/if}
  </section>