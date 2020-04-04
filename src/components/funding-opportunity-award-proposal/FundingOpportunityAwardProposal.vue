<template>
  <v-container fluid class="ma-0 pa-0">
    <v-layout row wrap>
     <v-flex xs12>
        <v-card>
          <v-card-text class="px-0 pa-0">
            <v-breadcrumbs divider="/" :items="breadcrumbs"></v-breadcrumbs>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs9>
        <v-divider></v-divider>
        <v-card class="pa-4 full-height">
          <v-layout row wrap>
            <v-flex xs12>
              <div class="display-1 py-4">{{program.additional_info.funding_opportunity_title}} ({{program.funding_opportunity_number}})</div>
              <v-divider></v-divider>
            </v-flex>
            
            <v-flex xs12>
              <div class="headline pt-4">Award Receivers 
              </div>
              <div v-for="(funding, fundingIdx) in fundings" :key="`${fundingIdx}-funding`">
                <v-layout v-if="fundingIdx != 0" row>
                  <v-flex xs2> 
                      <v-btn v-if="fundingIdx != 0" @click="removeReceiver(fundingIdx)" class="ma-0" block outline color="primary">
                        <v-icon>remove</v-icon>
                        <!-- Receiver #{{fundingIdx + 1}} -->
                        Subawardee #{{fundingIdx + 1}}
                      </v-btn>
                  </v-flex>
                  <v-flex xs10 title></v-flex>
                </v-layout>

                <v-layout row pt-5>
                  <v-flex xs8>
                    <div class="subheading font-weight-bold">Award number</div>
                    <v-text-field v-model="funding.awardNumber" placeholder="Award number" :rules="[rules.required, rules.awardNumber]"  validate-on-blur></v-text-field>
                  </v-flex>
                </v-layout>

                <v-layout row>
                  <v-flex xs8>
                    <div class="subheading font-weight-bold">Researcher Name</div>
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
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                    <div class="subheading font-weight-bold">Organization</div>
                    <div class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div ><label>{{funding.researcher ? getOrganizationTitle() : "Organization"}}</label></div>
                      </div>
                    </div>
                  </v-flex>
                </v-layout>

                <v-layout row pt-2>
                  <v-flex xs12>
                    <div class="subheading font-weight-bold">Research Group</div>
                      <v-select 
                        :items="funding.foundResearchGroups"
                        item-text="name"
                        return-object
                        :loading="funding.isResearchGroupsLoading"
                        v-model="funding.researchGroup"
                        label="Group name"
                        @input="setResearchList(funding)"
                      ></v-select>
                  </v-flex>
                </v-layout>

                <v-layout row pt-2>
                  <v-flex xs12>
                    <div class="subheading font-weight-bold">Research</div>
                      <v-select 
                        :items="funding.foundResearch"
                        item-text="title"
                        return-object
                        :loading="funding.isResearchLoading"
                        v-model="funding.research"
                        label="Title"
                      ></v-select>
                  </v-flex>
                </v-layout>
                
                <v-layout row pt-3>
                  <v-flex xs8>
                    <div class="subheading font-weight-bold">Purpose</div>
                    <div @click="focusInputByRef($event, 'funding-awardAmount-' + fundingIdx)" class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot"><label>Award amount</label></div>
                        <div class="v-text-field__details"></div> 
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3 pt-3>
                      <div class="subheading font-weight-bold">&nbsp;</div>
                      <v-text-field v-model.number="funding.purpose.awardAmount" :rules="[ rules.required, rules.totalAwardValidator ]" class="right-input" :ref="'funding-awardAmount-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                  </v-flex>
                </v-layout>

                <!-- <v-layout row>
                  <v-flex xs8>
                    <div @click="focusInputByRef($event, 'funding-equipment-' + fundingIdx)" class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot"><label>Equipment</label></div>
                        <div class="v-text-field__details"></div>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs1 ></v-flex>
                  <v-flex xs3 pt-3>
                      <v-text-field v-model.number="funding.purpose.equipment" class="right-input" :ref="'funding-equipment-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                  </v-flex>
                </v-layout> -->

                <!-- <v-layout row>
                  <v-flex xs8>
                    <div @click="focusInputByRef($event, 'funding-businessTravel-' + fundingIdx)" class="v-input v-text-field theme--light">
                      <div class="v-input__control">
                        <div class="v-input__slot"><label>Business travel</label></div>
                        <div class="v-text-field__details"></div>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3 pt-3>
                      <v-text-field v-model.number="funding.purpose.businessTravel" class="right-input" :ref="'funding-businessTravel-' + fundingIdx" mask="##############" suffix="$"></v-text-field>
                  </v-flex>
                </v-layout> -->

                <v-layout row>
                  <v-flex xs8>
                    <div v-if="fundingIdx == 0">
                      <div class="subheading font-weight-bold">University overhead cap</div>
                      <v-text-field v-model="funding.overhead" suffix="%" mask="###"></v-text-field>
                    </div>
                  </v-flex>
                  <v-flex xs1></v-flex>
                  <v-flex xs3>
                      <div class="subheading font-weight-bold">&nbsp;</div>
                      <div class="total-row">
                        <div class="subheading font-weight-bold">Total amount</div>
                        <div class="headline">$ {{calculateTotalExpenses(funding)}}</div>
                      </div>
                  </v-flex>
                </v-layout>

                <!-- <div>
                  <v-layout row py-3>
                    <v-flex xs12>
                      <div class="subheading font-weight-bold">Milestones</div>
                    </v-flex>
                  </v-layout>
                  <div v-for="(milestone, milestoneIdx) in funding.milestones" :key="`${milestoneIdx}-milestone`">
                    <div>
                      <v-layout row>
                        <v-flex xs5>
                          <div class="subheading font-weight-bold">Description</div>
                          <v-text-field v-model="milestone.description" :prefix="milestoneIdx + 1 + '.'"></v-text-field>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs2>
                          <div class="subheading font-weight-bold">Deadline</div>
                            <datetime-picker
                                :datetime="milestone.deadline"
                                :available-from-now="true"
                                :dateOnly="true"
                                @input="(val) => {
                                  milestone.deadline = val; 
                                  milestone.deadlineDate = new Date(val); 
                                }"
                            ></datetime-picker>
                        </v-flex>
                        <v-flex xs1></v-flex>
                        <v-flex xs3>
                          <div class="subheading font-weight-bold">Amount</div>
                          <div class="right-input">
                            <v-text-field v-model="milestone.amount" suffix="%" mask="###"></v-text-field>
                          </div>
                        </v-flex>
                      </v-layout>
                    </div>
                    <v-layout v-if="(funding.milestones.length - 1) == milestoneIdx" row pb-2>
                      <v-flex xs10></v-flex>
                      <v-flex xs2>
                        <v-btn class="ma-0" block color="primary" @click="addMilestone(funding)">
                          <v-icon>add</v-icon>
                          Milestone
                        </v-btn>
                      </v-flex>
                    </v-layout>
                    <v-layout v-if="funding.milestones.length > 1 && (funding.milestones.length - 1) != milestoneIdx" row pb-3>
                      <v-flex xs10></v-flex>
                      <v-flex xs2>
                        <v-btn class="ma-0" outline block color="primary" @click="removeMilestone(funding, milestoneIdx)">
                          <v-icon>remove</v-icon>
                          Milestone #{{milestoneIdx + 2}}
                        </v-btn>
                      </v-flex>
                    </v-layout>
                  </div>
                </div> -->
                <v-divider class="mt-5"></v-divider>
                <v-divider class="mb-5"></v-divider>
              </div>
              
              <v-layout row py-3>
                <v-flex xs2>
                  <v-btn class="ma-0" block color="primary" @click="addReceiver()">
                    <v-icon>add</v-icon>
                    <!-- Receiver -->
                    Add Subawardee
                  </v-btn>
                </v-flex>
                <v-flex xs8></v-flex>
                <v-flex xs2>
                  <v-btn class="ma-0" block color="primary" 
                    @click="save()" :disabled="saveIsDisabled || isSaving" :loading="isSaving">Save</v-btn>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex xs12>
            </v-flex>

          </v-layout>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-divider></v-divider>
        <v-layout row wrap class="full-height">
          <v-flex xs12>
            <v-card class="full-height">

              <div class="py-3 text-align-center">
                <v-avatar size="120px">
                  <img :src="$options.filters.researchGroupLogoSrc(organizationProfile.id, 120, 120, true)">
                </v-avatar>
              </div>
              <v-divider></v-divider>

              <div class="py-3 pl-3">
                <div class="sm-title pb-2 font-weight-bold">Program Officers</div>
                <div v-for="(officer, i) in program.officers" :key="`${i}-funding-officer`">
                  <div class="pt-2">
                    <v-avatar size="40px">
                        <img v-if="officer.profile" v-bind:src="officer.profile | avatarSrc(40, 40, false)" />
                        <v-gravatar v-else :email="officer.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link class="a body-1 pl-2 pt-2" :to="{ name: 'UserDetails', params: { account_name: officer.account.name } }">
                      {{ officer | fullname }}
                    </router-link>
                  </div>
                </div>
              </div>
              <v-divider></v-divider>

              <div class="py-3 pl-3">
                <v-icon color="primary">email</v-icon>
                <span class="pl-1 font-weight-bold">{{program.additional_info.grantor_email || organizationProfile.email}}</span>
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
    import deipRpc from '@deip/rpc-client';
    import _ from 'lodash';
    import { ResearchGroupService } from '@deip/research-group-service/lib/ResearchGroupService';
    import { GrantsService } from '@deip/grants-service/lib/GrantsService';

    const researchGroupService = ResearchGroupService.getInstance();
    const grantsService = GrantsService.getInstance();


    export default {
        name: "FundingOpportunityAwardProposal",
        
        data() {
            return {
              fundings: [],
              isSaving: false,
              MIN_FOA_NUMBER_LENGTH: 3,
              MAX_FOA_NUMBER_LENGTH: 15,
              rules: {
                required: v => !!v || 'This field is required',

                awardNumber: (v) => {
                  if (v.length < this.MIN_FOA_NUMBER_LENGTH){
                    return `Award number length should be greater/equal than ${this.MIN_FOA_NUMBER_LENGTH}`
                  } else if (v.length > this.MAX_FOA_NUMBER_LENGTH){
                    return `Award number length should be less/equal than ${this.MAX_FOA_NUMBER_LENGTH}`
                  }
                  return true
                },

                totalAwardValidator: () => {
                    if (!this.awardIsValid){
                        return "Sum of others awardee award can't be greater/equal than first award amount"
                      }
                    return true;
                },
              }
            }
        },

        computed: {
            ...mapGetters({
                organizationProfile: 'foaAwardProposal/organization',
                program: 'foaAwardProposal/program',
                allUsers: 'foaAwardProposal/allUsers',
                user: 'auth/user',
                isGrantor: 'auth/isGrantor',
                isOfficer: 'auth/isOfficer',
                isApplicant: 'auth/isApplicant'
            }),

            breadcrumbs() {
              return [
                { text: this.organizationProfile.name, disabled: false, href: `/#/${this.organizationProfile.permlink}/group-details` },
                { text: "Programs", disabled: false, href: `/#/${this.organizationProfile.permlink}/programs` },
                // { text: this.program.area.abbreviation, disabled: true },
                // { text: this.program.subArea.abbreviation, disabled: true },
                { text: this.program.additional_info.funding_opportunity_title, disabled: false, href: `/#/${this.organizationProfile.permlink}/programs/${this.program.funding_opportunity_number}`},
                { text: 'Award Receivers', disabled: true }
              ];
            },

            awardIsValid(){
              let totalAward = this.fundings[0].purpose.awardAmount;
              let awardeesAwardSum = 0;

              this.fundings.forEach(({purpose:{awardAmount}}, i) => {
                if(i != 0) awardeesAwardSum+=awardAmount
              })

              return awardeesAwardSum >= totalAward ? false : true;
            },

            saveIsDisabled() {
              let totalAward = this.fundings[0].purpose.awardAmount
              return this.fundings.some((f, i) => {
                let isInvalid = !f.researcher || !f.research || (i == 0 ? f.overhead == null : false) || 
                  f.purpose.awardAmount == null || !this.awardIsValid || !f.awardNumber ||
                  f.awardNumber.length < this.MIN_FOA_NUMBER_LENGTH || f.awardNumber.length > this.MAX_FOA_NUMBER_LENGTH
                  // || f.purpose.equipment == null || f.purpose.businessTravel == null 
                  // || 
                  // f.milestones.some(m => {
                  //   return !m.description || m.amount == null || !m.deadlineDate;
                  // });
                return isInvalid;
              });
            }
        },

        methods: {
          getOrganizationTitle(){
            return this.organizationProfile.name
          },
          focusInputByRef($event, ref) {
            $event.stopPropagation();
            $event.preventDefault();
            let input = this.$refs[ref][0];
            input.focus();
          },

          calculateTotalExpenses(funding) {
            let awardAmount = funding.purpose.awardAmount;
            // let equipment = funding.purpose.equipment;
            // let businessTravel = funding.purpose.businessTravel;
            return (awardAmount || 0) 
            // + (equipment || 0) + (businessTravel || 0);
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

              awardNumber: "",
              researcherSearch: "",
              researcher: null,
              foundResearchers: [],
              foundResearch: [],
              foundResearchGroups: [],

              researchGroup: null,
              research: null,
              overhead: null,
              purpose: {
                // businessTravel: null,
                // equipment: null,
                awardAmount: null
              },
              // milestones: [],
            };
            // this.addMilestone(funding);
            this.fundings.push(funding);
          },

          removeReceiver(idx) {
            const a = this.fundings.splice(idx, 1);
          },

          // addMilestone(funding) {
          //   funding.milestones.push({
          //     description: null,
          //     deadline: undefined,
          //     amount: null
          //   });
          // },

          // removeMilestone(funding, idx) {
          //   funding.milestones.splice(idx, 1);
          // },

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
            let subawardees = [];

            this.isSaving = true;

            for (let i = 1; i < this.fundings.length; i++) {
              let funding = this.fundings[i];
              const source = this.fundings[0].researcher.user.account.name;
              let awardAmount = funding.purpose.awardAmount || 0;
              // let equipment = funding.purpose.equipment || 0;
              // let businessTravel = funding.purpose.businessTravel || 0;

              total_amount += awardAmount;
              // total_amount += equipment;
              // total_amount += businessTravel;

              let awardInfo = {
                subaward_number: funding.awardNumber,
                subaward: this.toAssetUnits(funding.purpose.awardAmount),
                subawardee: funding.researcher.user.account.name,
                source,
                research_id: funding.research.id,

                // milestones: funding.milestones
                //   .map((milestone) => {
                //     return {
                //       description: milestone.description,
                //       deadline: milestone.deadlineDate.toISOString().split('.')[0],
                //       amount: (parseInt(milestone.amount) || 0) * this.DEIP_1_PERCENT
                //     }
                //   })
              }

              subawardees.push(awardInfo);
            }

              return grantsService.createFundingOpportunityAward(
                this.user.privKey, {
                  fundingOpportunityId: this.program.funding_opportunity_number,
                  awardNumber: this.fundings[0].awardNumber,
                  award: this.toAssetUnits(this.fundings[0].purpose.awardAmount),
                  awardee: this.fundings[0].researcher.user.account.name,
                  researchId: this.fundings[0].research.id,
                  universityId: 21,
                  universityOverhead: (parseInt(this.fundings[0].overhead) || 0) * this.DEIP_1_PERCENT,
                  subawardees,
                  creator: this.user.username,
                  extensions: []
                })
                  .then(() => {
                    this.$store.dispatch('layout/setSuccess', {
                      message: "Funding proposal has been created succesfully!"
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
