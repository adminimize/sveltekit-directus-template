import type { DirectusUser } from '$lib/types/directus';
import type { Post } from '$lib/types/directus';
import type { ExtensionCheck } from '$lib/types/directus';

export const collectionsToSync = [
  {
    name: 'posts',
    endpoint: 'posts',
    type: 'post',
  },
  {
    name: 'extension_checks',
    endpoint: 'extension_checks',
    type: 'ExtensionCheck',
  },
  
  // Add more collections as needed
] as const;