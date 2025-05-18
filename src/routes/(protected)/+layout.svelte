<script lang="ts">
    import { db } from '$lib/local/dexie';
	import type { DirectusUser, BulkData, Post } from '$lib/types/directus';
	import { browser } from '$app/environment';
	import { getDirectusInstance } from '$lib/directus';
	import { initializeRealtimeSync, syncDexieToDirectus} from '$lib/local/realtime';

	// SvelteKit passes server data as `data`
	let { children, data }: { children: any, data: { 
			currentUser: DirectusUser, 
			allUsers: DirectusUser[], 
			bulkData: BulkData,
            token: string
		} } = $props();

		const directus = getDirectusInstance(undefined, data.token ?? undefined);
		

			console.log("all data", data);

  // Load bulkData into Dexie and setup realtime sync for posts
  $effect(() => {
        (async () => {
            if (data.bulkData) {
                // Example for posts
                if (data.bulkData.posts) {
                    console.log('Dexie: write posts', data.bulkData.posts);
                    await db.posts.bulkPut(data.bulkData.posts);
                }
                // Example for extension_checks
                if (data.bulkData.extensionChecks) {
                    console.log('Dexie: write extensionChecks', data.bulkData.extensionChecks);
                    await db.extensionChecks.bulkPut(data.bulkData.extensionChecks);
                }
            }
			if (data.allUsers) {
                const validUsers = data.allUsers.filter(u => u.id);
                console.log('Dexie: write users', validUsers);
				await db.users.bulkPut(validUsers);
			}
            // Do NOT write currentUser to Dexie, just keep in Svelte state

            // Setup realtime sync for posts (browser only)
            if (browser && data.currentUser) {
                initializeRealtimeSync(directus, 'posts', db, all_posts);
            }
        })();
        // No return value for $effect
    });

	syncDexieToDirectus(db, directus, 'posts');

    let status: 'LOADING' | 'READY' | 'CHANGING' | 'CREATING' = $state('LOADING');
    let all_posts: Post[] = $state(data.bulkData.posts ?? []);

    $effect(() => {
      // Set status to READY after initial data is set
      if (status === 'LOADING') {
        status = 'READY';
      }
    });

    function updatePostTitle(index: number, newTitle: string) {
      all_posts = [
        ...all_posts.slice(0, index),
        { ...all_posts[index], title: newTitle, __local_modified: true },
        ...all_posts.slice(index + 1)
      ];
    }

    async function savePostState(posts: Post[]) {
      await db.posts.bulkPut(posts);
    }

    $effect(() => {
      if (status === 'READY') {
        savePostState($state.snapshot(all_posts));
      }
    });
</script>

<div>
    <h1>Protected Layout</h1>
    <!-- Editable Posts List -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <h2 class="text-xl font-bold mb-4">All Posts (Editable)</h2>
      <div class="space-y-4">
        {#each all_posts as post, i (post.id)}
          <div class="flex items-center space-x-2">
            <input
              class="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={post.title}
              oninput={e => updatePostTitle(i, (e.target as HTMLInputElement).value)}
              placeholder="Post title"
            />
            <span class="text-gray-400 text-xs">ID: {post.id}</span>
          </div>
        {/each}
      </div>
    </div>
    {@render children()}
</div>