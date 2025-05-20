<script>
  import RenderBlocks from '$lib/components/blocks/RenderBlocks.svelte';
  import { page } from '$app/state';

  console.log("PAGE in +page", page);

  let url = page.url.pathname;
  let currentPage = getCurrentPage(url);
  console.log("CUURENT PAGESGESG", currentPage);

  function getCurrentPage(url) {
    if (url === '/') {
        return page.data.pages.find(page => page.slug === 'home')
    } else {
        return page.data.pages.find(page => page.slug === url.replace('/', ''))
    }
  }

  let blocks = currentPage.blocks;

</script>

<RenderBlocks {blocks} />