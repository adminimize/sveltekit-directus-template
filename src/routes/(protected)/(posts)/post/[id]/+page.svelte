<script lang="ts">
    import { browser } from "$app/environment";
    import { db } from '$lib/local/dexie';
    import type { Post } from '$lib/types/directus';
    import type { Attachment } from 'svelte/attachments';

    import "quill/dist/quill.snow.css";
    import "quill/dist/quill.bubble.css";

    let { data } = $props();
    let post = $state<Post | null>(null);

    // Load post from Dexie and update state
    $effect(() => {
        async function loadPost() {
            if (browser && data?.post) {
                const loaded = await db.posts.get(data.post);
                post = loaded ?? null;
                console.log("[snapshot] posteffect", $state.snapshot(post));
            }
        }
        loadPost();
    });

    function quillAttachment(post: Post | null): Attachment {
        return (element) => {
            let quill: any;
            (async () => {
                const Quill = (await import('quill')).default;
                quill = new Quill(element as HTMLElement, {
                    theme: "bubble",
                    placeholder: "Write your post content here...",
                    modules: { toolbar: true }
                });

                // Wait for Quill to be fully initialized
                setTimeout(() => {
                    if (post?.content) {
                        // Use dangerouslyPasteHTML to set HTML content
                        quill.clipboard.dangerouslyPasteHTML(post.content, 'api');
                    }
                }, 0);
            })();
            // Cleanup
            return () => {
                quill = null;
            };
        };
    }
</script>

<div class="flex flex-col items-center w-full min-h-screen bg-gray-50 py-12 px-4">
    <div class="w-full bg-white rounded-xl shadow-lg p-8">
        {#if post}
            <input
                type="text"
                class="w-full text-4xl font-bold mb-8 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-gray-100 placeholder-gray-400"
                placeholder="Post Title"
                bind:value={post.title}
                autocomplete="off"
            />
            <div>
                <div {@attach quillAttachment(post)}></div>
            </div>
            <div class="text-sm text-gray-400">Post ID: {post.id}</div>
        {:else}
            <div>Loading...</div>
        {/if}
    </div>
</div>
