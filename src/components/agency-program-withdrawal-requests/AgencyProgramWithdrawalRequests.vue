<template>
  <v-container fluid class="c-p-10">
    <v-layout row wrap>
      <v-flex xs12>
        <div class="display-1 c-pb-10">{{agencyProfile._id}} Grants</div>
        <v-divider></v-divider>

        <div class="row c-pt-8">

          <div class="col-2">
            <span class="caption grey--text c-pl-5">
              RESEARCHER
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-3">
            <span class="caption grey--text">
              RESEARCH
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-2">
            <span class="caption grey--text">
              DATE & TIME (UTC)
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-1">
            <span class="caption grey--text">
              GRANT
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-1">
            <span class="caption grey--text">
              PURPOSE
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-1">
            <span class="caption grey--text">
              AMOUNT
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>

          <div class="col-2 text-align-right">
            <span class="caption grey--text">
            </span>
          </div>

        </div>
      </v-flex>

      <v-flex xs12>
        <div class="c-pb-5">
          <div class="subtitle bold c-pt-5 c-pb-2 c-pl-5"></div>
          <div>
            <v-divider class="c-mb-4"></v-divider>
              <div class="row">
                <div class="col-2">
                </div>
                <div class="col-3">
                </div>
                <div class="col-2">
                </div>
                <div class="col-1">
                </div>
                <div class="col-1">
                </div>
                <div class="col-1">
                </div>
                <div class="col-2">
                </div>
              </div>
            <v-divider class="c-mt-4"></v-divider>
          </div>

        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import { getOrganizationTitle } from './../../utils/organizations';

    export default {
        name: "AgencyProgramWithdrawalRequests",
        
        data() {
            return {
            }
        },

        computed: {
          ...mapGetters({
            user: 'auth/user',
            isGrantor: 'auth/isGrantor',
            isOfficer: 'auth/isOfficer',
            isApplicant: 'auth/isApplicant',
            isTreasury: 'auth/isTreasury',
            agencyProfile: 'agencyProgramWithdrawalRequests/agency',

          }),
        },

        methods: {
          getOrganizationTitle
        },

        mounted() {},
        created() {},
    }
</script>

<style lang="less" scoped>


</style>
