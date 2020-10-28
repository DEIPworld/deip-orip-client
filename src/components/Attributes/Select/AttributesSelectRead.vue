<script>
  import { attributeRead } from '@/components/Attributes/_mixins';

  export default {
    name: 'AttributesSelectRead',
    mixins: [attributeRead],
    computed: {
      valueOption() {
        return this.attributeInfo.valueOptions.find(({ value }) => value === this.attribute.value);
      }
    }
  };
</script>
