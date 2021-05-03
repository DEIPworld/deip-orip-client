<template>
  <router-view v-if="$ready" />
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { teamDetailsStore } from '@/features/Teams/store/teamDetailsStore';

  export default {
    name: 'TeamDataProvider',
    mixins: [componentStoreFactoryOnce(teamDetailsStore, 'Team')],
    props: {
      teamId: {
        type: String,
        required: true
      }
    },
    created() {
      this.$store
        .dispatch('Team/getTeamDetails', this.teamId)
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
