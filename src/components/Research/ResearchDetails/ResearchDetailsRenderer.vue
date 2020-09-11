<script>
  import { componentsRenderer } from '@/mixins/renderer';

  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutHeader from '@/components/Deipify/DLayout/DLayoutHeader';
  import ResearchDetailsHeader
    from '@/components/Research/ResearchDetails/ResearchDetailsDefaults/ResearchDetailsHeader';

  import { VSheet, VBtn } from 'vuetify/lib';
  import { researchAttributes } from '@/mixins/platformAttributes';
  import AttributesReadIterator from '@/components/Attributes/AttributesReadIterator';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DStack from '@/components/Deipify/DStack/DStack';
  import UsersListWidget from '@/components/Users/UsersListWidget';

  export default {
    name: 'ResearchDetailsRenderer',
    components: {
      UsersListWidget,
      DStack,
      DBlock,
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      AttributesReadIterator,
      DLayoutSection,
      DLayoutHeader,
      ResearchDetailsHeader,

      VSheet,
      VBtn
    },
    mixins: [componentsRenderer, researchAttributes],
    props: {
      research: {
        type: Object,
        default: () => ({})
      }
    }
  };
</script>
