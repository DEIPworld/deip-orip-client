<template>
  <d-layout-section v-if="$ready">
    <d-layout-section-main>
      <research-group-details-body />
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import ResearchGroupDetailsBody from '@/components/research-group-details/components/ResearchGroupDetailsBody';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';

  export default {
    name: 'ResearchGroupDetails',
    components: { DLayoutSectionMain, DLayoutSection, ResearchGroupDetailsBody },

    data() {
      return {};
    },
    computed: {},

    created() {
      Promise.all([
        this.$store.dispatch('auth/loadGroups'),
        this.$store.dispatch('researchGroup/loadResearchGroup', {
          teamId: this.$route.params.teamId
        })
      ])
        .then(() => this.$setReady());
    }
  };
</script>

<style lang="less" scoped>
</style>
