<script lang="ts">
  // import the core component
import ProsemirrorEditor from 'prosemirror-svelte';

 // import helpers to work with prosemirror state
 import { createRichTextEditor, toPlainText } from 'prosemirror-svelte/state';  

 // create the initial editor state
 let editorState = createRichTextEditor('Hello world!'); 

 function handleChange(event) {
   // get the new editor state from event.detail
   editorState = event.detail.editorState;
 }

 // log the text content of the editor state, just for fun
 $effect(() => {
 console.log(toPlainText(editorState)); 
 });

</script>

<ProsemirrorEditor 
 placeholder="Go ahead and type something" 
 {editorState} 
 on:change={handleChange}
/>