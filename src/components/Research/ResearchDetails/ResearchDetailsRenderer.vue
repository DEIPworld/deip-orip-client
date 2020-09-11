<script>
  import { nativeRenderer } from '@/mixins/renderer';

  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';
  import ResearchDetailsHeader
    from '@/components/Research/ResearchDetails/ResearchDetailsDefaults/ResearchDetailsHeader';

  import { VSheet, VBtn } from 'vuetify/lib';



  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      DLayoutSection,
      DLayoutHeader,
      ResearchDetailsHeader,

      VSheet,
      VBtn
    },
    mixins: [nativeRenderer],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
