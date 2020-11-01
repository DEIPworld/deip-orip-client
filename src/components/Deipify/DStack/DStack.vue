<script>
  import { convertToUnit } from 'vuetify/lib/util/helpers';
  import { vSheetModify } from '@/mixins/vSheetModify';

  export default {
    name: 'DStack',
    mixins: [vSheetModify],
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
      additionalStyles() {
        return {
          '--d-stack-gap': convertToUnit(this.gap || 24)
        };
      },

      additionalClasses() {
        return {
          'd-stack': true,
          [`d-stack--${this.horizontal ? 'horizontal' : 'vertical'}`]: true
        };
      }
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
      //justify-items: left;
    }
  }
</style>
