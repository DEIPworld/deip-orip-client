<template>
<!--  <div class="editor">-->
<!--    <v-sheet class="overflow-auto" max-width="100%">-->
<!--      <pre>{{ JSON.stringify(internalValue, null, 2) }}</pre>-->
<!--    </v-sheet>-->
<!--    <vue-editor-->
<!--      v-model="internalValue"-->
<!--      use-markdown-shortcuts-->
<!--      :editor-toolbar="editor.toolbar"-->
<!--    />-->
<!--  </div>-->

  <vue-editor
    v-model="internalValue"
    use-markdown-shortcuts
    :editor-toolbar="editor.toolbar"
  />
</template>

<script>
  import { attributeSet } from '@/components/Attributes/mixins';
  import { VueEditor, Quill } from 'vue2-editor';
  import { mergeDeep } from 'vuetify/lib/util/helpers';

  const icons = Quill.import('ui/icons');

  const setIcon = (icon) => `<i aria-hidden="true" class="v-icon mdi ${icon} theme--light" style="color: currentColor"></i>`;

  export default {
    name: 'AttributesTextareaSet',
    components: {
      VueEditor
    },
    mixins: [attributeSet],
    data() {
      return {

        // id
        // placeholder
        // value
        // disabled
        // editorToolbar
        // editorOptions
        // useCustomImageHandler
        // useMarkdownShortcuts

        editor: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [
              { list: 'ordered' },
              { list: 'bullet' }
            ],
            ['link', 'image', 'video'],
            ['clean']
          ]
        }
      };
    },
    created() {

      mergeDeep(icons, {
        bold: setIcon('mdi-format-bold'),
        italic: setIcon('mdi-format-italic'),
        underline: setIcon('mdi-format-underline'),
        strike: setIcon('mdi-format-strikethrough'),
        list: {
          ordered: setIcon('mdi-format-list-numbered'),
          bullet: setIcon('mdi-format-list-bulleted')
        },
        link: setIcon('mdi-link-variant'),
        image: setIcon('mdi-image'),
        video: setIcon('mdi-video'),
        clean: setIcon('mdi-format-clear')
      });
    }
  };
</script>
