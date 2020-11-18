<script>
  import { VSheet } from 'vuetify/lib/components';

  export default {
    name: 'DLayout',
    mixins: [VSheet],
    computed: {
      classes() {
        return {
          ...VSheet.options.computed.classes.call(this),
          'd-flex': true,
          'flex-column': true,
          'fill-height': true
        };
      }
    }
  };
</script>
