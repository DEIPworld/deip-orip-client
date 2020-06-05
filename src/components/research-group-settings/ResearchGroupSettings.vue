<template>
  <full-screen-view v-if="$ready" title="Edit group info">
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
      if (this.$store.getters['auth/user'].groups.some((item) => encodeURIComponent(item.permlink) === this.$route.params.research_group_permlink)) {
        this.$store.dispatch('researchGroupSettings/loadResearchGroup', {
          permlink: decodeURIComponent(this.$route.params.research_group_permlink)
        })
          .then(() => {
            this.$setReady();
          });
      } else {
        this.$router.push({
          name: 'ResearchGroupDetails',
          params: {
            research_group_permlink: this.$route.params.research_group_permlink
          }
        });
        
      }
    },

    methods: {}
  };
</script>

<style lang="less" scoped>
</style>
