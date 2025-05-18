<script lang="ts">
    import { db } from '$lib/local/dexie';
	import type { DirectusUser, BulkData, Post } from '$lib/types/directus';
	import { browser } from '$app/environment';
	import { getDirectusInstance } from '$lib/directus';
	import { initializeRealtimeSync } from '$lib/local/realtime';

	// SvelteKit passes server data as `data`
	let { children, data }: { children: any, data: { 
			currentUser: DirectusUser, 
			allUsers: DirectusUser[], 
			bulkData: BulkData } } = $props();

			console.log("all data", data);

  // Load bulkData into Dexie and setup realtime sync for posts
  $effect(() => {
        if (data.bulkData) {
            (async () => {
                // Example for posts
                if (data.bulkData.posts) {
                    await db.posts.bulkPut(data.bulkData.posts);
                }
                // Example for extension_checks
                if (data.bulkData.extensionChecks) {
                    await db.extensionChecks.bulkPut(data.bulkData.extensionChecks);
                }
            })();
        }
		if (data.allUsers) {
			(async () => {
				await db.users.bulkPut(data.allUsers);
			})();
		}
		if (data.currentUser) {
			(async () => {
				await db.users.put(data.currentUser);
			})();
		}

        // Setup realtime sync for posts (browser only)
        if (browser && data.currentUser) {
            // Use the user's token if available
            const directus = getDirectusInstance(undefined, data.token ?? undefined);
            const teardown = initializeRealtimeSync(directus, 'posts', db);
            return teardown;
        }
    });

    // Svelte 5: deeply reactive posts array
    let all_posts: Post[] = $state([]);

    $effect(() => {
        if (browser) {
            (async () => {
                all_posts = await db.posts.orderBy('title').toArray();
            })();
            const updatePosts = async () => {
                all_posts = await db.posts.orderBy('title').toArray();
            };
            db.posts.hook('creating', updatePosts);
            db.posts.hook('updating', updatePosts);
            db.posts.hook('deleting', updatePosts);
            return () => {
                db.posts.hook('creating').unsubscribe(updatePosts);
                db.posts.hook('updating').unsubscribe(updatePosts);
                db.posts.hook('deleting').unsubscribe(updatePosts);
            };
        }
    });
</script>

<div>
    <h1>Protected Layout</h1>
    <!-- TEMP: List all posts by title -->
    <div style="background: #f8f8f8; padding: 1em; margin-bottom: 1em; border: 1px solid #ccc;">
      <h2>All Posts (TEMP)</h2>
      <ul>
        {#each all_posts as post}
          <li>{post.title ?? '(no title)'}</li>
        {/each}
      </ul>
    </div>
    {@render children()}
</div>