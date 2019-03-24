<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
        <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/">
                <v-breadcrumbs-item v-for="item in breadcrumbs"
                        :key="item.text" 
                        :disabled="item.disabled" 
                        :to="item.to">
                    {{ item.text }}
                </v-breadcrumbs-item>
            </v-breadcrumbs>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs9>
        <v-divider></v-divider>
        <v-card class="c-pl-5 c-pr-5 c-pb-10">
          <v-layout row wrap>
            <v-flex xs12>
              <div class="display-1 c-pb-10 c-pt-10">{{program.funding_opportunity_title}} ({{program.funding_opportunity_number}})</div>
              <v-divider></v-divider>
            </v-flex>
            
            <v-flex xs12>
              <div class="headline c-pb-5 c-pt-5">Grant Summary</div>

              <div class="row c-pt-8">
                <div class="col-2">
                  <span class="caption grey--text">
                    RESEARCHER
                    <v-icon class="sort-icon">
                      unfold_more
                    </v-icon>
                  </span>
                </div>
                <div class="col-8"></div>
                <div class="col-2 text-align-right">
                  <span class="caption grey--text">
                    TOTAL AMOUNT
                    <v-icon class="sort-icon">
                      unfold_more
                    </v-icon>
                  </span>
                </div>
              </div>

              <div v-for="(organization, organizationIdx) in relationsByOrganizations" :key="'org-' + organizationIdx">
                <div class="subtitle bold c-pt-5 c-pb-5">Org {{organizationIdx}}</div>
                <v-expansion-panel> <!-- class="c-pt-2 c-pb-2" -->
                  <v-expansion-panel-content v-for="(funding, fundingIdx) in organization.relations" :key="'funding-' + fundingIdx + '-org-' + organizationIdx">
                    <div slot="header">
                      <div class="row">
                        <div class="col-2">
                          <div class="c-pt-4">
                            <router-link class="a deip-blue-color body-1" :to="{ name: 'UserDetails', params: { account_name: funding.researcherUser.account.name } }">
                              {{ funding.researcherUser | fullname }}
                            </router-link>
                          </div>
                        </div>
                        <div class="col-10">
                          <div>
                            <GChart
                              type="BarChart"
                              :settings="{ packages: ['corechart', 'bar'] }"
                              :data="fundingMilestonesChartData(funding)"
                              :options="fundingMilestonesChartOptions(funding)"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-12">
                          <div class="text-align-right body-2" style="padding-right: 2%;">${{totalFundingAmount(funding)}}</div>
                        </div>
                      </div>
                    </div>
                    <v-card>
                      <v-card-text class="pt-0">
                        <div class="c-ph-2">
                          <div v-for="(expense, expenseIdx) in funding.researchExpenses" :key="'funding-' + fundingIdx + '-org-' + organizationIdx + '-exp-' + expenseIdx">
                            <div class="row">
                              <div class="col-2"></div>
                              <div class="col-2">
                                <div class="body-2 c-pt-4">{{expense.title}}</div>
                              </div>
                              <div class="col-6">
                                <div class="row">
                                  <div class="col-12">                         
                                    <GChart
                                      type="BarChart"
                                      :settings="{ packages: ['corechart', 'bar'] }"
                                      :data="fundingExpenseChartData(funding, expense)"
                                      :options="fundingExpenseChartOptions(funding, expense)"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div class="col-2">
                                <div class="c-pt-4">${{expense.amount}}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <div class="row shadow">
                  <span class="col-12 text-align-right">
                    <div style="text-align: right; background-color: #ebf5fe; padding: 15px; padding-right: 10px">
                      <div class="subheading bold">Total: ${{organization.totalAmount}}</div>
                    </div>
                  </span>
                </div>

                <div v-if="organizationIdx == (relationsByOrganizations.length - 1)" class="row shadow">
                  <span class="col-12 text-align-right">
                    <div style="text-align: right; background-color: #badefc; padding: 15px; padding-right: 10px">
                      <div class="subheading bold">All total: ${{totalContractAmount}}</div>
                    </div>
                  </span>
                </div>
              </div>


            </v-flex>

            <v-flex xs12>
            </v-flex>

          </v-layout>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card style="height: 400%">

              <div class="c-pt-5 c-pb-5 text-align-center">
                <v-avatar size="120px">
                    <img :src="agencyProfile._id | agencyLogoSrc(160, 160, false)" />
                </v-avatar>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <div class="sm-title c-pb-2 bold">Program Officers</div>
                <div v-for="officer in program.officers">
                  <div class="row-nowrap text-align-center c-pt-2">
                    <v-avatar size="40px">
                        <img v-if="officer.profile" v-bind:src="officer.profile.avatar | avatarSrc(30, 30, false)" />
                        <v-gravatar v-else :email="officer.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link class="a deip-blue-color body-1 c-pl-3 c-pt-2" :to="{ name: 'UserDetails', params: { account_name: officer.account.name } }">
                      {{ officer | fullname }}
                    </router-link>
                  </div>
                </div>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <v-icon color="#2962FF">email</v-icon>
                <span class="c-pl-1 deip-blue-color bold">{{program.grantor_contact_info || agencyProfile.email}}</span>
              </div>
              <v-divider></v-divider>

            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "FundingOpportunityContractDetails",
        
        data() {
            return {
            }
        },

        computed: {
          ...mapGetters({
            agencyProfile: 'agencyProgramContractDetails/agency',
            program: 'agencyProgramContractDetails/program',
            contract: 'agencyProgramContractDetails/contract',
            relationsByOrganizations: 'agencyProgramContractDetails/relationsByOrganizations',
            user: 'auth/user',
            isGrantor: 'auth/isGrantor',
            isOfficer: 'auth/isOfficer',
            isApplicant: 'auth/isApplicant'
          }),

          breadcrumbs() {
            return [
              { text: this.agencyProfile.shortName, disabled: false, to: `${this.agencyProfile._id}/programs` }, 
              { text: "Programs", disabled: false, to: `${this.agencyProfile._id}/programs` },
              { text: this.program.area.abbreviation, disabled: false, to: `/${this.agencyProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` }, 
              { text: this.program.subArea.abbreviation, disabled: false, to:`/${this.agencyProfile._id}/programs?areaCode=${this.program.area.abbreviation}&subAreaCode=${this.program.subArea.abbreviation}` },
              { text: this.program.title, disabled: true }
            ];
          },

          totalContractAmount() {
            return this.relationsByOrganizations.reduce((acc, org) => acc + org.totalAmount, 0);
          }
        },

        methods: {
          totalFundingAmount(funding) {
            return funding.research_expenses.reduce((acc, exp) => acc + parseInt(exp[1], 10), 0);
          },
          
          fundingMilestonesChartOptions(funding) {
            let colors = funding.milestones.map((m, i) => m.status == 2 ? '#8dc2f9' : '#e0e0e0');
            return {
              isStacked: 'percent',
              height: 50,
              legend: { position: 'top', maxLines: 1, textStyle: {fontSize: 12, bold: true} },
              chartArea: { width: '100%', height:'100%' , top: 20, /* left: 0 */},
              hAxis: {                    
                minValue: 0,
                ticks: [0],
                textPosition: 'none',
                baselineColor: '#FFFFFF'
              },
              colors: [...colors]
            }
          },

          fundingMilestonesChartData(funding) {
            let names = funding.milestones.map((m, i) => `Milestone ${i + 1} - ${m.amount}%` );
            let amount = funding.milestones.map((m, i) => m.amount);
            return [
              ['Milestone', ...names, { role: 'annotation' } ],
              ['', ...amount, '']
            ];
          },

          fundingExpenseChartOptions(funding, expense) {
            let currentExpense = funding.current_expenses.find(e => e[0] == expense.type);
            let colors = currentExpense[1] == 0 ? ['#e0e0e0', '#e0e0e0'] : ['#8dc2f9', '#e0e0e0'];
            return {
              isStacked: 'percent',
              height: 50,
              legend: { position: 'none' },
              chartArea: { width: '95%', height: '50%'},
              hAxis: {                    
                minValue: 0,
                ticks: [0],
                textPosition: 'none',
                baselineColor: '#FFFFFF'
              },
              colors: [...colors]
            }
          },

          fundingExpenseChartData(funding, expense) {
            let currentExpense = funding.current_expenses.find(e => e[0] == expense.type);
            let percent = currentExpense[1] == 0 ? 0 : (currentExpense[1] / expense.amount) * 100;

            let names = percent == 0 ? ['', ''] : ['Spent', ''];
            let amount = percent == 0 ? [0, 100] : [percent, 100];

            return [
              ['Milestone', ...names, { role: 'annotation' } ],
              ['', ...amount, '']
            ];
          },

        },

        mounted() {},
        created() {},
    }
</script>

<style lang="less" scoped>

  .shadow {
    -webkit-box-shadow: 0px 0px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
    box-shadow: 0px 0px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  }

</style>
