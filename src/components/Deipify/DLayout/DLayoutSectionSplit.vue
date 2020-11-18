<script>
  import { vSheetModify } from '@/mixins/vSheetModify';
  import { convertToUnit } from 'vuetify/lib/util/helpers';

  export default {
    name: 'DLayoutSectionSplit',
    mixins: [vSheetModify],
    props: {
      template: {
        type: String,
        default: '1 1'
      },
      gap: {
        type: [Number, String],
        default: 24
      }
    },
    computed: {
      additionalClasses() {
        return {
          [this.$style.host]: true
        };
      },
      additionalStyles() {
        return {
          '--layout-split-stack-gap': convertToUnit(this.gap),
          '--layout-split-template': this.template.split(' ').map((i) => `${i}fr`).join(' ')
        };
      }
    }
  };
</script>

<style lang="scss" module>
  .host {
    display: grid;
    grid-gap: var(--layout-split-stack-gap);
    grid-template-columns: var(--layout-split-template);

    [class*='align-bottom'] & {
      align-items: end;
    }
  }
</style>
