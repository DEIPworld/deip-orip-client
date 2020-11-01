<script>
  import { mergeDeep } from 'vuetify/lib/util/helpers';
  import { VInput } from 'vuetify/lib/components';
  import { VueEditor, Quill } from 'vue2-editor';

  export default {
    name: 'DWysiwyg',
    components: {
      VueEditor
    },
    mixins: [VInput],
    props: {
      reverse: Boolean
    },
    data() {
      return {
        editorIcons: Quill.import('ui/icons'),
        editorOptions: {},
        editorToolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [
            { list: 'ordered' },
            { list: 'bullet' }
          ],
          ['link', 'image', 'video'],
          ['clean']
        ]
      };
    },
    computed: {
      labelPosition() {
        return (this.$vuetify.rtl === this.reverse) ? {
          left: '12px',
          right: 'auto'
        } : {
          left: 'auto',
          right: '12px'
        };
      }
    },
    created() {
      mergeDeep(this.editorIcons, {
        bold: this.setIcon('mdi-format-bold'),
        italic: this.setIcon('mdi-format-italic'),
        underline: this.setIcon('mdi-format-underline'),
        strike: this.setIcon('mdi-format-strikethrough'),
        list: {
          ordered: this.setIcon('mdi-format-list-numbered'),
          bullet: this.setIcon('mdi-format-list-bulleted')
        },
        link: this.setIcon('mdi-link-variant'),
        image: this.setIcon('mdi-image'),
        video: this.setIcon('mdi-video'),
        clean: this.setIcon('mdi-format-clear')
      });
    },
    methods: {
      setIcon(icon) {
        return `<i aria-hidden="true" class="v-icon mdi ${icon} theme--light" style="color: currentColor"></i>`;
      },

      genWysiwyg() {
        const self = this;
        return this.$createElement('VueEditor', {
          props: {
            placeholder: this.placeholder,
            value: this.internalValue,
            disabled: this.disabled,
            useMarkdownShortcuts: true,
            editorToolbar: this.editorToolbar,
            editorOptions: this.editorOptions
          },
          on: {
            input(val) {
              self.internalValue = val;
            }
          },
          ref: 'editor'
        });
      },

      genLabelWrap() {
        const data = {
          style: {
            position: 'absolute',
            left: this.labelPosition.left,
            right: this.labelPosition.right,
            top: '-11px',
            background: '#fff',
            padding: '0 4px'
          }
        };

        return this.$createElement('div', data, [this.genLabel()]);
      },

      genDefaultSlot() {
        return this.$createElement('div', {
          class: {
            spacer: true,
            'd-wysiwyg': true
          }
        }, [
          this.genLabelWrap(),
          this.genWysiwyg()
        ]);
      }
    }
  };
</script>

<style lang="scss">
  // TODO: make own theme

  .d-wysiwyg {
    --d-wysiwyg-border-color: var(--color-divider);

    .error--text & {
      --d-wysiwyg-border-color: var(--v-error-base);
    }

    .v-label {
      font-size: 12px;
    }

    .quillWrapper {



      .ql-snow {
        &.ql-toolbar {
          display: flex;
          padding: 8px 4px;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border-color: var(--d-wysiwyg-border-color);

          .ql-formats {
            margin: 0 16px 0 0;
            display: grid;
            grid-auto-flow: column;

            &:after {
              display: none;
            }
          }

          button {
            width: 36px;
            height: 36px;
            padding: 0;
            border-radius: 50%;

            color: var(--color-text-secondary);
            transition: all .2s;

            &.ql-active {
              color: var(--v-primary-base);
            }

            &:hover {
              background-color: rgba(#1A1B22, .04);
            }
          }
        }

        &.ql-container {
          font-family: "Roboto", sans-serif;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          border-color: var(--d-wysiwyg-border-color);

          .ql-editor {
            font-size: 14px;
            padding: 12px;

            > * {
              &:not(:first-child) {
                margin-top: 12px;
              }
            }
          }
        }
      }
    }
  }
</style>
