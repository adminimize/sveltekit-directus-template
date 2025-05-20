<script lang="ts">
    import ProsemirrorEditor from "./prosemirror-svelte5/ProsemirrorEditor.svelte";
    import { browser } from "$app/environment";
    import { createRichTextEditor, toJSON, fromJSON } from './prosemirror-svelte5/state';  
    import type { EditorState } from 'prosemirror-state';
    import { richTextSchema } from './prosemirror-svelte5/state/schemas';
    import { richTextPlugins } from './prosemirror-svelte5/helpers/plugins';
    
    let { 
        content = $bindable<string | null>(null),
        autofocus = false,
        placeholder = "Start typing...",
        className = "ui-editor"
    } = $props();

    let editorState = $state<EditorState | undefined>(undefined);
    let focusEditor = $state<(() => void) | undefined>(undefined);

    // Initialize editor state from content
    $effect(() => {
        if (browser && content !== undefined) {
            try {
                // If content is a JSON string, parse it
                const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
                editorState = fromJSON(parsedContent, richTextSchema, richTextPlugins);
            } catch (e) {
                // If parsing fails, create new editor state
                editorState = createRichTextEditor('');
            }
        }
    });

    function handleChange(detail: { editorState: EditorState }) {
        editorState = detail.editorState;
        // Update content with serialized state
        content = JSON.stringify(toJSON(editorState));
    }

    function handleTransaction(detail: { 
        view: any, 
        editorState: EditorState, 
        isDirty: boolean, 
        contentHasChanged: boolean 
    }) {
        if (detail.contentHasChanged) {
            // Update content with serialized state
            content = JSON.stringify(toJSON(detail.editorState));
        }
    }

    function handleCustom() {
        // No-op for now, but required by ProsemirrorEditor
    }

    $effect(() => {
        if (editorState && autofocus) focusEditor?.();
    });
</script>

{#if browser}
    <ProsemirrorEditor
        {editorState}
        {className}
        {placeholder}
        bind:focusEditor={focusEditor}
        onChange={handleChange}
        onTransaction={handleTransaction}
        onCustom={handleCustom}
    />
{/if}

<style>
    :global(.ui-editor) {
        box-sizing: border-box;
        background-color: transparent;
        padding: 1em;
        border: 1px solid #efefef;
        border-radius: .5em;
        display: inline-block;
        font: inherit;
        text-rendering: optimizeLegibility;
        white-space: pre-line;
        overflow-wrap: break-spaces;
        vertical-align: top;
        width: 100%;
        min-height: 1.25rem;
        outline: none;
    }
</style>