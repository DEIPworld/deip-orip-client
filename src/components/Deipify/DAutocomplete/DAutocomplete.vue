<script>
  import { VAutocomplete } from 'vuetify/lib/components';
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DAutocomplete',
    mixins: [VAutocomplete],
    computed: {
      labelValue() {
        return !this.isSingle
          && Boolean(this.isFocused || (!this.multiple && this.isLabelActive) || this.placeholder);
      }
    },
    methods: {
      genSelectionsMod() {
        let { length } = this.selectedItems;
        const children = new Array(length);

        let genSelection;

        if (this.$scopedSlots.selection) {
          genSelection = this.genSlotSelection;
        } else if (this.hasChips) {
          genSelection = this.genChipSelection;
        } else {
          genSelection = this.genCommaSelection;
        }

        while (length--) {
          children[length] = genSelection(
            this.selectedItems[length],
            length,
            length === children.length - 1
          );
        }

        let staticClass = 'v-select__selections';
        staticClass += this.multiple ? ' py-0 reset-height' : '';
        staticClass += this.multiple && children.length ? ' pt-1' : '';

        return this.$createElement('div', {
          staticClass
        }, children);


      },

      genSelections() {
        return this.hasSlot || this.multiple ? this.genSelectionsMod() : [];
      },

      genLegend() {
        const width = !this.singleLine && (this.labelValue || (!this.multiple && this.isDirty)) ? this.labelWidth : 0;
        const span = this.$createElement('span', {
          domProps: { innerHTML: '&#8203;' }
        });

        return this.$createElement('legend', {
          style: {
            width: !this.isSingle ? convertToUnit(width) : undefined
          }
        }, [span]);
      },

      genControl() {
        return this.$createElement('div', {
          staticClass: 'v-input__control'
        }, [
          this.genInputSlot(),
          ...(this.multiple ? [this.genSelections()] : []),
          this.genMessages()
        ]);
      },

      genDefaultSlot() {
        const selections = this.multiple ? [] : this.genSelections();
        const input = this.genInput();
        console.log(selections)

        if (Array.isArray(selections)) {
          console.log(1)
          selections.push(input);
        } else {
          console.log(2)
          selections.children = selections.children || [];
          // selections.children = [];
          selections.children.push(input);
        }

        return [
          this.genFieldset(),
          this.$createElement('div', {
            staticClass: 'v-select__slot',
            directives: this.directives
          }, [
            this.genLabel(),
            this.prefix ? this.genAffix('prefix') : null,
            selections,
            this.suffix ? this.genAffix('suffix') : null,
            this.genClearIcon(),
            this.genIconSlot(),
            this.genHiddenInput()
          ]),
          this.genMenu(),
          this.genProgress()
        ];
      }
    }
  };
</script>
