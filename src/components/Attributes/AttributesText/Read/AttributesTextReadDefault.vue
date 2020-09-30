<script>
  import { attributeRead, attributeReadText } from '@/components/Attributes/mixins';

  export default {
    name: 'AttributesTextReadDefault',
    mixins: [
      attributeRead,
      attributeReadText
    ]
  };
</script>
