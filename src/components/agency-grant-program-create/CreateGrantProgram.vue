<template>
  <v-container class="fill-height pa-0 full-height" fluid>
    <v-stepper
      v-if="!isFinished && organization"
      v-model="currentStep"
      alt-labels
      class="display-flex flex-column full-width fill-height full-height elevation-0"
    >
      <v-stepper-header class="flex-grow-0">
        <v-stepper-step step="1" :complete="currentStep > 1">
          <div class="text-uppercase white-space-nowrap">
            Title
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="currentStep > 2">
          <div class="text-uppercase white-space-nowrap">
            Domain
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="currentStep > 3">
          <div class="text-uppercase white-space-nowrap">
            Due dates
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="4" :complete="currentStep > 4">
          <div class="text-uppercase white-space-nowrap">
            Funding amount
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="5" :complete="currentStep > 5">
          <div class="text-uppercase white-space-nowrap">
            Eligibility
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="6" :complete="currentStep > 6">
          <div class="text-uppercase white-space-nowrap">
            Program officers
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="7" :complete="currentStep > 7">
          <div class="text-uppercase white-space-nowrap">
            Reviewers
          </div>
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="8" :complete="currentStep > 8">
          <div class="text-uppercase white-space-nowrap">
            Additional
          </div>
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card>
            <funding-opportunity-title
              :foa="foa"
              :organization="organization"
              @incStep="incStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card>
            <funding-opportunity-domain
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card>
            <funding-opportunity-period
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="4">
          <v-card>
            <funding-opportunity-awards
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="5">
          <v-card>
            <funding-opportunity-guidelines
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="6">
          <v-card>
            <funding-opportunity-program-officers
              :foa="foa"
              :members="organization.members"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="7">
          <v-card>
            <funding-opportunity-review-committee
              :foa="foa"
              @incStep="incStep"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="8">
          <v-card>
            <funding-opportunity-additional
              :is-sending="isSending"
              :foa="foa"
              @finish="finish"
              @decStep="decStep"
            />
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>

    <v-row
      v-if="isFinished"
      justify="center"
      align="center"
      class="fill-height"
    >
      <v-col class="fill-height text-center py-5">
        <div class="text-h4">
          New Funding Opportunity has been created <br> successfully
        </div>

        <div class="text-subtitle-1 mt-6">
          <!-- <span class="bold">#</span> -->
          <span class="a">{{ foa.number }}</span>
        </div>

        <div class="a text-subtitle-1 mt-2">
          {{ foa.title }}
        </div>

        <div class="py-4">
          <v-btn color="primary" class="ma-0" :to="{name: 'Default'}">
            OK
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { PortalService } from '@deip/portal-service';
  import { GrantsService } from '@deip/grants-service';
  import { UserService } from '@deip/user-service';
  import { TeamService } from '@deip/team-service';

  const GRANT_TOKEN_SYMBOL = 'NGT';
  const GRANT_TOKEN_PRECISION = 2;

  const teamService = TeamService.getInstance();
  const userService = UserService.getInstance();
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
          grantNumber: "",
          title: '',
          number: '',
          domains: [],
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
      const grantingAgencyOrg = '58e3bfd753fcb860a66b82635e43524b285ab708';
      const treasuryOrg = '1169d704f8a908016033efe8cce6df93f618a265';

      teamService.getTeam(grantingAgencyOrg)
        .then(({ data: organization }) => {
          const members = [];

           userService.getUsersByTeam(organization._id)
            .then(({ data: { items: members } }) => {
              this.organization = {
                ...organization,
                members
              };
              this.foa.officers.push(this.organization.members.find(({ account: { name } }) => name == this.user.account.name).account.name);
            });
        });

      teamService.getTeam(treasuryOrg)
        .then(({ data: organization }) => {
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
        this.isSending = true;

        const distributionModel = [
          'funding_opportunity_announcement_contract',
          {
            organization_id: this.organization._id,
            review_committee_id: this.foa.reveiwCommittee._id,
            treasury_id: this.treasury._id,
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
              ['grantor_email', this.foa.grantorEmail],
              [this.$env.GRANT_DISTRIBUTION_TRANSPARENCY_DEMO_GRANT_ATTR_ID, this.foa.grantNumber]
            ]
          }
        ];

        grantsService.createGrantContract(
          this.user.privKey,
          {
            foaNumber: this.foa.number.toLowerCase(),
            grantor: this.user.username,
            amount: this.toAssetUnits(this.foa.totalProgramFunding, GRANT_TOKEN_PRECISION, GRANT_TOKEN_SYMBOL),
            targetDomains: this.foa.domains.map(({ _id }) => _id),
            distributionModel,
            extensions: []
          }
        )
          .then(() => {
            this.isFinished = true;
            this.$notifier.showSuccess('Funding Opportunity has been created successfully!');
          })
          .catch((err) => {
            this.$notifier.showError('An error occurred while creating Funding Opportunity, please try again later');
            console.error(err);
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
