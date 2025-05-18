<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { EditorState } from "prosemirror-state";
  import { EditorView } from "prosemirror-view";
  import { Schema, DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
  import { schema as basicSchema } from "prosemirror-schema-basic";
  import { addListNodes } from "prosemirror-schema-list";
  import { exampleSetup } from "prosemirror-example-setup";
  import "prosemirror-view/style/prosemirror.css";
  import "prosemirror-menu/style/menu.css";

  // Props
  export let value: string | object | null = null;
  export let onChange: ((doc: any) => void) | undefined = undefined;

  // Schema
  const mySchema = new Schema({
    nodes: addListNodes(basicSchema.spec.nodes, "paragraph block*", "block"),
    marks: basicSchema.spec.marks,
  });

  // Attachment factory
  export function prosemirrorAttachment(content: any, onChange?: (doc: any) => void): Attachment {
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
        attributes: { class: 'pm-modern-editor' },
      });
      return () => view.destroy();
    };
  }
</script>

<!-- Usage: <div {@attach prosemirrorAttachment(value, onChange)} class="pm-editor-host"></div> -->
<div class="pm-editor-host" {@attach prosemirrorAttachment(value, onChange)}></div>

<style>
.pm-editor-host {
  background: white;
  min-height: 60vh;
  width: 100%;
  border-radius: 1.5rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  padding: 0; /* padding is on the inner editor */
  display: flex;
  align-items: stretch;
  justify-content: center;
}

/* ProseMirror root node styling */
.pm-modern-editor.ProseMirror {
  min-height: 60vh;
  padding: 2.5rem 2rem 2rem 2rem;
  font-size: 1.25rem;
  line-height: 1.8;
  outline: none;
  border: none;
  box-shadow: none;
  background: transparent;
  color: #222;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  transition: box-shadow 0.2s;
}

.pm-modern-editor.ProseMirror:focus {
  box-shadow: 0 0 0 2px #2563eb33;
}

/* Remove menu bar border, make it float */
.ProseMirror-menubar {
  border: none;
  background: transparent;
  box-shadow: none;
  margin-bottom: 0.5rem;
  padding: 0 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

/* Hide scrollbars unless needed */
.pm-modern-editor.ProseMirror {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb #fff;
}

.pm-modern-editor.ProseMirror::-webkit-scrollbar {
  width: 8px;
  background: #fff;
}
.pm-modern-editor.ProseMirror::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 8px;
}
</style>
