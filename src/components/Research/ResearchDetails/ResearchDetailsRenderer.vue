<script>
  import { componentsRenderer } from '@/mixins/renderer';

  import AttributesRead from '@/components/Attributes/AttributesRead';

  import { hasValue } from '@/utils/helpers';
  import ContentsList from '@/components/ContentsList/ContentsList';
  import ContentUpload from '@/components/Contents/ContentUpload/ContentUpload';
  import DraftsList from '@/components/DraftsList/DraftsList';

  import ReviewsList from '@/components/ReviewsList/ReviewsList';

  import EciStats from '@/components/EciMetrics/EciStats/EciStats';

  import ResearchDetailsEditCta from '@/components/Research/ResearchDetails/_partials/ResearchDetailsEditCta';
  import ResearchDetailsFollowCta from '@/components/Research/ResearchDetails/_partials/ResearchDetailsFollowCta';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      ResearchDetailsFollowCta,
      ResearchDetailsEditCta,
      EciStats,
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

        if (!attr || !attr.value) return false;

        return hasValue(attr.value);
      }
    }
  };
</script>
