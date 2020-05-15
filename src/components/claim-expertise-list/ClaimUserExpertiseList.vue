<template>
  <layout-section>
    <claim-user-expertise-list-body />

    <template #sidebar>
      <claim-user-expertise-list-sidebar />
    </template>
  </layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';
  import LayoutSection from '@/components/layout/components/LayoutSection';

  export default {
    name: 'ClaimUserExpertiseList',
    components: { LayoutSection },
    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
