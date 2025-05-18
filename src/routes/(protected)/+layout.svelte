<script lang="ts">
    import { db } from '$lib/local/dexie';
	import type { DirectusUser, BulkData, Post as PostBase } from '$lib/types/directus';
	import { browser } from '$app/environment';
	import { getDirectusInstance } from '$lib/directus';
	import { initializeRealtimeSync, syncDexieToDirectus} from '$lib/local/realtime';

	// Extend Post type to allow __local_modified
	type Post = PostBase & { __local_modified?: boolean };

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

    function addPost() {
      // Generate a unique id (UUID v4 or timestamp-based fallback)
      const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      all_posts = [
        ...all_posts,
        {
          id,
          title: '',
          description: null,
          status: 'draft',
          image: null,
          sort: null,
          slug: null,
          publishedAt: null,
          author: null,
          content: null,
          deleted: false,
          __local_modified: true
        }
      ];
    }

    function deletePost(index: number) {
      const post = all_posts[index];
      if (!post) return;
      const updated = { ...post, deleted: true, __local_modified: true };
      db.posts.put(updated).then(() => {
        console.log('[deletePost] db.posts.put complete for:', updated);
      });
      // Remove from Svelte state so it doesn't get re-saved
      all_posts = [
        ...all_posts.slice(0, index),
        ...all_posts.slice(index + 1)
      ];
      console.log('[deletePost] Marked as deleted and removed from all_posts:', updated);
      console.log('[deletePost] all_posts after delete:', all_posts);
    }

    async function savePostState(posts: Post[]) {
      // Only save non-deleted posts to Dexie to avoid overwriting soft-deleted posts
      const toSave = posts.filter(p => !p.deleted);
      console.log('[savePostState] Saving posts to Dexie:', toSave);
      await db.posts.bulkPut(toSave);
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
      <button class="mb-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onclick={addPost}>+
        Add Post
      </button>
      <div class="space-y-4">
        {#each all_posts.filter(post => !post.deleted) as post, i (post.id)}
          <div class="flex items-center space-x-2">
            <input
              class="border border-gray-300 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              type="text"
              value={post.title}
              oninput={e => updatePostTitle(i, (e.target as HTMLInputElement).value)}
              placeholder="Post title"
            />
            <button class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" onclick={() => deletePost(i)}>
              &times;
            </button>
            <span class="text-gray-400 text-xs">ID: {post.id}</span>
          </div>
        {/each}
      </div>
    </div>
    {@render children()}
</div>