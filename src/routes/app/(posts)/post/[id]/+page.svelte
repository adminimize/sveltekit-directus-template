<script lang="ts">
    import { browser } from "$app/environment";
    import { db } from '$lib/local/dexie';
    import type { Post } from '$lib/types/directus';
    import RichTextEditor from '$lib/components/inputs/RichTextEditor.svelte';
    let { data } = $props();
    let post = $state<Post | null>(null);
    let content = $state<string | null>(null);

    $effect(() => {
        loadPost();
    });

    function handleProseMirrorChange(docJSON: unknown) {
        if (post) {
            post.content = JSON.stringify(docJSON);
        }
    }

    async function loadPost() {
            if (browser && data?.post) {
                const loaded = await db.posts.get(data.post);
                post = loaded ?? null;
            }
            content = post?.content ?? null;
            console.log("content", content);
        }
</script>

<div class="flex flex-col items-center w-full min-h-screen bg-gray-50 py-12 px-4">
    {#if post}
        <RichTextEditor bind:content={content} autofocus={true} />
    {/if}
    <p>{content}</p>
    <div class="w-full bg-white rounded-xl shadow-lg p-8">
        {#if post}
            <input
                type="text"
                class="w-full text-4xl font-bold mb-8 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100 placeholder-gray-400"
                placeholder="Post Title"
                bind:value={post.title}
                autocomplete="off"
            />
            <!-- <div>
                <Editor value={post.content} onChange={handleProseMirrorChange} />
            </div> -->
            <div class="text-sm text-gray-400">Post ID: {post.id}</div>
        {:else}
            <div>Loading...</div>
        {/if}
    </div>
</div> 