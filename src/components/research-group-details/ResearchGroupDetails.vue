<template>
  <d-layout-section v-if="$ready">
    <research-group-details-body />
  </d-layout-section>
</template>

<script>
  import ResearchGroupDetailsBody from '@/components/research-group-details/components/ResearchGroupDetailsBody';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';

  export default {
    name: 'ResearchGroupDetails',
    components: { DLayoutSection, ResearchGroupDetailsBody },

    data() {
      return {};
    },
    computed: {},

    created() {
      Promise.all([
        this.$store.dispatch('auth/loadGroups'),
        this.$store.dispatch('researchGroup/loadResearchGroup', {
          permlink: decodeURIComponent(this.$route.params.research_group_permlink)
        })
      ])
        .then(() => this.$setReady());
    }
  };
</script>

<style lang="less" scoped>
</style>
