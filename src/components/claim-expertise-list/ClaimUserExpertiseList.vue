<template>
  <d-layout-section>
    <claim-user-expertise-list-body />

    <template #sidebar>
      <claim-user-expertise-list-sidebar />
    </template>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ClaimUserExpertiseList',
    components: { DLayoutSection },
    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
