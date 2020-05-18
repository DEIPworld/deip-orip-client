<template>
  <v-container fluid class="pa-0 fill-height">
    <v-stepper
      v-if="!isFinished && organization"
      v-model="currentStep"
      alt-labels
      class="display-flex flex-column stepper-page full-width full-height"
    >
      <v-stepper-header>
        <v-stepper-step step="1" :complete="currentStep > 1">
          <div class="uppercase">
            Title
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="currentStep > 2">
          <div class="uppercase">
            Discipline
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="currentStep > 3">
          <div class="uppercase white-space-nowrap">
            Due dates
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="4" :complete="currentStep > 4">
          <div class="uppercase text-center">
            Funding amount
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="5" :complete="currentStep > 5">
          <div class="uppercase">
            Eligibility
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="6" :complete="currentStep > 6">
          <div class="uppercase white-space-nowrap">
            Program officers
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="7" :complete="currentStep > 7">
          <div class="uppercase white-space-nowrap">
            Reviewers
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="8" :complete="currentStep > 8">
          <div class="uppercase white-space-nowrap">
            Additional
          </div>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items class="flex-grow-1">
        <v-stepper-content step="1">
          <div class="full-height">
            <funding-opportunity-title
              :foa="foa"
              :organization="organization"
              @incStep="incStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="2">
          <div class="full-height">
            <funding-opportunity-discipline
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="3">
          <div class="full-height">
            <funding-opportunity-period
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="4">
          <div class="full-height">
            <funding-opportunity-awards
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="5">
          <div class="full-height">
            <funding-opportunity-guidelines
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="6">
          <div class="full-height">
            <funding-opportunity-program-officers
              :foa="foa"
              :members="organization.members"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="7">
          <div class="full-height">
            <funding-opportunity-review-committee
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>

        <v-stepper-content step="8">
          <div class="full-height">
            <funding-opportunity-additional
              :is-sending="isSending"
              :foa="foa"
              @finish="finish"
              @decStep="decStep"
            />
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <div v-if="isFinished" class="display-flex full-width full-height">
      <div class="ma-auto text-align-center">
        <div class="display-1">
          New Funding Opportunity has been created <br> successfully
        </div>

        <div class="subtitle-1 mt-6">
          <!-- <span class="bold">#</span> -->
          <span class="a">{{ foa.number }}</span>
        </div>

        <div class="a subtitle-1 mt-2">
          {{ foa.title }}
        </div>

        <div class="mt-12">
          <v-btn color="primary" class="ma-0" :to="{name: 'Default'}">
            OK
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>


<script>
  import { mapGetters } from 'vuex';
  import deipRpc from '@deip/rpc-client';
  import { TenantService } from '@deip/tenant-service';
  import { GrantsService } from '@deip/grants-service';
  import { UsersService } from '@deip/users-service';

  const GRANT_TOKEN_SYMBOL = 'NGT';
  const GRANT_TOKEN_PRECISION = 2;

  const usersService = UsersService.getInstance();
  const tenantService = TenantService.getInstance();
  const grantsService = GrantsService.getInstance();

  export default {
    name: 'CreateGrantProgram',

    computed: {
      ...mapGetters({
        user: 'auth/user'
      })
    },
    data() {
      return {
        currentStep: 1,

        organization: null,
        treasury: null,
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
      };
    },

    created() {
      const grantingAgencyOrg = 'nsf';
      const treasuryOrg = 'us-treasury';

      deipRpc.api.getResearchGroupByPermlinkAsync(grantingAgencyOrg)
        .then((organization) => {
          const members = [];

          deipRpc.api.getResearchGroupTokensByResearchGroupAsync(organization.id)
            .then((rgtList) => usersService.getEnrichedProfiles(rgtList.map(({ owner }) => owner)))
            .then((members) => {
              this.organization = {
                ...organization,
                members
              };
              this.foa.officers.push(this.organization.members.find(({ account: { name } }) => name == this.user.account.name).account.name);
            });
        });

      deipRpc.api.getResearchGroupByPermlinkAsync(treasuryOrg)
        .then((organization) => {
          this.treasury = organization;
        });
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

        const distributionModel = [
          'funding_opportunity_announcement_contract_v1_0_0',
          {
            version: '1.0.0',
            organization_id: this.organization.id,
            review_committee_id: this.foa.reveiwCommittee.id,
            treasury_id: this.treasury.id,
            funding_opportunity_number: this.foa.number,
            award_ceiling: this.toAssetUnits(this.foa.awardCeiling, GRANT_TOKEN_PRECISION, GRANT_TOKEN_SYMBOL),
            award_floor: this.toAssetUnits(this.foa.awardFloor, GRANT_TOKEN_PRECISION, GRANT_TOKEN_SYMBOL),
            expected_number_of_awards: this.foa.numberOfAwards,
            open_date: this.foa.startDate,
            close_date: this.foa.endDate,
            officers: this.foa.officers,
            additional_info: [
              ['funding_opportunity_title', this.foa.title],
              ['eligible_applicants', this.foa.eligibleApplicants],
              ['additional_info_of_eligibility', this.foa.eligibilityAdditionalInformation],
              ['description', this.foa.description],
              ['link_to_additional_info', this.foa.additionalInfoLink],
              ['grantor_email', this.foa.grantorEmail]
            ]
          }
        ];

        grantsService.createGrantContract(
          this.user.privKey,
          {
            grantor: this.user.username,
            amount: this.toAssetUnits(this.foa.totalProgramFunding, GRANT_TOKEN_PRECISION, GRANT_TOKEN_SYMBOL),
            targetDisciplines: this.foa.disciplines.map(({ id }) => id),
            distributionModel,
            extensions: []
          }
        )
          .then(() => {
            this.isFinished = true;
            this.$store.dispatch('layout/setSuccess', {
              message: 'Funding Opportunity has been created successfully!'
            });
          })
          .catch((err) => {
            this.$store.dispatch('layout/setError', {
              message: 'An error occurred while creating Funding Opportunity, please try again later'
            });
            console.log(err);
          })
          .finally(() => {
            this.isSending = false;
          });
      }
    }
  };
</script>

<style lang="less">
</style>
