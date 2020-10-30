<script>
  import { attributeViewTypeComponent } from '@/components/Attributes/_mixins';
  import { arrayedModel } from '@/mixins/extendModel';

  import AttributesDisciplinesListSetDefault from './Set/AttributesDisciplinesListSetDefault';

  export default {
    name: 'AttributesDisciplinesListSet',
    components: {
      AttributesDisciplinesListSetDefault
    },
    mixins: [attributeViewTypeComponent, arrayedModel],
    watch: {
      internalValue(val) {
        if (!val) {
          this.internalValue = [];
        }
      }
    }
  };
</script>
