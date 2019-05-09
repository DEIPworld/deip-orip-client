<template>
  <v-container fluid class="c-p-10">
    <v-layout row wrap>

      <v-flex xs12>
        <div class="display-1 c-pb-10">Granted Awards</div>
        <v-divider></v-divider>
        <div class="row c-pt-8">
          <div class="col-5">
            <span class="caption grey--text c-pl-5">
              FUNDING OPPORTUNITY
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>
          <div class="col-2 text-align-right">
            <span class="caption grey--text">
              PROGRAM NUMBER
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>
          <div class="col-2 text-align-right">
            <span class="caption grey--text">
              APPLICATIONS
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>
          <div class="col-3 text-align-right">
            <span class="caption grey--text">
              TOTAL AMOUNT
              <v-icon class="sort-icon">
                unfold_more
              </v-icon>
            </span>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 class="headline c-pb-10 c-pt-10 text-align-center" v-if="!contractsByAgencies.length">
        No grant contracts found
      </v-flex>
      <v-flex xs12 v-for="(agency, agencyIdx) in contractsByAgencies" :key="'agency-' + agencyIdx">
        <div class="c-pb-5">
          <div class="sm-title bold c-pt-5 c-pb-2 c-pl-5">{{getOrganizationTitle(agency.id)}}</div>
          <div v-for="(contract, contractIdx) in agency.contracts" 
            :key="'contract-' + contractIdx" class="c-pt-2" 
            :class="contractIdx != agency.contracts.length - 1 ? 'c-pb-3' : ''">

            <v-divider v-if="contractIdx == 0" class="c-mb-4"></v-divider>
              <div class="row">
                <div class="col-5">
                  <span class="c-pl-5">
                    <router-link class="a" :to="{
                          name: 'FundingOpportunityAwardDetails', 
                          params: { 
                            agency: decodeURIComponent(contract.foa.agency_name), 
                            foa: decodeURIComponent(contract.foa.funding_opportunity_number), 
                            contractId: decodeURIComponent(contract.id) 
                          }}">
                      {{ contract.foa.funding_opportunity_title }}
                    </router-link>
                  </span>
                </div>
                <div class="col-2 text-align-right">
                  <router-link class="a bold deip-blue-color" 
                      :to="{ name: 'AgencyProgramDetails', 
                          params: { 
                              agency: contract.foa.agency_name, 
                              foa: contract.foa.funding_opportunity_number }}">
                      # {{ contract.foa.funding_opportunity_number }}
                  </router-link>
                </div>
                <div class="col-2 text-align-right">
                  <span class="bold">{{contract.relations.length}}</span>
                </div>
                <div class="col-3 text-align-right">
                  <span class="bold">$ {{contractTotalAmount(contract)}}</span>
                </div>
              </div>
            <v-divider class="c-mt-4"></v-divider>
          </div>
          <div class="row shadow">
            <span class="col-12 text-align-right">
              <div style="text-align: right; background-color: #ebf5fe; padding: 15px; padding-right: 10px">
                <div class="subheading bold">Total: $ {{agency.totalAgencyAmount}}</div>
              </div>
            </span>
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
        name: "TreasuryDepartment",
        
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
            contracts: 'treasuryDepartment/contracts',
            contractsByAgencies: 'treasuryDepartment/contractsByAgencies'
          }),
        },

        methods: {
          getOrganizationTitle,

          contractTotalAmount(contract) {
            return contract.relations.reduce((acc, rel) => {
              return acc + rel.research_expenses.reduce((acc, exp) => {
                  let amount = this.fromAssetsToFloat(exp[1]);
                  return acc += amount;
              }, 0);
            }, 0);
          }
        },

        mounted() {},
        created() {},
    }
</script>

<style lang="less" scoped>


</style>
