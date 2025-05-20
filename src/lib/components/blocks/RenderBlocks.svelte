<script>
    let { blocks, pageData } = $props();
    console.log("BLOCKS in render blocks", blocks);
    import RichText from './RichText.svelte';
    import Gallery from './Gallery.svelte';
    import Hero from './Hero.svelte';
    import Posts from './Posts.svelte';
  
  </script>
  
  {#each blocks as block (block.id)}
    {#if !block.hide_block}
      {#if block.collection === 'block_richtext'}
        <RichText {block} />
      {:else if block.collection === 'block_gallery'}
        <Gallery {block} />
      {:else if block.collection === 'block_hero'}
        <Hero {block} />
      {:else if block.collection === 'block_posts'}
        <Posts {block} data={pageData} />
      {/if}
    {/if}
  {/each}