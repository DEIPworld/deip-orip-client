<script>
  import { VSheet } from 'vuetify/lib/components';
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DStack',
    mixins: [VSheet],
    props: {
      gap: {
        type: [Number, String],
        default: 24
      },
      horizontal: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      stacksStyles() {
        return {
          '--d-stack-gap': convertToUnit(this.gap)
        };
      },

      stackClasses() {
        return {
          'd-stack': true,
          [`d-stack--${this.horizontal ? 'horizontal' : 'vertical'}`]: true
        };
      }
    },
    render(h) {
      const data = {
        class: {
          ...this.classes,
          ...this.stackClasses
        },
        style: {
          ...this.styles,
          ...this.stacksStyles
        },
        on: this.listeners$
      };
      return h(this.tag, this.setBackgroundColor(this.color, data), this.$slots.default);
    }
  };
</script>

<style lang="scss">
  .d-stack {
    display: grid;
    grid-gap: var(--d-stack-gap);

    &--horizontal {
      grid-auto-flow: column;
      grid-auto-columns: max-content;
    }

    &--vertical {
      grid-auto-flow: row;
    }
  }
</style>
