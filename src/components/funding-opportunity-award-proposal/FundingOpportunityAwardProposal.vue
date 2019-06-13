<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
        <v-card>
          <v-card-text class="px-0 pa-0">
            <!-- <v-breadcrumbs divider="/">
                <v-breadcrumbs-item v-for="item in breadcrumbs"
                        :key="item.text" 
                        :disabled="item.disabled" 
                        :to="item.to">
                    {{ item.text }}
                </v-breadcrumbs-item>
            </v-breadcrumbs> -->
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
              <div class="headline c-pt-5">Award Receivers 
                <v-switch
                  v-model="mustBeEqualToStandard"
                  label="Must be equal to standard"
                ></v-switch>
              </div>
              <div v-for="(funding, fundingIdx) in fundings">
                <div v-if="fundingIdx != 0" class="row">
                  <span class="col-2"> 
                      <v-btn v-if="fundingIdx != 0" @click="removeReceiver(fundingIdx)" class="ma-0" block outline color="primary">
                        <v-icon>remove</v-icon>
                        Receiver #{{fundingIdx + 1}}
                      </v-btn>
                  </span>
                  <span class="col-10 title"></span>
                </div>

                <div class="row c-pt-12">
                  <span class="col-8">
                    <div class="subheading bold">Researcher Name</div>
                    <v-autocomplete
                      label="Full Name"
                      :loading="funding.isResearchersLoading"
                      :items="funding.foundResearchers"
                      item-text="name"
                      return-object
                      :rules="[() => funding.researcher && funding.researcher.name.length > 0 || 'Researcher name is required']"
                      :search-input.sync="funding.researcherSearch"
                      v-on:keyup="queryResearchers(funding)"
                      v-model="funding.researcher"
                      @input="setResearchGroupsList(funding)"
                    ></v-autocomplete>
                  </span>
                  <span class="col-1"></span>
                  <span class="col-3">
                    <div class="subheading bold">Organization</div>
                    <div class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div ><label>{{funding.researcher ? getOrganizationTitle(funding.researcher.user.account.organisation_id) : "Organization"}}</label></div>
                      </div>
                    </div>
                  </span>
                </div>

                <div class="row c-pt-3">
                  <span class="col-12">
                    <div class="subheading bold">Research Group</div>
                      <v-select 
                        :items="funding.foundResearchGroups"
                        item-text="name"
                        return-object
                        :loading="funding.isResearchGroupsLoading"
                        v-model="funding.researchGroup"
                        label="Group name"
                        @input="setResearchList(funding)"
                      ></v-select>
                  </span>
                </div>

                <div class="row c-pt-3">
                  <span class="col-12">
                    <div class="subheading bold">Research</div>
                      <v-select 
                        :items="funding.foundResearch"
                        item-text="title"
                        return-object
                        :loading="funding.isResearchLoading"
                        v-model="funding.research"
                        label="Title"
                      ></v-select>
                  </span>
                </div>
                
                <div class="row c-pt-5">
                  <span class="col-8">
                    <div class="subheading bold">Purpose</div>
                    <div @click="focusInputByRef($event, 'funding-salary-' + fundingIdx)" class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot"><label>Salary</label></div>
                        <div class="v-text-field__details"></div> 
                      </div>
                    </div>
                  </span>
                  <span class="col-1"></span>
                  <span class="col-3">
                      <div class="subheading bold">&nbsp;</div>
                      <v-text-field v-model="funding.purpose.salary" class="right-input" :ref="'funding-salary-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                  </span>
                </div>

                <div class="row">
                  <span class="col-8">
                    <div @click="focusInputByRef($event, 'funding-equipment-' + fundingIdx)" class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot"><label>Equipment</label></div>
                        <div class="v-text-field__details"></div>
                      </div>
                    </div>
                  </span>
                  <span class="col-1"></span>
                  <span class="col-3">
                      <v-text-field v-model="funding.purpose.equipment" class="right-input" :ref="'funding-equipment-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                  </span>
                </div>

                <div class="row">
                  <span class="col-8">
                    <div @click="focusInputByRef($event, 'funding-businessTravel-' + fundingIdx)" class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot"><label>Business travel</label></div>
                        <div class="v-text-field__details"></div>
                      </div>
                    </div>
                  </span>
                  <span class="col-1"></span>
                  <span class="col-3">
                      <v-text-field v-model="funding.purpose.businessTravel" class="right-input" :ref="'funding-businessTravel-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                  </span>
                </div>

                <div class="row">
                  <span class="col-8">
                    <div class="subheading bold">University overhead cap</div>
                    <v-text-field v-model="funding.overhead" suffix="%" mask="###"></v-text-field>
                  </span>
                  <span class="col-1"></span>
                  <span class="col-3">
                      <div class="subheading bold">&nbsp;</div>
                      <div class="total-row">
                        <div class="subheading bold">Total amount</div>
                        <div class="headline">$ {{calculateTotalExpenses(funding)}}</div>
                      </div>
                  </span>
                </div>

                <div>
                  <div class="row c-pt-5 c-pb-5">
                    <span class="col-12">
                      <div class="subheading bold">Milestones</div>
                    </span>
                  </div>
                  <div v-for="(milestone, milestoneIdx) in funding.milestones">
                    <div>
                      <div class="row">
                        <span class="col-5">
                          <div class="subheading bold">Description</div>
                          <v-text-field v-model="milestone.description" :prefix="milestoneIdx + 1 + '.'"></v-text-field>
                        </span>
                        <span class="col-1"></span>
                        <span class="col-2">
                          <div class="subheading bold">Deadline</div>
                            <datetime-picker
                                :datetime="milestone.deadline"
                                :available-from-now="true"
                                :dateOnly="true"
                                @input="(val) => {
                                  milestone.deadline = val; 
                                  milestone.deadlineDate = new Date(val); 
                                }"
                            ></datetime-picker>
                        </span>
                        <span class="col-1"></span>
                        <span class="col-3">
                          <div class="subheading bold">Amount</div>
                          <div class="right-input">
                            <v-text-field v-model="milestone.amount" suffix="%" mask="###"></v-text-field>
                          </div>
                        </span>
                      </div>
                    </div>
                    <div v-if="(funding.milestones.length - 1) == milestoneIdx" class="row c-pb-3">
                      <span class="col-10"></span>
                      <span class="col-2">
                        <v-btn class="ma-0" block color="primary" @click="addMilestone(funding)">
                          <v-icon>add</v-icon>
                          Milestone
                        </v-btn>
                      </span>
                    </div>
                    <div v-if="funding.milestones.length > 1 && (funding.milestones.length - 1) != milestoneIdx" class="row c-pb-6">
                      <span class="col-10"></span>
                      <span class="col-2">
                        <v-btn class="ma-0" outline block color="primary" @click="removeMilestone(funding, milestoneIdx)">
                          <v-icon>remove</v-icon>
                          Milestone #{{milestoneIdx + 2}}
                        </v-btn>
                      </span>
                    </div>
                  </div>
                </div>
                <v-divider class="c-mt-12"></v-divider>
                <v-divider class="c-mb-12"></v-divider>
              </div>
              
              <div class="row c-pt-5 c-pb-5">
                <span class="col-2">
                  <v-btn class="ma-0" block color="primary" @click="addReceiver()">
                    <v-icon>add</v-icon>
                    Receiver
                  </v-btn>
                </span>
                <span class="col-8"></span>
                <span class="col-2">
                  <v-btn class="ma-0" block color="primary" 
                    @click="save()" :disabled="saveIsDisabled || isSaving" :loading="isSaving">Save</v-btn>
                </span>
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
                    <router-link class="a body-1 c-pl-3 c-pt-2" :to="{ name: 'UserDetails', params: { account_name: officer.account.name } }">
                      {{ officer | fullname }}
                    </router-link>
                  </div>
                </div>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <v-icon color="primary">email</v-icon>
                <span class="c-pl-1 bold">{{program.grantor_contact_info || agencyProfile.email}}</span>
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
    import _ from 'lodash';
    import { getOrganizationTitle } from './../../utils/organizations';
    import { signOperation, sendTransaction } from './../../utils/blockchain'

    export default {
        name: "FundingOpportunityAwardProposal",
        
        data() {
            return {
              fundings: [],
              isSaving: false,
              standard: '[{"researcher":"bob-tucker","research_id":2,"research_expenses":[[1,1000000],[2,0],[3,0]],"organisation_id":3,"university_overhead":1000,"milestones":[{"description":"milestone1","deadline":"2019-06-29T21:00:00","amount":10000}]},{"researcher":"john-nelson","research_id":9,"research_expenses":[[1,50000],[2,0],[3,0]],"organisation_id":3,"university_overhead":1000,"milestones":[{"description":"milestone1","deadline":"2019-06-29T21:00:00","amount":10000}]}]',
              mustBeEqualToStandard: true
            }
        },

        computed: {
            ...mapGetters({
                agencyProfile: 'foa_award_proposal/agency',
                program: 'foa_award_proposal/program',
                allUsers: 'foa_award_proposal/allUsers',
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

            saveIsDisabled() {
              return this.fundings.some(f => {
                let isInvalid = !f.researcher || !f.research || f.overhead == null || 
                  f.purpose.salary == null || f.purpose.equipment == null || f.purpose.businessTravel == null || 
                  f.milestones.some(m => {
                    return !m.description || m.amount == null || !m.deadlineDate;
                  });
                return isInvalid;
              });
            }
        },

        methods: {
          getOrganizationTitle,
          focusInputByRef($event, ref) {
            $event.stopPropagation();
            $event.preventDefault();
            let input = this.$refs[ref][0];
            input.focus();
          },

          calculateTotalExpenses(funding) {
            let salary = parseInt(funding.purpose.salary);
            let equipment = parseInt(funding.purpose.equipment);
            let businessTravel = parseInt(funding.purpose.businessTravel);
            return (salary || 0) + (equipment || 0) + (businessTravel || 0);
          },

          queryResearchers(funding) {
            funding.isResearchersLoading = true;
            funding.foundResearchers = this.allUsers.filter(user => {
              let name = this.$options.filters.fullname(user);
              return name.toLowerCase().indexOf((funding.researcherSearch || '').toLowerCase()) > -1 
                || user.account.name.toLowerCase().indexOf((funding.researcherSearch || '').toLowerCase()) > -1;
            })
            .map((user => {
              const name = this.$options.filters.fullname(user);
              return { name, user };
            }))
            funding.isResearchersLoading = false;
          },

          addReceiver() {
            const funding = {
              isResearchersLoading: false,
              isResearchGroupsLoading: false,
              isResearchLoading: false,

              researcherSearch: "",
              researcher: null,
              foundResearchers: [],
              foundResearch: [],
              foundResearchGroups: [],

              researchGroup: null,
              research: null,
              overhead: null,
              purpose: {
                businessTravel: null,
                equipment: null,
                salary: null
              },
              milestones: [],
            };
            this.addMilestone(funding);
            this.fundings.push(funding);
          },

          removeReceiver(idx) {
            this.fundings.splice(idx, 1);
          },

          addMilestone(funding) {
            funding.milestones.push({
              description: null,
              deadline: undefined,
              amount: null
            });
          },

          removeMilestone(funding, idx) {
            funding.milestones.splice(idx, 1);
          },

          setResearchGroupsList(funding) {
            funding.foundResearchGroups = [];
            funding.foundResearch = [];
            funding.isResearchGroupsLoading = true;

            deipRpc.api.getResearchGroupTokensByAccountAsync(funding.researcher.user.account.name)
              .then(tokens => {
                return Promise.all(tokens.map(token => deipRpc.api.getResearchGroupByIdAsync(token.research_group_id)));
              })
              .then((groups) => {
                funding.foundResearchGroups.push(...groups);
                return Promise.all(groups.map(group => deipRpc.api.getResearchesByResearchGroupIdAsync(group.id))); 
              })
              .finally(() => {
                funding.isResearchGroupsLoading = false;
              });
          },

          setResearchList(funding) {
            funding.foundResearch = [];
            funding.isResearchLoading = true;

            deipRpc.api.getResearchesByResearchGroupIdAsync(funding.researchGroup.id)
              .then(groupsResearchList => {
                let researches = [].concat.apply([], groupsResearchList);
                funding.foundResearch.push(...researches);
              })
              .finally(() => {
                funding.isResearchLoading = false;
              });
          },

          save() {
            let total_amount = 0;
            let researches = [];

            this.isSaving = true;

            for (let i = 0; i < this.fundings.length; i++) {
              let funding = this.fundings[i];
              let salary = parseInt(funding.purpose.salary) || 0;
              let equipment = parseInt(funding.purpose.equipment) || 0;
              let businessTravel = parseInt(funding.purpose.businessTravel) || 0;

              total_amount += salary;
              total_amount += equipment;
              total_amount += businessTravel;

              let research = {
                researcher: funding.researcher.user.account.name,
                research_id: funding.research.id,
                research_expenses: [
                  // [1, this.toAssetUnits(salary)],
                  // [2, this.toAssetUnits(equipment)],
                  // [3, this.toAssetUnits(businessTravel)]
                  [1, salary ],
                  [2, equipment ],
                  [3, businessTravel ]
                ],
                organisation_id: funding.researcher.user.account.organisation_id,
                university_overhead: (parseInt(funding.overhead) || 0) * this.DEIP_1_PERCENT,
                milestones: funding.milestones
                  .map((milestone) => {
                    return {
                      description: milestone.description,
                      deadline: milestone.deadlineDate.toISOString().split('.')[0],
                      amount: (parseInt(milestone.amount) || 0) * this.DEIP_1_PERCENT
                    }
                  })
              }

              researches.push(research);
            }

            if (this.mustBeEqualToStandard) {
              let stringifiedResearches = JSON.stringify(researches);
              if (stringifiedResearches !== this.standard) {
                alert("Input is different from standard !");
                console.log(`${stringifiedResearches} is not equal to ${this.standard}`);
                this.isSaving = false;
                return;
              }
            }
            // alert("Sent!")
            // this.isSaving = false;

            var contractId;
            deipRpc.broadcast.createFundingAsync(
              this.user.privKey,
              this.program.id,
              this.user.username,
              researches,
              total_amount,
              "NGT"
            )
              .then(() => deipRpc.api.getFundingsAsync())
              .then((contracts) => {
                contractId = contracts.length ? contracts[contracts.length -1].id : 0;
                // return deipRpc.broadcast.approveFundingAsync(this.user.privKey, contractId,this.user.username);
              })
              .then(() => {
                this.$store.dispatch('layout/setSuccess', {
                  message: "Funding proposal has been created succesfully!"
                });
                this.$router.push({
                  name: 'FundingOpportunityAwardDetails', 
                  params: { 
                    agency: decodeURIComponent(this.agencyProfile._id), 
                    foaId: decodeURIComponent(this.program.funding_opportunity_number),
                    contractId: decodeURIComponent(contractId)
                  }
                });
              })
              .catch((err) => {
                console.log(err);
                this.$store.dispatch('layout/setError', {
                  message: "An error occurred while contributing to fundraise, please try again later"
                });
              })
              .finally(() => {
                this.isSaving = false;
              })
          }
        },

        mounted() {},
        created() {
          this.addReceiver();
        },
    }
</script>

<style lang="less" scoped>

  .sub-area-list-item {
    cursor: pointer;
  }

  .sub-area-list-item:hover {
    background: #f1f8fe;
  }

  .sub-area-list-item.active {
    background: #f1f8fe;
  }

  .sub-area-list-item-content {
    padding-left: 20%;
    padding-top: 2%;
    padding-bottom: 2%;
    padding-right: 5%;
    min-height: 45px;
  }

  .sort-option {
    cursor: pointer;
  }

  .sort-icon {
    min-width: 24px; 
    min-height: 24px;
  }

  .total-row {
    text-align: right; 
    background-color: var(--v-secondary-lighten2); 
    padding: 5px;
    padding-right: 10px
  }

</style>
