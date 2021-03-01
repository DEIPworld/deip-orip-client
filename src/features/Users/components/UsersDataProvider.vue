<template>
  <div v-if="$ready">
    <slot v-bind="{ teams: teamsList }" />
  </div>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { teamsStore } from '@/features/Teams/store';
  import { mapState } from 'vuex';

  export default {
    name: 'TeamsDataProvider',
    mixins: [
      componentStoreFactory(teamsStore)
    ],
    props: {
      teams: {
        type: [Array, String],
        default: () => ([])
      },

      filter: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      ...mapState({
        teamsList(state, getters) { return getters[`${this.storeNS}/list`](this.filter); }
      })
    },

    created() {
      const getData = this.teams.length
        ? this.$store.dispatch(`${this.storeNS}/get`, this.teams)
        : this.$store.dispatch(`${this.storeNS}/fetch`);

      getData.then(() => {
        this.$setReady();
      });
    }
  };
</script>
