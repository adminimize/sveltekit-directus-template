<script lang="ts">
    import ProsemirrorEditor from "./prosemirror-svelte5/ProsemirrorEditor.svelte";
    import { browser } from "$app/environment";
    import { createRichTextEditor } from './prosemirror-svelte5/state';  
    
   let { content = $bindable(), autofocus = false } = $props();

   if(browser) {
   console.log("contents", content);
   }

    let editorState = $state(browser ? createRichTextEditor(content) : undefined);
    let focusEditor = $state<(() => void) | undefined>(undefined);

    function handleChange(event: CustomEvent) {
      editorState = event.detail.editorState;
    }

    $effect(() => {
      if (editorState && autofocus) focusEditor?.();
    });

  </script>

  {content}
  
  {#if browser}
  <ProsemirrorEditor
    {editorState}
    bind:focus={focusEditor}
    on:change={handleChange}
    placeholder="Go ahead and edit me!"
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