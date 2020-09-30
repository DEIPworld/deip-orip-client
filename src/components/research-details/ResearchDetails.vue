<template>
  <div>
    <research-details-header />

    <layout-toolbar>
      <research-details-actions v-if="!isResearchGroupMember" />
    </layout-toolbar>

    <d-layout-section>
      <d-layout-section-main>
        <research-details-body />
      </d-layout-section-main>

      <d-layout-section-sidebar>
        <research-details-sidebar />
      </d-layout-section-sidebar>
    </d-layout-section>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import ResearchDetailsActions from '@/components/research-details/components/ResearchDetailsActions';
  import ResearchDetailsBody from '@/components/research-details/components/ResearchDetailsBody';
  import ResearchDetailsHeader from '@/components/research-details/components/ResearchDetailsHeader';
  import ResearchDetailsSidebar from '@/components/research-details/components/ResearchDetailsSidebar';
  import LayoutToolbar from '@/components/layout/components/LayoutToolbar';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ResearchDetails',
    components: {
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      DLayoutSection,
      LayoutToolbar,
      ResearchDetailsSidebar,
      ResearchDetailsHeader,
      ResearchDetailsBody,
      ResearchDetailsActions
    },
    computed: {
      ...mapGetters({
        research: 'rd/research'
      }),

      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      }
    }
  };
</script>

<style scoped>
</style>
