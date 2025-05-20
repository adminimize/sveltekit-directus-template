<script lang="ts">
    import { browser } from "$app/environment";
    import { db } from '$lib/local/dexie';
    import type { Post } from '$lib/types/directus';
    import RichTextEditor from '$lib/components/inputs/RichTextEditor.svelte';
    let { data } = $props();

    let post = $state<Post | null>(null);
    let content = $derived(post?.content ?? null);
    $inspect("Post content updated", content);

    if (browser) {
            (async () => {
                const loaded = await loadPost(data.params.id);
                post = loaded ?? null;
                console.log("post", post);
            })();
        }


    async function loadPost(id: string) {
        try {
            const loaded = await db.posts.get(id);
            console.log("loaded post", loaded);
            return loaded;
        } catch (err) {
            console.error('Error loading post:', err);
        }
    }
</script>

<div class="flex flex-col items-center w-full min-h-screen bg-gray-50 py-12 px-4">
    {#if post}
        <div class="w-full bg-white rounded-xl shadow-lg p-8">
            <input
                type="text"
                class="w-full text-4xl font-bold mb-8 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100 placeholder-gray-400"
                placeholder="Post Title"
                bind:value={post.title}
                autocomplete="off"
            />
            <RichTextEditor 
                bind:content={content}
                placeholder="Write your post content here..."
                autofocus={true}
            />
            <div class="text-sm text-gray-400 mt-4">Post ID: {post.id}</div>
        </div>
    {:else}
        <div>Loading...</div>
    {/if}
</div> 