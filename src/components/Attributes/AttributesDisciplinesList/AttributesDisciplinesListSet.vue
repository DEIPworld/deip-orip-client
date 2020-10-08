<script>
  import { attributeSet, attributeViewTypeComponent } from '@/components/Attributes/mixins';

  import AttributesDisciplinesListSetDefault from './Set/AttributesDisciplinesListSetDefault';
  import { arrayedModel } from '@/mixins/extendModel';

  export default {
    name: 'AttributesDisciplinesListSet',
    components: {
      AttributesDisciplinesListSetDefault
    },
    mixins: [attributeSet, attributeViewTypeComponent, arrayedModel],
  };
</script>
