<template>
  <v-skeleton-loader
    type="table-thead, table-tbody"
    :loading="!$ready"
  >
    <v-data-table
      :headers="groupsListTableHeader"
      :items="allGroups"
      :hide-default-footer="allGroups.length < 50"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="50"
    >

    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'GroupsInfoTable',

    data() {
      return {
        groupsListTableHeader: [
          {
            text: 'Name',
            value: 'external_id'
          },
          {
            text: 'Name',
            value: 'asd'
          },
          {
            text: 'Name',
            value: 'zxc'
          },
          {
            text: 'Name',
            value: 'dfg'
          }
        ]
      }
    },

    computed: {
      ...mapGetters({
        allGroups: 'userWallet/allGroups'
      })
    },
    created() {
      this.$store.dispatch('userWallet/loadAllGroups', this.$currentUserName)
        .then(() => { this.$setReady(); });
    }
  }
</script>