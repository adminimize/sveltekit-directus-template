<script lang="ts">
    import ProsemirrorEditor from "prosemirror-svelte";
    import { browser } from "$app/environment";
    import { createRichTextEditor, clear, toHTML, toPlainText } from 'prosemirror-svelte/state';  
    
   let { contents, autofocus = true } = $props();

  
    let editorState = $state(browser ? createRichTextEditor(contents) : undefined);
    let focusEditor = $state<(() => void) | undefined>(undefined);

    function handleChange(event: CustomEvent) {
      editorState = event.detail.editorState;
    }
  
    // Attachment to focus the editor on mount
    // const focusOnMount: Attachment = (element) => {
    //     console.log("Focusing editor", element);
    //     focusEditor?.();
    //     return () => {};
    // };
    

    $effect(() => {
      if (editorState && autofocus) focusEditor?.();
    });

  
  </script>
  
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