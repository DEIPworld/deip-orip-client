<template>
  <v-container fluid class="ma-0 pa-0 c-pb-10">
    <v-layout row wrap>

      <v-flex xs12 class="pa-4 grey-background">
        <h1 class="display-1">Award # {{award | awardNumber}}</h1>
      </v-flex>

      <v-flex xs6 class="pa-4 grey-background">
        <v-layout row wrap>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">PI</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" :to="{ name: 'UserDetails', params: { account_name: award.pi.account.name } }">{{ award.pi | fullname }}</router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Organization</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <a href="#" class="a body-2">{{ award.org.name}}</a>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Award title</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <router-link class="a body-2" 
              :to="{ name: 'AgencyProgramDetails', params: {
                      agency: award.contract.foa.agency_name, 
                      foa: award.contract.foa.funding_opportunity_number }}">
              {{award.contract.foa.funding_opportunity_title }}
            </router-link>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Agency</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <a href="#" class="a body-2">{{ award.contract.foa.agency_name.toUpperCase()}}</a>
          </v-flex>

          <v-flex xs3 class="pa-1">
            <span class="body-2 grey--text">Duration</span>
          </v-flex>
          <v-flex xs9 class="pa-1">
            <span class="body-2">{{ moment(new Date(award.from)).format("MM/YY") }} - {{ moment(new Date(award.to)).format("MM/YY") }}</span>
          </v-flex>

        </v-layout>
      </v-flex>

      <v-flex xs1 class="grey-background py-3 text-xs-center"><v-divider vertical></v-divider></v-flex>

      <v-flex xs5 class="pa-4 grey-background">
        <v-layout row wrap>
          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Award amount</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="bold">$ {{ award.totalAmount | currency}}</span>
          </v-flex>

          <v-flex xs8 class="pa-1"><v-divider></v-divider></v-flex><v-flex xs4></v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Administrative expenses</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="body-2">$ {{ award.universityOverheadAmount | currency}}</span>
          </v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Requested by PI</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="body-2">$ {{ award.requestedPiAmount | currency}}</span><span class="body-2 grey--text"> of $ {{award.piAmount | currency}}</span>
          </v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Requested by Subawardees</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="body-2">$ {{ award.requestedSubawardeesAmount | currency}}</span><span class="body-2 grey--text"> of $ {{award.subawardeesAmount | currency}}</span>
          </v-flex>

          <v-flex xs8 class="pa-1"><v-divider></v-divider></v-flex><v-flex xs4></v-flex>

          <v-flex xs5 class="pa-1">
            <span class="body-2 grey--text">Remaining amount</span>
          </v-flex>
          <v-flex xs7 class="pa-1">
            <span class="bold">$ {{ award.remainingAmount | currency}}</span>
          </v-flex>

        </v-layout>
      </v-flex>


    </v-layout>
  </v-container>
</template>

<script>

    import deipRpc from '@deip/deip-rpc-client';
    import { mapGetters } from 'vuex'

    export default {
        name: "AwardDetails",

        data() {
          return {}
        },

        computed: {
          ...mapGetters({
            user: 'auth/user',
            isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
            isCertifier: 'auth/isCertifier',
            isProgramOfficer: 'auth/isProgramOfficer',
            isFinancialOfficer: 'auth/isFinancialOfficer',
            organization: 'award_details/organization',
            award: 'award_details/award'
          }),
        },

        created() {}
    };
</script>

<style lang="less" scoped>

  .grey-background {
    background-color: #f5f5f5
  }

</style>
