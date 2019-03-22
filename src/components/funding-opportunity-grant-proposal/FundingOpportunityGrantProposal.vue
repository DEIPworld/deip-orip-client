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
              <div class="headline c-pb-5 c-pt-10">Grant Receivers</div>

              <div class="row c-pt-3">
                <span class="col-8">
                  <div class="subheading bold">Researcher Name</div>
                  <v-text-field label="Full Name"></v-text-field>
                </span>
                <span class="col-1"></span>
                <span class="col-3">
                    <div class="subheading bold">Organization</div>
                    <v-select
                      :items="[]"
                      v-model="funding.organization"
                      label="Title"
                    ></v-select>
                </span>
              </div>

              <div class="row c-pt-3">
                <span class="col-12">
                  <div class="subheading bold">Research Group</div>
                    <v-select :items="[]"
                      v-model="funding.researchGroupId"
                      label="Group name"
                    ></v-select>
                </span>
              </div>

              <div class="row c-pt-3">
                <span class="col-12">
                  <div class="subheading bold">Research</div>
                    <v-select :items="[]"
                      v-model="funding.researchId"
                      label="Title"
                    ></v-select>
                </span>
              </div>
              
              <div class="row c-pt-5">
                <span class="col-8">
                  <div class="subheading bold">Purpose</div>
                  <div @click="salaryClick($event)" class="input-group input-group--text-field primary--text">
                    <div class="input-group__input"><label>Salary</label></div>
                    <div class="input-group__details"></div>
                  </div>
                </span>
                <span class="col-1"></span>
                <span class="col-3">
                    <div class="subheading bold">&nbsp;</div>
                    <v-text-field v-model="funding.purpose.salary" class="right-input" ref="salaryInput" mask="##############" suffix="$"></v-text-field>
                </span>
              </div>

              <div class="row">
                <span class="col-8">
                  <div @click="equipmentClick($event)" class="input-group input-group--text-field primary--text">
                    <div class="input-group__input"><label>Equipment</label></div>
                    <div class="input-group__details"></div>
                  </div>
                </span>
                <span class="col-1"></span>
                <span class="col-3">
                    <v-text-field v-model="funding.purpose.equipment" class="right-input" ref="equipmentInput" mask="##############" suffix="$"></v-text-field>
                </span>
              </div>

              <div class="row">
                <span class="col-8">
                  <div @click="businessTravelClick($event)" class="input-group input-group--text-field primary--text">
                    <div class="input-group__input"><label>Business travel</label></div>
                    <div class="input-group__details"></div>
                  </div>
                </span>
                <span class="col-1"></span>
                <span class="col-3">
                    <v-text-field v-model="funding.purpose.businessTravel" class="right-input" ref="businessTravelInput" mask="##############" suffix="$"></v-text-field>
                </span>
              </div>

              <div class="row">
                <span class="col-8">
                  <div class="subheading bold">University overhead</div>
                  <v-text-field v-model="funding.overhead" suffix="%"></v-text-field>
                </span>
                <span class="col-1"></span>
                <span class="col-3">
                    <div class="subheading bold">&nbsp;</div>
                    <div style="text-align: right; background-color: #ebf5fe; padding: 5px">
                      <div class="subheading bold">Total amount</div>
                      <div class="headline">$ 90000</div>
                    </div>
                </span>
              </div>

              <div>
                <div class="row c-pt-5 c-pb-5">
                  <span class="col-12">
                    <div class="subheading bold">Milestones</div>
                  </span>
                </div>
                <div v-for="(milestone, i) in funding.milestones">
                  <div class="row">
                    <span class="col-5">
                      <div class="subheading bold">Description</div>
                      <v-text-field v-model="milestone.description" :prefix="i + 1 + '.'"></v-text-field>
                    </span>
                    <span class="col-1"></span>
                    <span class="col-2">
                      <div class="subheading bold">Deadline</div>
                        <datetime-picker
                            :datetime="milestone.deadline"
                            :available-from-now="true"
                            :dateOnly="true"
                        ></datetime-picker>
                    </span>
                    <span class="col-1"></span>
                    <span class="col-3">
                      <div class="subheading bold">Amount</div>
                      <div class="right-input">
                        <v-text-field v-model="milestone.amount" suffix="%"></v-text-field>
                      </div>
                    </span>
                  </div>
                </div>
                <div class="row">
                    <span class="col-10"></span>
                    <span class="col-2">
                      <v-btn class="ma-0" block color="primary">
                        <v-icon>add</v-icon>
                        Milestone
                      </v-btn>
                    </span>
                </div>
              </div>

              <div class="row c-pt-5 c-pb-5">
                <span class="col-2">
                  <v-btn class="ma-0" block color="primary">
                    <v-icon>add</v-icon>
                    Receiver
                  </v-btn>
                </span>
                <span class="col-1"></span>
                <span class="col-2">
                  <v-btn class="ma-0" block color="primary">Save</v-btn>
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
    import _ from 'lodash';

    export default {
        name: "FundingOpportunityGrantProposal",
        
        data() {
            return {
              funding: {
                organization: null,
                researchGroupId: null,
                researchId: null,
                overhead: null,
                purpose: {
                  businessTravel: null,
                  equipment: null,
                  salary: null
                },
                milestones: [{
                  deadline: new Date().toISOString().substr(0, 10),
                  description: null,
                  amount: null
                }],
              }
            }
        },

        computed: {
            ...mapGetters({
                agencyProfile: 'agencyProgramGrantProposal/agency',
                program: 'agencyProgramGrantProposal/program',
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
            }
        },

        methods: {

          salaryClick($event) {
            $event.stopPropagation();
            $event.preventDefault();
            this.$refs.salaryInput.focus();
          },

          equipmentClick($event) {
            $event.stopPropagation();
            $event.preventDefault();
            this.$refs.equipmentInput.focus();
          },

          businessTravelClick($event) {
            $event.stopPropagation();
            $event.preventDefault();
            this.$refs.businessTravelInput.focus();
          }

        },

        mounted() {
        }
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

</style>
