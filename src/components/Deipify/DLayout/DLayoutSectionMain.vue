<script>
  import { vSheetModify } from '@/mixins/vSheetModify';

  export default {
    name: 'DLayoutSectionMain',
    mixins: [vSheetModify],
    computed: {
      additionalClasses() {
        return {
          'pa-6': true,
          'pa-md-12': true,
          'flex-grow-1': true,
          'flex-shrink-1': true
        };
      }
    }
  };
</script>
