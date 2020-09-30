<script>
  import { componentsRenderer } from '@/mixins/renderer';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  import ContentsList from '@/components/ContentsList/ContentsList';
  import DraftsList from '@/components/DraftsList/DraftsList';
  import ReviewsList from '@/components/ReviewsList/ReviewsList';
  import kindOf from 'kind-of';
  import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
  import ResearchEditCta from '@/components/Research/ResearchEdit/ResearchEditCta';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      ResearchEditCta,
      AttributesRead,

      ReviewsList,

      ContentUpload,
      ContentsList,
      DraftsList
    },
    mixins: [componentsRenderer],
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
