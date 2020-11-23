<template>
  <v-sheet
    :id="editorId"
    class="vex-editor"
    outlined
    max-width="720"
    rounded
  >
    <v-toolbar rounded dense>
      <v-btn small icon @click="makeToolAction('header')">
        <v-icon class="pos-relative" style="top: 2px">
          mdi-format-header-3
        </v-icon>
      </v-btn>
      <v-spacer />
      <v-btn small icon @click="getEditorData">
        <v-icon class="pos-relative" style="top: 2px">
          mdi-content-save-outline
        </v-icon>
      </v-btn>
      <v-divider vertical class="mx-3 my-2 reset-height" />
    </v-toolbar>
    <v-divider />
    <div ref="editorContainer" class="py-4" />
  </v-sheet>
</template>

<script>
  // [WIP] editor.js implementation

  import { uid } from 'uid';

  import EditorJS from '@editorjs/editorjs';
  import Paragraph from '@editorjs/paragraph';
  import Header from '@editorjs/header';
  import List from '@editorjs/list';
  // import Table from '@editorjs/table';
  import Embed from '@editorjs/embed';
  // import Image from '@editorjs/image';

  import Underline from '@editorjs/underline';
  import Marker from '@editorjs/marker';

  import DragDrop from 'editorjs-drag-drop';

  import NullEditor from '@/plugins/VuetifyExtended/components/VexEditor/blocks/null';

  export default {
    name: 'VexEditor',
    data() {
      return {
        editor: null,
        editorElement: null,
        editorId: `editor-${uid()}`,

        editorData: null
      };
    },
    mounted() {
      this.initEditor();
    },
    methods: {
      initEditor() {
        this.editor = new EditorJS({
          holder: this.editorId,
          hideToolbar: true,
          tools: {
            null: {
              class: NullEditor,
              inlineToolbar: false,
              readOnly: true
            },


            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
              // config: {
              //   placeholder: 'Type here',
              //   preserveBlank: true
              // }
            },
            header: {
              class: Header,
              config: {
                placeholder: 'Enter a header',
                levels: [3, 4, 5],
                defaultLevel: 3
              },
              shortcut: 'CMD+SHIFT+H'
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            // table: {
            //   class: Table,
            //   inlineToolbar: true,
            //   config: {
            //     rows: 2,
            //     cols: 2,
            //   },
            // },
            embed: { // embed on past
              class: Embed,
              // config: {
              //   services: {
              //     youtube: true,
              //     coub: true
              //   }
              // }
            },
            underline: {
              class: Underline,
              shortcut: 'CMD+SHIFT+U',
            },
            marker: {
              class: Marker,
              shortcut: 'CMD+SHIFT+M',
            }
          },
          data: {
            blocks: [
              {
                type: 'paragraph',
                data: {
                  text: 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.'
                }
              }
            ]
          },

          onReady: this.onReady,
          onChange: this.onChange
        });
      },

      // /////

      onReady() {
        this.editorElement = document.getElementById(this.editorId);

        // eslint-disable-next-line no-new
        new DragDrop(this.editor);

        this.$emit('ready')
      },

      onChange() {
        console.log('change')
        this.$emit('change')
      },

      registerEventEmit(evt) {
        this.editorElement.addEventListener(evt, () => {
          this.$emit(evt)
        })
      },

      unregisterEventEmit(evt) {

      },

      // /////

      makeToolAction(tool) {
        this.editorElement.querySelector(`.ce-toolbox .ce-toolbox__button[data-tool=${tool}]`).click()
      },

      addBlock(type, opts = {}) {
        const index = this.editor.blocks.getBlocksCount() + 1;
        this.editor.blocks.insert(type, undefined, undefined, index);
        this.editor.caret.setToLastBlock('start', 0);
      },

      getEditorData() {
        this.editor.save().then((outputData) => {
          // console.log(this.editor)
          console.log('Article data: ', outputData)
        }).catch((error) => {
          console.log('Saving failed: ', error)
        });
      }
    }
  };
</script>

<style lang="scss">
  .vex-editor {

  }
</style>
