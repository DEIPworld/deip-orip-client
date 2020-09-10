<script>
  import { layoutRenderer } from '@/components/Deipify/DLayout/layoutRenderer';
  import ResearchDetailsHeader
    from '@/components/Research/ResearchDetails/ResearchDetailsDefaults/ResearchDetailsHeader';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      ResearchDetailsHeader
    },
    mixins: [layoutRenderer],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      isOwner() {
        return this.research.members.includes(this.$currentUserName);
      },

      $templateReplacingMap() {
        return {
          research: this.research,
          conditions: {
            isOwner: this.isOwner
          }
        };
      }
    }
  };
</script>
