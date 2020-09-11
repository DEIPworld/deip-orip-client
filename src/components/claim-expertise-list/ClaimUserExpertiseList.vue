<template>
  <d-layout-section>
    <d-layout-section-main>
      <claim-user-expertise-list-body />
    </d-layout-section-main>
    <d-layout-section-sidebar>
      <claim-user-expertise-list-sidebar />
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';

  export default {
    name: 'ClaimUserExpertiseList',
    components: { DLayoutSectionSidebar, DLayoutSectionMain, DLayoutSection },
    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
