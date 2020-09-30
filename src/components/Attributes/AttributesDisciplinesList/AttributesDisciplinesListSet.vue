<script>
  import { attributeSet, attributeViewTypeComponent } from '@/components/Attributes/mixins';

  import AttributesDisciplinesListSetDefault from './Set/AttributesDisciplinesListSetDefault';
  import AttributesDisciplinesListSetFilter from './Set/AttributesDisciplinesListSetFilter';

  export default {
    name: 'AttributesDisciplinesListSet',
    components: {
      AttributesDisciplinesListSetDefault,
      AttributesDisciplinesListSetFilter
    },
    mixins: [attributeSet, attributeViewTypeComponent]
  };
</script>
