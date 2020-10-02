<script>
  import { componentsRenderer } from '@/mixins/renderer';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  import ContentsList from '@/components/ContentsList/ContentsList';
  import DraftsList from '@/components/DraftsList/DraftsList';
  import ReviewsList from '@/components/ReviewsList/ReviewsList';
  import kindOf from 'kind-of';
  import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
  import { isArray, isString, isBoolean } from '@/utils/helpers';
  import RecursiveIterator from 'recursive-iterator';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
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

    computed: {
      isMember() {
        return this.research.members.includes(this.$currentUserName);
      }
    },

    methods: {
      ifAttribute(id) {
        const attr = this.research.researchRef.attributes[id];

        if (attr && !!attr.value) {
          const vals = [];

          if (isString(attr.value) || isBoolean(attr.value)) {
            vals.push(!!attr.value);
          } else {
            for (const { node } of new RecursiveIterator(attr.value)) {
              if (isString(node)) {
                vals.push(!!node);
              }
            }
          }

          return vals.includes(true);
        }

        return false;
      }
    }
  };
</script>
