<script>
  import { componentsRenderer } from '@/mixins/renderer';
  import { researchAttributes } from '@/mixins/platformAttributes';
  import kindOf from 'kind-of';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  export default {
    name: 'ResearchListItemRenderer',
    components: {
      AttributesRead
    },
    mixins: [componentsRenderer, researchAttributes],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      ifAttribute(id) {
        const attr = this.research.researchRef.attributes[id];

        if (attr) {
          const arrayVal = kindOf(attr.value) === 'array' && attr.value.length;
          const strVal = kindOf(attr.value) === 'string' && attr.value;
          const boolVal = kindOf(attr.value) === 'boolean' && attr.value;

          return !!(arrayVal || strVal || boolVal);
        }
        return false;
      }
    }
  };
</script>
