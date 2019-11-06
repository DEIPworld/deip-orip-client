<template>
  <v-layout row wrap class="py-5 px-4" style="flex: 0 0 auto;">
    <v-layout column>
      <div class="title bold">My Inbox</div>

      <v-layout column>
        <v-layout row align-end fill-height class="py-3"> 
          <v-flex xl1 lg1 md1 sm4 xs4>
            <v-checkbox
              class="ma-0 pa-0"
              v-model="allRecentSelected"
              hide-details>
            </v-checkbox>
          </v-flex>
          <v-flex xl8 lg8 md8 sm8 xs8>
            <div class="subheading half-bold">Recent updates</div>
          </v-flex>
          <v-flex xl3 lg3 md3 sm12 xs12>
            <v-select
              v-model="sort" 
              :items="sortingOptions" 
              solo
              dense
              hide-details
              class="ma-0 pa-0"
              item-text="title"
              item-value="id">
            </v-select>
          </v-flex>
        </v-layout>
        <v-layout column>
          <v-card class="pa-2 card-label">
            <v-layout row wrap align-baseline>
              <v-flex xs1 align-self-center>
                <v-checkbox
                  class="ma-0 pa-0"
                  hide-details>
                </v-checkbox>
              </v-flex>
              <v-flex>
                <router-link class="a px-2" :to="{ name: 'Default' }">
                  Integrated	mobility	network
                </router-link>
              </v-flex>
              <v-flex class="text-xs-right">
                <v-chip class="ma-0" color="#CCE0CC" text-color="black">Sponsored</v-chip>
              </v-flex>
            </v-layout>
          </v-card>
        </v-layout>
      </v-layout>

      <v-layout column class="pt-5">
        <v-layout row align-end fill-height class="py-3"> 
          <div class="subheading half-bold">Overdue notifications</div>
        </v-layout>
        <v-card class="pa-2 card-label">
          <v-layout row wrap align-baseline>
            <v-flex xs1 align-self-center>
              <v-checkbox
                class="ma-0 pa-0"
                hide-details>
              </v-checkbox>
            </v-flex>
            <v-flex>
              <router-link class="a px-2" :to="{ name: 'Default' }">
                Parallel	functional	preprocessor
              </router-link>
            </v-flex>
            <v-flex class="text-xs-right">
              <v-chip class="ma-0" color="#CCE0CC" text-color="black">Sponsored</v-chip>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>
      
    </v-layout>
  </v-layout>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'InvestorDashboardInbox',
    data() {
      return {
        allRecentSelected: false,
        sortingOptions: [{title: "All", id: 1}],
        sort: 1
      }
    },

    computed: {
      ...mapGetters({
        user: "auth/user"
      })
    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
 .card-label {
   border-left: 4px solid #0039CB
 }
</style>
