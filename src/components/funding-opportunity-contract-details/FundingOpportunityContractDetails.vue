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
              <div class="row c-pb-5 c-pt-5">
                <div class="headline col-8">Grant Summary</div>
                <div class="col-4 text-align-right">
                  <span v-if="isGrantor">
                    <v-chip v-if="contractIsPending" label color="red" text-color="white">
                      <span class="bold">Waiting for treasury approve</span>
                    </v-chip>
                    <v-chip v-if="contractIsApproved" label color="green" text-color="white">
                      <span class="bold">Approved</span>
                    </v-chip>
                  </span>
                  <span v-if="isTreasury">
                    <v-btn v-if="contractIsPending" color="primary" class="ma-0" @click="approve()" 
                      :loading="isApproving" 
                      :disabled="isApproving">
                      Approve
                    </v-btn>
                    <v-chip v-if="contractIsApproved" label color="green" text-color="white">
                      <span class="bold">Approved</span>
                    </v-chip>
                  </span>
                </div>
              </div>

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
                <div class="subtitle bold c-pt-10 c-pb-5">{{getOrganizationTitle(organization.orgId)}}</div>
                <v-expansion-panel>
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
                          <div class="text-align-right body-2" style="padding-right: 2%;">${{getTotalFundingAmount(funding)}}</div>
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
                              <div v-if="!contractIsPending" class="col-6">
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
                              <div :class="!contractIsPending ? 'col-2' : 'col-8'">
                                <div class="c-pt-4 body-2">${{fromAssetsToFloat(expense.amount)}}</div>
                              </div>
                            </div>
                          </div>
                          <div class="row" v-if="contractIsPending">
                            <div class="col-2"></div>
                            <div class="col-2">
                              <div class="body-2 c-pt-4">University overhead</div>
                            </div>
                            <div class="col-8">
                              <div class="body-2 c-pt-4">{{convertToPercent(funding.university_overhead)}}%</div>
                            </div>
                          </div>
                          <div class="row" v-else>
                            <div class="col-2"></div>
                            <div class="col-2">
                              <div class="body-2 c-pt-4">Total spent:</div>
                            </div>
                            <div class="col-8">
                              <div class="body-2 c-pt-4 c-pl-2">
                                ${{getTotalCurrentExpensesAmount(funding)}}
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

            <v-flex xs12 v-if="transactions.length">
            
              <div class="row c-pt-10">
                <div class="col-12 bold subheading">Transactions</div>
              </div>

              <div class="row c-pt-8 text-align-center">
                <div class="col-2">
                  <span class="caption grey--text">
                    FROM
                    <v-icon class="sort-icon">
                      unfold_more
                    </v-icon>
                  </span>
                </div>

                <div class="col-2">
                  <span class="caption grey--text">
                    TO
                    <v-icon class="sort-icon">
                      unfold_more
                    </v-icon>
                  </span>
                </div>

                <div class="col-2">
                  <span class="caption grey--text">
                    ORGANIZATION
                    <v-icon class="sort-icon">
                      unfold_more
                    </v-icon>
                  </span>
                </div>

                <div class="col-2">
                  <span class="caption grey--text">
                    TRANSACTION
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

                <div class="col-2">
                  <span class="caption grey--text">
                    AMOUNT
                    <v-icon class="sort-icon">
                      unfold_more
                    </v-icon>
                  </span>
                </div>

                <div class="col-2">
                  <span class="caption grey--text">
                  </span>
                </div>
              </div>

              <div class="row">
                <div class="col-12 c-pt-5">
                  <v-expansion-panel>
                    <v-expansion-panel-content v-for="(tx, transactionIdx) in transactions" :key="'tx-' + transactionIdx">
                      <div slot="header">
                        <div class="row text-align-center">
                          <div class="col-2">
                           <!-- <v-icon small class="c-pr-1">
                              {{ !tx.isUniversityReceiver ? 'school' : 'face'}}
                            </v-icon> -->
                            {{getTransactionSenderName(tx)}}
                          </div>
                          <div class="col-2">
                          <!--  <v-icon small class="c-pr-1">
                              {{ !tx.isUniversityReceiver ? 'school' : 'face'}}
                            </v-icon> -->
                            {{getTransactionReceiverName(tx)}}</div>
                          <div class="col-2">
                            <v-icon small class="c-pr-1" v-if="getTxUniversity(tx)">
                              {{'school'}}
                            </v-icon>
                            {{getTxUniversity(tx)}}
                          </div>
                          <div class="col-2 grey--text">
                            {{getTransactionType(tx)}}
                          </div>
                          <div class="col-2 grey--text ">{{new Date(`${tx.time}Z`).toDateString()}}</div>
                          <div class="col-2 bold">$ {{fromAssetsToFloat(tx.amount)}}</div>
                        </div>
                      </div>
                      <v-card style="background-color: #f1f8fe">
                        <v-card-text>
                          <div class="row" >
                            <div class="col-2"></div>
                            <div class="col-8"></div>
                            <div class="col-2"></div>
                          </div>
                        </v-card-text>
                      </v-card>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </div>
              </div>
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
    import { getOrganizationTitle,getUniversityById } from './../../utils/organizations';

    export default {
        name: "FundingOpportunityContractDetails",
        
        data() {
            return {
              isApproving: false
            }
        },

        computed: {
          ...mapGetters({
            agencyProfile: 'agencyProgramContractDetails/agency',
            program: 'agencyProgramContractDetails/program',
            contract: 'agencyProgramContractDetails/contract',
            relationsByOrganizations: 'agencyProgramContractDetails/relationsByOrganizations',
            transactions: 'agencyProgramContractDetails/transactions',
            user: 'auth/user',
            isGrantor: 'auth/isGrantor',
            isOfficer: 'auth/isOfficer',
            isApplicant: 'auth/isApplicant',
            isTreasury: 'auth/isTreasury'
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
          },

          contractIsPending() {
            return this.contract.status == 1;
          },
          contractIsApproved() {
            return this.contract.status == 2;
          }

        },

        methods: {
          getOrganizationTitle,
          getUniversityById,

          getTransactionSenderName(tx) {
            return tx.senderProfile && tx.senderProfile.account ? this.$options.filters.fullname(tx.senderProfile) : (tx.senderProfile ? tx.senderProfile.name : "");
          },

          getTransactionReceiverName(tx) {
            return tx.receiverProfile && tx.receiverProfile.account ? this.$options.filters.fullname(tx.receiverProfile) : (tx.receiverProfile ? tx.receiverProfile.name : "");
          },

          getTxUniversity(tx) {
            return getUniversityById(tx.receiver_organisation_id) ? getUniversityById(tx.receiver_organisation_id).name : "";
          },

          getTransactionType(tx) {
            if (tx.sender_organisation_id == 1) {
              return "Grant";
            }
            if (tx.isUniversityOverhead) {
              return "University Overhead";
            }
            return "Withdraw";
          },

          getTotalFundingAmount(funding) {
            return funding.research_expenses.reduce((acc, exp) => {
              let amount = this.fromAssetsToFloat(exp[1]);
              return acc += amount;
            }, 0);
          },
          
          getTotalCurrentExpensesAmount(funding) {
            return funding.current_expenses.reduce((acc, exp) => {
              let amount = this.fromAssetsToFloat(exp[1]);
              return acc += amount;
            }, 0);
          },

          getOrderedMilestones(milestones) {
            let orderedMilestones = [];
            for (let i = 0; i < milestones.length; i++){
              let milestone = milestones[i];
              if (milestone.status == 2) {
                orderedMilestones.push(milestone)
              }
            }
            for (let i = 0; i < milestones.length; i++){
              let milestone = milestones[i];
              if (milestone.status == 1) {
                orderedMilestones.push(milestone)
              }
            }
            for (let i = 0; i < milestones.length; i++){
              let milestone = milestones[i];
              if (milestone.status == 4) {
                orderedMilestones.push(milestone)
              }
            }
            for (let i = 0; i < milestones.length; i++){
              let milestone = milestones[i];
              if (milestone.status == 3) {
                orderedMilestones.push(milestone)
              }
            }
            return orderedMilestones;
          },

          fundingMilestonesChartOptions(funding) {
            // TODO: Revise this algo after we implement milestone finalization
            let totalCurrentExpencesAmount = this.getTotalCurrentExpensesAmount(funding);
            let totalExpencesAmount = this.getTotalFundingAmount(funding);
            let spentPercent = parseFloat(((totalCurrentExpencesAmount / totalExpencesAmount) * 100)).toFixed(2);
            spentPercent = parseFloat(spentPercent);
            let amount = [];
            let spentPercentReached = false;
            let orderedMilestones = this.getOrderedMilestones(funding.milestones);

            for (let i = 0; i < orderedMilestones.length; i++) {
              let current = orderedMilestones[i];
              let milestonePercent = this.convertToPercent(current.amount);
              if (!spentPercentReached && milestonePercent >= spentPercent) {

                  if (milestonePercent != spentPercent) {
                    amount.push(milestonePercent - (milestonePercent - spentPercent));
                    amount.push(milestonePercent - spentPercent)
                  } else {
                    amount.push(milestonePercent);
                  }
                  spentPercentReached = true;
              } else {
                  amount.push(milestonePercent);
              }
            }

            let colors = amount.map((a, i) => i == 0 ? '#8dc2f9' : '#e0e0e0');

            return {
              isStacked: 'percent',
              height: 50,
              legend: { position: 'top', maxLines: 1, textStyle: {fontSize: 12, bold: true} },
              chartArea: { width: '95%', height:'100%' , top: 20, /* left: 0 */},
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
            // TODO: Revise this algo after we implement milestone finalization
            let totalCurrentExpencesAmount = this.getTotalCurrentExpensesAmount(funding);
            let totalExpencesAmount = this.getTotalFundingAmount(funding);
            let spentPercent = parseFloat(((totalCurrentExpencesAmount / totalExpencesAmount) * 100)).toFixed(2);
            spentPercent = parseFloat(spentPercent);
            let names = [];
            let amount = [];
            let spentPercentReached = false;
            let orderedMilestones = this.getOrderedMilestones(funding.milestones);
            
            for (let i = 0; i < orderedMilestones.length; i++) {
              let current = orderedMilestones[i];
              let milestonePercent = this.convertToPercent(current.amount);

              if (!spentPercentReached && milestonePercent >= spentPercent) {
    
                if (milestonePercent != spentPercent) {
                  names.push(`Spent - ${spentPercent}%`);
                  amount.push(milestonePercent - (milestonePercent - spentPercent));
                  names.push(`Milestone ${i + 1} - ${milestonePercent}%`);
                  amount.push(milestonePercent - spentPercent);
                } else {
                  names.push(`Milestone ${i + 1} - ${milestonePercent}%`);
                  amount.push(milestonePercent);
                }
                spentPercentReached = true;
              } else {
                  names.push(`Milestone ${i + 1} - ${milestonePercent}%`);
                  amount.push(milestonePercent);
              }
            }

            return [
              ['Milestone', ...names, { role: 'annotation' } ],
              ['', ...amount, '']
            ];
          },

          fundingExpenseChartOptions(funding, maxExpense) {
            let currentExpense = funding.current_expenses.find(e => e[0] == maxExpense.type);
            let currentExpenseAmount = currentExpense[1] ? this.fromAssetsToFloat(currentExpense[1]) : 0;
            let colors = currentExpenseAmount == 0 ? ['#e0e0e0', '#e0e0e0'] : ['#8dc2f9', '#e0e0e0'];
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

          fundingExpenseChartData(funding, maxExpense) {
            let currentExpense = funding.current_expenses.find(e => e[0] == maxExpense.type);
            let currentExpenseAmount = currentExpense[1] ? this.fromAssetsToFloat(currentExpense[1]) : 0;
            let maxExpenseAmount = this.fromAssetsToFloat(maxExpense.amount);
            
            let percent = currentExpenseAmount == 0 ? 0 : (currentExpenseAmount / maxExpenseAmount) * 100;
            let names = percent == 0 ? ['', ''] : [`Spent: $${currentExpenseAmount}`, ''];
            let amount = percent == 0 ? [0, 100] : [percent, 100 - percent];

            return [
              ['Milestone', ...names, { role: 'annotation' } ],
              ['', ...amount, '']
            ];
          },

          approve() {
            // this.isApproving = true;
            // deipRpc.broadcast.approveFundingAsync(
            //   this.user.privKey,
            //   this.contract.id,
            //   this.user.username
            // ).then(() => {
            //   this.$store.dispatch('layout/setSuccess', {
            //     message: "Funding opportunity contract is approved successfully !"
            //   });

            //   this.$store.dispatch('agencyProgramContractDetails/loadProgramContractDetailsPage', 
            //     { agency: this.agencyProfile._id, 
            //       foaId: this.program.funding_opportunity_number, 
            //       contractId: this.contract.id
            //     });

            // }, (err) => {
            //   this.$store.dispatch('layout/setError', {
            //     message: `An error occurred while accepting invite, please try again later`
            //   });
            //   console.log(err);
            // })
            // .finally(() => {
            //   this.isApproving = false;
            // });
          }
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
