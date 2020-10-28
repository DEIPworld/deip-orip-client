<script>
  import { attributeRead } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesTextRead',
    mixins: [attributeRead],
    props: {
      clamped: {
        type: [Number, String],
        default: null
      }
    }
  };
</script>
