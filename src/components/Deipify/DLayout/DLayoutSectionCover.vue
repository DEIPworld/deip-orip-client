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
        };
      },
      additionalStyles() {
        return {
          zIndex: -1
        };
      }
    }
  };
</script>
