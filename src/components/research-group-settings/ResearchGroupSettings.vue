<template>
  <full-screen-view v-if="$ready" :title="$t('researchGroupSettings.title')">
    <research-group-settings-body />
  </full-screen-view>
</template>

<script>
  import ResearchGroupSettingsBody from '@/components/research-group-settings/components/ResearchGroupSettingsBody';
  import FullScreenView from '@/components/layout/FullScreen/FullScreenView';

  export default {
    name: 'ResearchGroupSettings',
    components: { ResearchGroupSettingsBody, FullScreenView },
    data() {
      return {};
    },

    created() {
      if (this.$store.getters['auth/user'].groups.some((item) => item.external_id === this.$route.params.teamId)) {
        this.$store.dispatch('researchGroupSettings/loadResearchGroup', {
          teamId: this.$route.params.teamId
        })
          .then(() => {
            this.$setReady();
          });
      } else {
        this.$router.push({
          name: 'teamDetails',
          params: {
            teamId: this.$route.params.teamId
          }
        });
      }
    },

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
