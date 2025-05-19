declare module 'prosemirror-svelte/state' {
  export function createRichTextEditor(html?: string, plugins?: any[]): any;
  export function clear(editorState: any): any;
  export function toHTML(editorState: any): string;
  export function toPlainText(editorState: any): string;
}

declare module 'prosemirror-svelte' {
  import { SvelteComponent } from 'svelte';
  export default class ProsemirrorEditor extends SvelteComponent<{
    editorState: any;
    placeholder?: string;
    focus?: () => void;
  }> {}
} 