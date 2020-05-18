<template>
  <layout-section>
    <research-group-settings-body />
  </layout-section>
</template>

<script>
  import LayoutSection from '@/components/layout/components/LayoutSection';
  import ResearchGroupSettingsBody from '@/components/research-group-settings/components/ResearchGroupSettingsBody';

  export default {
    name: 'ResearchGroupSettings',
    components: { ResearchGroupSettingsBody, LayoutSection },
    data() {
      return {};
    },

    created() {},

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
