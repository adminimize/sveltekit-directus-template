<script>
  let { globals, navigation } = $props();
  import { getDirectusImage } from '$lib/directus';

  // Social icon SVGs
  const socialIcons = {
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M22.46 5.924c-.793.352-1.646.59-2.54.697a4.48 4.48 0 0 0 1.963-2.475 8.94 8.94 0 0 1-2.828 1.082A4.48 4.48 0 0 0 16.11 4c-2.48 0-4.49 2.014-4.49 4.495 0 .353.04.697.116 1.025C7.728 9.37 4.1 7.6 1.67 4.98c-.39.67-.61 1.45-.61 2.28 0 1.574.8 2.96 2.02 3.77-.74-.024-1.44-.227-2.05-.567v.057c0 2.2 1.56 4.03 3.63 4.45-.38.104-.78.16-1.19.16-.29 0-.57-.027-.84-.08.57 1.78 2.23 3.08 4.2 3.12A8.98 8.98 0 0 1 2 19.54a12.67 12.67 0 0 0 6.88 2.02c8.26 0 12.78-6.84 12.78-12.77 0-.19-.01-.38-.02-.57.88-.64 1.65-1.44 2.26-2.35z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.783 2.225 7.15 2.163 8.416 2.105 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.77.13 4.672.388 3.678 1.382 2.684 2.376 2.426 3.474 2.368 4.756.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.058 1.282.316 2.38 1.31 3.374.994.994 2.092 1.252 3.374 1.31C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 1.282-.058 2.38-.316 3.374-1.31.994-.994 1.252-2.092 1.31-3.374.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.058-1.282-.316-2.38-1.31-3.374-.994-.994-2.092-1.252-3.374-1.31C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.25 11.25h-3v-5.5c0-1.378-.028-3.152-1.92-3.152-1.92 0-2.217 1.5-2.217 3.05v5.602h-3v-10h2.885v1.367h.041c.402-.762 1.384-1.563 2.85-1.563 3.05 0 3.613 2.008 3.613 4.623v5.573z"/></svg>`,
    github: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.606-2.665-.304-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 0 1 3-.404c1.02.005 2.045.138 3 .404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.803 5.624-5.475 5.92.43.37.823 1.102.823 2.222v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
  };

  /**
   * @param {string} type
   */
  function getSocialIcon(type) {
    if (typeof type !== 'string') return null;
    const key = type.toLowerCase();
    // @ts-ignore
    return socialIcons[key] || null;
  }
</script>

<footer class="bg-gray-900 text-gray-200 py-8 mt-12 border-t border-gray-800">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-between items-center gap-8">
    <!-- Logo and Site Info -->
    <div class="flex items-center gap-4 w-full md:w-auto justify-center md:justify-start">
      {#if globals.logo}
        <img
          src={getDirectusImage(globals.logo.id)}
          alt={globals.logo.title || globals.title}
          class="h-12 w-12 rounded-full object-cover border border-gray-700 bg-white"
        />
      {/if}
      <div>
        <div class="text-lg font-semibold text-white">{globals.title}</div>
        {#if globals.tagline}
          <div class="text-sm text-gray-400">{globals.tagline}</div>
        {/if}
      </div>
    </div>

    <!-- Navigation Links -->
    {#if navigation && navigation.items && navigation.items.length > 0}
      <nav class="flex flex-wrap gap-4 justify-center md:justify-end w-full md:w-auto">
        {#each navigation.items as item}
          {#if item.page}
            <a
              href={item.page.slug ? `/${item.page.slug}` : '#'}
              class="hover:text-white text-gray-400 transition-colors text-sm font-normal px-1 py-0.5 rounded"
            >
              {item.title}
            </a>
          {/if}
        {/each}
      </nav>
    {/if}
  </div>

  <!-- Social Links (if any) -->
  {#if globals.social_links && globals.social_links.length > 0}
    <div class="mt-6 flex justify-center gap-3">
      {#each globals.social_links as link}
        <a
          href={link.url}
          target="_blank"
          rel="noopener"
          class="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          aria-label={link.title || link.type}
          title={link.title || link.type}
        >
          {@html getSocialIcon(link.type) || `<svg class='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'><circle cx='10' cy='10' r='8'/></svg>`}
        </a>
      {/each}
    </div>
  {/if}

  <!-- Copyright -->
  <div class="mt-8 text-xs text-gray-500 text-center">
    &copy; {new Date().getFullYear()} {globals.title}. All rights reserved.
  </div>
</footer>
