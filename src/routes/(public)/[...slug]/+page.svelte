<script>
    import RenderBlocks from '$lib/components/blocks/RenderBlocks.svelte';
    import { browser } from '$app/environment';
    import { page } from '$app/state';



    let slug = $derived(page.url.pathname);
    $inspect("SLUG", slug);

    console.log("PAGE", page);
    
    let blocks = $state();
    let pageData = $state();
  
    
    let currentPage = $derived(getCurrentPage(slug));
    $inspect("CURRENT PAGE", currentPage);
  
    function getCurrentPage(url) {
        console.log("getting current page for", url);
      if (url === '/') {
          return page.data.pages.find(page => page.slug === 'home')
      } else {
          return page.data.pages.find(page => page.slug === url.replace('/', ''))
      }
    }
    

  
   
      blocks = currentPage.blocks;
      pageData = page.data;
    

  
  </script>
  
  <RenderBlocks blocks={currentPage.blocks} {pageData}/>