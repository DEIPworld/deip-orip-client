<template>
  <div v-if="$ready">
    <slot v-bind="bindData" />
  </div>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { teamsStore } from '@/features/Teams/store';
  import { mapState } from 'vuex';
  import { isString } from '@deip/toolbox';

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
      }),

      bindData() {
        return {
          teams: this.teamsList,
          ...(isString(this.teams) ? {
            team: this.$store.getters[`${this.storeNS}/one`](this.teams)
          } : {})
        };
      }
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
