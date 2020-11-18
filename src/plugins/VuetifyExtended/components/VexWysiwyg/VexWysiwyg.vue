<script>
  import Quill from 'quill/quill';
  import MagicUrl from 'quill-magic-url';
  import { ImageDrop } from 'quill-image-drop-module';
  import 'quill-mention'; // automagically adds it to Quill modules

  import { mergeDeep, wrapInArray } from 'vuetify/lib/util/helpers';
  import VInput from 'vuetify/lib/components/VInput';

  import MdTheme, { TOOLBAR_CONFIG } from './theme/mdTheme';

  import { createPlaceholderModule } from './blots/placeholder'

  // DIV blot for editor

  const Block = Quill.import('blots/block');

  class DivBlot extends Block {
    static blotName = 'div';

    static tagName = 'DIV';
  }

  Quill.register('themes/md', MdTheme, true);
  Quill.register(DivBlot, true);

  // Quill.debug(false);

  // //////////////////////////////////////////////////////////////////////

  export default {
    name: 'VexWysiwyg',

    mixins: [
      VInput
    ],

    props: {
      id: {
        type: String,
        default: 'quill-container'
      },

      debug: {
        type: Boolean,
        default: false
      },

      placeholder: {
        type: String,
        default: undefined
      },

      // Quill options Object

      options: {
        type: Object,
        required: false,
        default: () => ({})
      },

      // PARTS FROM this.options

      toolbar: {
        type: Array,
        default: () => []
      },
      modules: {
        type: Array,
        default: () => ([])
      }
    },

    data() {
      return {
        quill: null
      };
    },

    computed: {
      classes() {
        return {
          ...VInput.options.computed.classes.call(this),
          'vex-wysiwyg': true
        };
      }
    },

    watch: {
      lazyValue(val) {
        if (val !== this.cleanHtml(this.quill.root.innerHTML) && !this.quill.hasFocus()) {
          this.quill.root.innerHTML = val;
        }
      },
      disabled(status) {
        this.quill.enable(!status);
      }
    },

    mounted() {
      this.registerCustomModules();
      this.registerPrototypes();

      this.initializeEditor();
    },

    beforeDestroy() {
      this.destroyEditor();
    },

    methods: {
      registerCustomModules() {
        const modules = wrapInArray(this.modules);

        if (modules.length) {
          modules.forEach((customModule) => {
            Quill.register(`modules/${customModule.alias}`, customModule.module);
          });
        }
      },

      registerPrototypes() {
        const {cleanHtml} = this;
        Quill.prototype.getHTML = function getHTML() {
          return cleanHtml(this.container.querySelector('.ql-editor').innerHTML);
        };
      },

      cleanHtml(html) {
        return html
          .replace(/<span contenteditable="false">(.*?)<\/span>/gm, '$1')
          .replace(/[\uFEFF\xA0]+/g, '');
      },

      initializeEditor() {
        this.setupQuillEditor();
        this.setInitialContent();
        this.registerListeners();

        this.$emit('ready', this.quill);
      },

      destroyEditor() {
        this.quill = null;
        delete this.quill;
      },

      setupQuillEditor() {
        const editorConfig = mergeDeep(
          {
            // debug: false,
            theme: 'md',
            modules: this.setDefaultModules(),
            placeholder: this.placeholder ? this.placeholder : '',
            readOnly: this.disabled ? this.disabled : false
          },
          this.options
        );

        this.quill = new Quill(this.$refs.quillContainer, editorConfig);
      },

      setInitialContent() {
        if (this.value) {
          this.quill.root.innerHTML = this.value;
        }
      },

      setDefaultModules() {
        Quill.register('modules/contentPlaceholder', createPlaceholderModule(), true);
        Quill.register('modules/magicUrl', MagicUrl, true);
        Quill.register('modules/imageDrop', ImageDrop, true);

        return {
          toolbar: this.toolbar.length ? this.toolbar : TOOLBAR_CONFIG,
          history: { userOnly: true },
          contentPlaceholder: true,
          magicUrl: true,
          imageDrop: true
        };
      },

      registerListeners() {
        this.quill.on('text-change', this.handleTextChange);
        this.quill.on('selection-change', this.handleSelectionChange);

        this.handleEvent('text-change');
        this.handleEvent('selection-change');
        this.handleEvent('editor-change');
      },

      handleEvent(type) {
        this.quill.on(type, (...args) => {
          this.$emit(type, ...args);
        });
      },

      handleSelectionChange(range, oldRange) {
        if (!range && oldRange) {
          this.$emit('blur', this.quill);
        } else if (range && !oldRange) this.$emit('focus', this.quill);
      },

      handleTextChange() {
        const editorContent = this.quill.getHTML() !== '<p><br></p>'
          ? this.quill.getHTML()
          : '';

        this.internalValue = editorContent;
      },

      // render

      genWysiwyg() {
        return this.$createElement('div', {
          class: {
            'd-wysiwyg': true
          },
          attrs: {
            id: this.id
          },
          ref: 'quillContainer'
        }, null);
      },

      genDefaultSlot() {
        return this.$createElement('div', {
          class: {
            'vex-wysiwyg__slot': true
          }
        }, [
          this.genLabel(),

          ...(this.$scopedSlots.toolbar
            ? [this.$scopedSlots.toolbar({
              editor: this.quill
            })] : []),

          this.genWysiwyg(),
          this.$slots.default
        ]);
      }
    }
  };
</script>
