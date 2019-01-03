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
              <div class="display-1 c-pb-10 c-pt-10">{{program.title}}</div>
              <v-divider></v-divider>
            </v-flex>
            
            <v-flex xs12>
              <div class="row c-pt-10">
                <span class="col-grow body-1">Agency Name</span>
                <span class="col-grow body-2">{{agencyProfile.name}}</span>

                <span class="col-grow body-1">Estimated total program funding:</span>
                <span class="col-grow body-2">$ {{program.estimatedTotalFunding}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Opportunity Number:</span>
                <span class="col-grow body-2">{{program.number}}</span>

                <span class="col-grow body-1">Expected number of awards:</span>
                <span class="col-grow body-2">{{program.expectedNumberOfAwards}}</span>
              </div>
              <div class="row c-pt-5">
                <span class="col-grow body-1">Area:</span>
                <span class="col-grow body-2">{{program.area.title}}</span>

                <span class="col-grow body-1">Award ceiling:</span>
                <span class="col-grow body-2">$ {{program.awardCeiling}}</span>
              </div> 
              <div class="row c-pt-5">
                <span class="col-grow body-1">Open date:</span>
                <span class="col-grow body-2">{{program.postedDate.toDateString()}}</span>

                <span class="col-grow body-1">Award floor:</span>
                <span class="col-grow body-2">$ {{program.awardFloor}}</span>
              </div>
              <div class="row c-pt-5 c-pb-10">
                <span class="col-grow body-1">Close date:</span>
                <span class="col-grow body-2">{{program.closingDate.toDateString()}}</span>

                <span class="col-grow body-1">Number of applications:</span>
                <span class="col-grow body-2">0</span>
              </div>
              <v-divider></v-divider>
            </v-flex>

            <v-flex xs12>
              <div class="sm-title bold c-pt-10">Program Guidlines</div>

              <div class="subheading bold c-pt-10">Eligible Aplicants</div>
              <div class="body-1 c-pt-5">{{program.eligibleApplicantsText}}</div>

              <div class="subheading bold c-pt-5">Additional Information on Eligibility</div>
              <div class="body-1 c-pt-5">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>

              <div class="subheading bold c-pt-5">Description</div>
              <div class="body-1 c-pt-5 c-pb-5">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</div>

              <v-divider></v-divider>

            </v-flex>

            <v-flex xs12>
              <div class="sm-title bold c-pt-10 c-pb-5">Applications: {{applications.length}}</div>
              <div>
                <application-list-item v-for="(application, index) in applications" 
                  :application="application" 
                  :isFirst="index == 0">
                </application-list-item>
              </div>
            </v-flex>

          </v-layout>
        </v-card>
      </v-flex>

      <v-flex xs3>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card style="height: 300%">

              <div class="c-pt-5 c-pb-5 text-align-center">
                <v-avatar size="120px">
                    <img :src="agencyProfile.logo | agencyLogoSrc(160, 160, false)" />
                </v-avatar>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <div class="sm-title c-pb-2 bold">Program Officers</div>
                <div v-for="officer in programOfficers">
                  <div class="row-nowrap text-align-center c-pt-2">
                    <v-avatar size="40px">
                        <img v-if="officer.profile" v-bind:src="officer.profile.avatar | avatarSrc(30, 30, false)" />
                        <v-gravatar v-else :email="officer.account.name + '@deip.world'" />
                    </v-avatar>
                    <span class="deip-blue-color body-1 c-pl-3 c-pt-2">{{ officer | fullname }}</span>
                  </div>
                </div>
              </div>
              <v-divider></v-divider>

              <div class="c-pt-5 c-pl-5 c-pb-5">
                <v-icon color="#2962FF">email</v-icon>
                <span class="c-pl-1 deip-blue-color bold">{{agencyProfile.email}}</span>
              </div>
              <v-divider></v-divider>

              <div class="c-pb-5 c-pl-5 c-pt-5">
                <div class="subheading bold">
                  Reviews: <span style="color: green">5</span> / <span style="color: red">2</span> 
                </div>
                <div class="c-pt-3">
                  <div class="caption"><v-icon small class="c-pr-2">rate_review</v-icon>Reward for review: <span class="bold">15 %</span></div>
                    <div class="caption">
                        <div><v-icon small class="c-mr-2">av_timer</v-icon>Reward period active till</div>
                        <div class="bold"><v-icon small class="c-mr-2">today</v-icon>{{program.closingDate.toDateString()}}</div> 
                    </div>
                  </div> 
                </div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
      
    </v-layout>
  </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: "AgencyProgramDetails",
        data() {
            return {
              programOfficers: [
                { account: { name: "alice" } },
                { account: { name: "bob" } }
              ],
              applications: [{
                researchGroup: 'Test RG', 
                authors: ['alice', 'nick', 'bob'], 
                expertise: [
                  { name: 'Quantum Optics', amount: 1500 }, 
                  { name: 'Quantum Electronics', amount: 200 }, 
                  { name: 'Quantum Coherence', amount: 6000 } ] 
              }, {
                researchGroup: 'Test RG 2', 
                authors: ['rachel', 'rick', 'nastya'], 
                expertise: [
                  { name: 'Physics', amount: 1500 }, 
                  { name: 'Biology', amount: 200 }, 
                  { name: 'Chemistry', amount: 6000 } ] 
              }]
            }
        },
        computed: {
            ...mapGetters({
                agencyProfile: 'agencyProgramDetails/agency',
                program: 'agencyProgramDetails/program'
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
