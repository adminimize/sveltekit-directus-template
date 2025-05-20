<script lang="ts">
    import { page } from '$app/state';
    import { PUBLIC_APIURL } from '$env/static/public';
    import { getDirectusImage, enableVisualEditing } from '$lib/directus'
    import Footer from '$lib/components/Footer.svelte';
  
    let { children, data } = $props();
    // console.log("Public layout data", data);
  
    // Only enable visual editing if the query param is present
    const visualEditing = page.url.searchParams.get('visual-editing') === '1';
  
    if (visualEditing) {
      enableVisualEditing({
        directusUrl: PUBLIC_APIURL,
        customClass: 'visual-editor-custom'
        // Optionally add onSaved, elements, etc.
      });
    }
  
    // Extract logo and navigation
    const logo = data.globals?.logo?.id;
    const navItems = data.navigation?.[0]?.items ?? [];
    const currentSlug = page.url.pathname.replace(/^\//, '');
  </script>
  
  <nav class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-24 items-center justify-between">
        <div class="flex items-center space-x-10">
          {#if logo}
            <a href="/" class="flex-shrink-0 flex items-center">
              <img src={getDirectusImage(logo)} alt="Logo" class="h-20 w-auto sm:h-14" />
            </a>
          {:else}
            <span class="font-bold text-3xl mr-6">{data.globals?.title ?? 'Site'}</span>
          {/if}
          <div class="hidden md:flex space-x-8">
            {#each navItems as item}
              {#if item.page}
                <a
                  href={`/${item.page.slug}`}
                  class="text-lg font-semibold px-2 pb-1 transition-colors duration-200 {currentSlug === item.page.slug ? 'border-b-4 border-[#ff7c2d] text-[#ff7c2d]' : 'border-b-4 border-transparent text-gray-700 hover:text-[#ff7c2d] hover:border-[#ff7c2d]'}"
                >
                  {item.title}
                </a>
              {/if}
            {/each}
          </div>
        </div>
        <div class="ml-auto">
          <a
            href="/quote"
            class="inline-block px-5 py-2 rounded-md bg-[#ff7c2d] text-white font-bold text-base shadow hover:bg-orange-600 transition-colors duration-200"
          >
            Get A Quote
          </a>
        </div>
      </div>
    </div>
  </nav>
  
  <div class="min-h-screen bg-white">
    <main class="max-w-7xl mx-auto px-6 py-12">
        {@render children()}
    </main>
  </div>

  <Footer globals={data.globals} navigation={data.navigation[1]} />
  
  <style>
    :global(.visual-editor-custom) {
      --directus-visual-editing--rect--border-color: #3b82f6;
      --directus-visual-editing--rect--border-width: 2px;
      --directus-visual-editing--rect--border-radius: 4px;
      --directus-visual-editing--edit-btn--bg-color: #3b82f6;
    }
  </style>
