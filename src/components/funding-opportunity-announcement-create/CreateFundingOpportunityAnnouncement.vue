<template>
  <v-container fluid fill-height class="pa-0">
    <v-layout>
      <v-stepper v-model="currentStep" v-if="!isFinished && organization" alt-labels
                 class="display-flex flex-column stepper-page full-width full-height"
      >
        <v-stepper-header>
          <v-stepper-step step="1" :complete="currentStep > 1">
            <div class="uppercase">Title</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="2" :complete="currentStep > 2">
            <div class="uppercase">Discipline</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3" :complete="currentStep > 3">
            <div class="uppercase white-space-nowrap">Due dates</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="4" :complete="currentStep > 4">
            <div class="uppercase">Funding amount</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="5" :complete="currentStep > 5">
            <div class="uppercase">Eligibility</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="6" :complete="currentStep > 6">
            <div class="uppercase white-space-nowrap">Program officers</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="7" :complete="currentStep > 7">
            <div class="uppercase white-space-nowrap">Reviewers</div>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="8" :complete="currentStep > 8">
            <div class="uppercase white-space-nowrap">Additional</div>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items class="flex-grow-1">
          <v-stepper-content step="1">
            <div class="full-height">
              <funding-opportunity-title
                @incStep="incStep"
                :foa="foa"
                :organization="organization"
              ></funding-opportunity-title>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="full-height">
              <funding-opportunity-discipline
                @incStep="incStep" @decStep="decStep"
                :foa="foa"
              ></funding-opportunity-discipline>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div class="full-height">
              <funding-opportunity-period
                @incStep="incStep" @decStep="decStep"
                :foa="foa"
              ></funding-opportunity-period>
            </div>
          </v-stepper-content>

          <v-stepper-content step="4">
            <div class="full-height">
              <funding-opportunity-awards
                @incStep="incStep" @decStep="decStep"
                :foa="foa"
              ></funding-opportunity-awards>
            </div>
          </v-stepper-content>

          <v-stepper-content step="5">
            <div class="full-height">
              <funding-opportunity-guidelines
                @incStep="incStep" @decStep="decStep"
                :foa="foa"
              ></funding-opportunity-guidelines>
            </div>
          </v-stepper-content>

          <v-stepper-content step="6">
            <div class="full-height">
              <funding-opportunity-program-officers
                @incStep="incStep" @decStep="decStep"
                :foa="foa"
                :members="organization.members"
              ></funding-opportunity-program-officers>
            </div>
          </v-stepper-content>

          <v-stepper-content step="7">
            <div class="full-height">
              <funding-opportunity-review-committee
                @incStep="incStep" @decStep="decStep"
                :foa="foa"
              ></funding-opportunity-review-committee>
            </div>
          </v-stepper-content>

          <v-stepper-content step="8">
            <div class="full-height">
              <funding-opportunity-additional
                @finish="finish" @decStep="decStep"
                :is-sending="isSending"
                :foa="foa"
              ></funding-opportunity-additional>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <div class="display-flex full-width full-height" v-if="isFinished">
        <div class="ma-auto text-align-center">
          <div class="display-1">New Funding Opportunity has been created <br /> successfully</div>

          <div class="subheading mt-4">
            <!-- <span class="bold">#</span> -->
            <span class="a">{{foa.number}}</span>
          </div>

          <div class="a subheading mt-2">
            {{foa.title}}
          </div>

          <div class="mt-5">
            <v-btn color="primary" class="ma-0" :to="{name: 'Default'}">OK</v-btn>
          </div>
        </div>
      </div>
    </v-layout>
  </v-container>
</template>


<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import { TenantService } from '@deip/tenant-service'
  import { GrantsService } from '@deip/grants-service'
   import { UsersService } from '@deip/users-service';

  const usersService = UsersService.getInstance();

  const tenantService = TenantService.getInstance();
  const grantsService = GrantsService.getInstance();

  export default {
    name: 'CreateFundingOpportunityAnnouncement',

    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
        currentStep: 0,

        organization: null,
        foa: {
          title: '',
          number: '',
          disciplines: [],
          totalProgramFunding: '',
          awardCeiling: '',
          awardFloor: '',
          numberOfAwards: '',
          eligibleApplicants: '',
          eligibilityAdditionalInformation: '',
          officers: [],
          description: '',
          additionalInfoLink: '',
          grantorEmail: '',
          startDate: null,
          endDate: null,
          reveiwCommittee: null
        },

        isFinished: false,
        isSending: false
      }
    },

    methods: {
      incStep() {
        if (this.currentStep < 8) {
          this.currentStep++;
        } else {
          this.currentStep = 1;
        }
      },

      decStep() {
        this.currentStep--;
      },

      finish() {
        console.log('finished', this.foa);
        this.isSending = true;

        const details = [
          [
            "funding_opportunity_announcement_contract_v1_0_0",
            {
              "version": "1.0.0",
              "organization_id": this.organization.id,
              "review_committee_id": this.foa.reveiwCommittee.id,
              "funding_opportunity_number": this.foa.number,
              "award_ceiling": this.toAssetUnits(this.foa.awardCeiling),
              "award_floor": this.toAssetUnits(this.foa.awardFloor),
              "expected_number_of_awards": this.foa.numberOfAwards,
              "open_date": this.foa.startDate,
              "close_date": this.foa.endDate,
              "additional_info": [
                ["funding_opportunity_title", this.foa.title],
                ["eligible_applicants", this.foa.eligibleApplicants],
                ['additional_info_of_eligibility', this.foa.eligibilityAdditionalInformation]
                ["description", this.foa.description], 
                ["link_to_additional_info", this.foa.additionalInfoLink],
                ["grantor_email", this.foa.grantorEmail]
              ],
              "officers": this.foa.officers
            }
          ]
        ];

        grantsService.createGrantContract(
          this.user.privKey,
          {
            grantor: this.user.username,
            amount: this.toAssetUnits(this.foa.totalProgramFunding),
            type: 2, // FOA
            target_disciplines: this.foa.disciplines.map(({id}) => id),
            details: details
          }
        )
        .then(() => {
          this.isFinished = true;
          this.$store.dispatch('layout/setSuccess', {
            message: `Funding Opportunity has been created successfully!`
          });
        })
          .catch(err => {
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating Funding Opportunity, please try again later'
            });
            console.log(err)
          })
          .finally(() => {
            this.isSending = false;
          });
      },
    },

    created() {
    // use research group with "national-science-foundation" permlink instead this call
    // tenantService.getTenantProfile(window.env.TENANT)
    //   .then((organization) => {
    //     this.organization = organization;
    //   })

    const link = 'national-science-foundation'
    deipRpc.api.getResearchGroupByPermlinkAsync(link)
      .then(organization => {
        const members = [];

        deipRpc.api.getResearchGroupTokensByResearchGroupAsync(organization.id)
          .then(rgtList => {
            return usersService.getEnrichedProfiles(rgtList.map(({owner}) => owner));
          })
          .then((members) => {
            this.organization = {
              ...organization,
              members
            };
            this.foa.officers.push(this.organization.members.find(({account: {name}}) => name == this.user.account.name).account.name)
          })
      })
    }
  };
</script>

<style lang="less">
</style>
