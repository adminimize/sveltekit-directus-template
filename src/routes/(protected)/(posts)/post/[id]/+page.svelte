<script lang="ts">
    import { browser } from "$app/environment";
    import { db } from '$lib/local/dexie';
    import type { Post } from '$lib/types/directus';
    import type { Attachment } from 'svelte/attachments';
    import { EditorState } from "prosemirror-state";
    import { EditorView } from "prosemirror-view";
    import { Schema, DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
    import { schema as basicSchema } from "prosemirror-schema-basic";
    import { addListNodes } from "prosemirror-schema-list";
    import { exampleSetup } from "prosemirror-example-setup";
    import "prosemirror-view/style/prosemirror.css";
    import "prosemirror-menu/style/menu.css";

    let { data } = $props();
    let post = $state<Post | null>(null);
    let prosemirrorAttach: Attachment | undefined = undefined;

    $effect(() => {
        async function loadPost() {
            if (browser && data?.post) {
                const loaded = await db.posts.get(data.post);
                post = loaded ?? null;
                if (post) {
                    prosemirrorAttach = prosemirrorAttachment(post.content, handleProseMirrorChange);
                } else {
                    prosemirrorAttach = undefined;
                }
            }
        }
        loadPost();
    });

    const mySchema = new Schema({
        nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
        marks: basicSchema.spec.marks,
    });

    function prosemirrorAttachment(content: any, onChange?: (doc: any) => void): Attachment {
        return (element: Element) => {
            let docNode: import("prosemirror-model").Node | undefined = mySchema.topNodeType.createAndFill() ?? undefined;
            if (content) {
                try {
                    docNode = mySchema.nodeFromJSON(typeof content === 'string' ? JSON.parse(content) : content);
                } catch {
                    const temp = document.createElement("div");
                    temp.innerHTML = content;
                    docNode = ProseMirrorDOMParser.fromSchema(mySchema).parse(temp);
                }
            }
            const state = EditorState.create({
                doc: docNode,
                plugins: exampleSetup({ schema: mySchema }),
            });
            const view = new EditorView(element as HTMLElement, {
                state,
                dispatchTransaction(tr) {
                    const newState = view.state.apply(tr);
                    view.updateState(newState);
                    if (onChange) {
                        onChange(newState.doc.toJSON());
                    }
                },
            });
            return () => view.destroy();
        };
    }

    function handleProseMirrorChange(docJSON: unknown) {
        if (post) {
            post.content = JSON.stringify(docJSON);
        }
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
                {#if prosemirrorAttach}
                    <div
                        {@attach prosemirrorAttach}
                        style="min-height: 300px;"
                    ></div>
                {/if}
            </div>
            <div class="text-sm text-gray-400">Post ID: {post.id}</div>
        {:else}
            <div>Loading...</div>
        {/if}
    </div>
</div> 