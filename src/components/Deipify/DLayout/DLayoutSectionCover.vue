<script>
  import { vSheetModify } from '@/mixins/vSheetModify';

  export default {
    name: 'DLayoutSectionMain',
    mixins: [vSheetModify],
    computed: {
      additionalClasses() {
        return {
          'pos-absolute': true,
          'fill-box': true,
          'overflow-hidden': true,
          [this.$style.host]: true
        };
      },
      additionalStyles() {
        return {
          zIndex: -1
        };
      },
    },
    created() {
      this.$nextTick(() => {
        for (const node of this.$children) {
          if (node.$el.classList.contains('v-image')) {
            node.$el.setAttribute('data-image', true)
          }
        }
      });
    }
  };
</script>

<style lang="scss" module>
  .host {
    z-index: -1;

    > [class*='v-image'] {

      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;

      > [class*="v-responsive__sizer"] {
        display: none;
      }

    }
  }
</style>
