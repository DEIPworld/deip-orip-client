<script>
  import { attributeSet, attributeViewTypeComponent } from '@/components/Attributes/mixins';

  import AttributesDisciplinesListSetDefault from './Set/AttributesDisciplinesListSetDefault';

  export default {
    name: 'AttributesDisciplinesListSet',
    components: {
      AttributesDisciplinesListSetDefault
    },
    mixins: [attributeSet, attributeViewTypeComponent]
  };
</script>
