<template>
  <v-container fluid fill-height class="pa-0">
    <div><v-btn @click="example()">Example FOA</v-btn></div>
    <v-layout>
      <v-stepper v-model="currentStep" v-if="!isFinished && agency" alt-labels
                 class="legacy-column stepper-page full-width full-height"
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

        <v-stepper-items class="legacy-col-grow">
          <v-stepper-content step="1">
            <div class="full-height">
              <funding-opportunity-title
                @incStep="incStep"
                :opportunity="opportunity"
                :agency="agency"
              ></funding-opportunity-title>
            </div>
          </v-stepper-content>

          <v-stepper-content step="2">
            <div class="full-height">
              <funding-opportunity-discipline
                @incStep="incStep" @decStep="decStep"
                :opportunity="opportunity"
              ></funding-opportunity-discipline>
            </div>
          </v-stepper-content>

          <v-stepper-content step="3">
            <div class="full-height">
              <funding-opportunity-period
                @incStep="incStep" @decStep="decStep"
                :opportunity="opportunity"
              ></funding-opportunity-period>
            </div>
          </v-stepper-content>

          <v-stepper-content step="4">
            <div class="full-height">
              <funding-opportunity-awards
                @incStep="incStep" @decStep="decStep"
                :opportunity="opportunity"
              ></funding-opportunity-awards>
            </div>
          </v-stepper-content>

          <v-stepper-content step="5">
            <div class="full-height">
              <funding-opportunity-guidelines
                @incStep="incStep" @decStep="decStep"
                :opportunity="opportunity"
              ></funding-opportunity-guidelines>
            </div>
          </v-stepper-content>

          <v-stepper-content step="6">
            <div class="full-height">
              <funding-opportunity-program-officers
                @incStep="incStep" @decStep="decStep"
                :opportunity="opportunity"
              ></funding-opportunity-program-officers>
            </div>
          </v-stepper-content>

          <v-stepper-content step="7">
            <div class="full-height">
              <funding-opportunity-review-committee
                @incStep="incStep" @decStep="decStep"
                :opportunity="opportunity"
              ></funding-opportunity-review-committee>
            </div>
          </v-stepper-content>

          <v-stepper-content step="8">
            <div class="full-height">
              <funding-opportunity-additional
                @finish="finish" @decStep="decStep"
                :is-sending="isSending"
                :opportunity="opportunity"
              ></funding-opportunity-additional>
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>

      <div class="display-flex full-width full-height" v-if="isFinished">
        <div class="c-m-auto text-align-center">
          <div class="display-1">New Funding Opportunity has been created <br /> successfully</div>

          <div class="subheading c-mt-8">
            <span class="bold">#</span>
            <span class="a">{{opportunity.number}}</span>
          </div>

          <div class="a subheading c-mt-2">
            {{opportunity.title}}
          </div>

          <div class="c-mt-12">
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

        agency: null,
        opportunity: {
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
        console.log('finished', this.opportunity);
        this.isSending = true;
        deipRpc.broadcast.createFundingOpportunityAsync(
          this.user.privKey,
          this.opportunity.number,
          this.opportunity.title,
          this.opportunity.eligibleApplicants,
          this.opportunity.eligibilityAdditionalInformation,
          this.agency._id,
          this.opportunity.description,
          this.opportunity.additionalInfoLink,
          this.opportunity.grantorEmail,
          this.opportunity.disciplines[0].id,
          this.toAssetUnits(this.opportunity.totalProgramFunding),
          this.toAssetUnits(this.opportunity.awardCeiling),
          this.toAssetUnits(this.opportunity.awardFloor),
          this.user.username,
          this.opportunity.officers.map(a => a),
          100,
          100,
          parseInt(this.opportunity.numberOfAwards),
          this.opportunity.startDate,
          this.opportunity.endDate,
          this.opportunity.reveiwCommittee.id
        ).then((res) => {
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

      example() {
        const foaNumber = "#432423423";
        const details = [
          [
            "funding_opportunity_announcement_contract_v1_0_0",
            {
              "version": "1.0.0",
              "organization_id": 22, // id of research group with permlink "national-science-foundation", use it as main tenant group
              "review_committee_id": 23, // id of research group with permlink "nsf-grants-review-committee", you should render the group with its members at Review Committee step 
              "funding_opportunity_number": foaNumber,
              "award_ceiling": this.toAssetUnits(10000),
              "award_floor": this.toAssetUnits(1000),
              "expected_number_of_awards": 10,
              "open_date": new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000),
              "close_date": new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
              "additional_info": [
                ["funding_opportunity_title", "My FOA"],
                ["eligible_applicants", "Others (see text field entitled 'Additional Information on Eligibility' for clarification)"], 
                ["additional_info_of_eligibility", "Who May Submit Proposals: Proposals may only be submitted by the following: -Non-profit, non-academic organizations: Independent museums, observatories, research labs, professional societies and similar organizations in the U.S. associated with educational or research activities. -Institutions of Higher Education (IHEs) - Two- and four-year IHEs (including community colleges) accredited in, and having a campus located in the US, acting on behalf of their faculty members.Special Instructions for International Branch Campuses of US IHEs: If the proposal includes funding to be provided to an international branch campus of a US institution of higher education (including through use of subawards and consultant arrangements), the proposer must explain the benefit(s) to the project of performance at the international branch campus, and justify why the project activities cannot be performed at the US campus."],
                ["description", "The goal of the interagency Smartand Connected Health (SCH): Connecting Data, People and Systems program is to accelerate the development and integration of innovative computer and information scienceand engineering approaches to support the transformation of health and medicine. Approaches that partner technology-based solutions with biomedical and biobehavioral research are supported by multiple agencies of the federal government including the National Science Foundation (NSF) and the National Institutes of Health (NIH). The purpose of this program is to develop next-generation multidisciplinary science that encourages existing and new research communities to focus on breakthrough ideas in a variety of areas of value to health, such as networking, pervasive computing, advanced analytics, sensor integration, privacy and security, modeling of socio-behavioral and cognitive processes and system and process modeling. Effective solutions must satisfy a multitude of constraints arising from clinical/medical needs, barriers to change, heterogeneity of data, semantic mismatch and limitations of current cyberphysical systems and an aging population.Such solutions demand multidisciplinary teams ready to address issues ranging from fundamental science and engineering to medical and public health practice. The SCH program: -takes a coordinated approach that balances theory with evidenced-based analysis and systematic advances with revolutionary breakthroughs; - seeks cross-disciplinary collaborative research that will lead to new fundamental insights; and - encourages empirical validation of new concepts through research prototypes, ranging from specific components to entire systems.The purpose of this interagency program solicitation is to support the development of technologies, analytics and models supporting next generation health and medical research through high-risk, high-reward advances in computer and information science, engineering and technology, behavior and cognition. Collaborations between academic, industry, and other organizations are strongly encouraged to establish better linkages between fundamental science, medicine and healthcare practice and technology development, deployment and use. This solicitation is aligned with national reports calling for new partnerships to facilitate major changes in health and medicine, as well as healthcare delivery and is aimed at the fundamental research to enable these changes. Realizing the promise of disruptive transformation in health, medicine and/or healthcare will require well-coordinated, multi-disciplinary approaches that draw from the computer and information sciences, engineering, social, behavioral, cognitive and economic sciences, biomedical and health research. Only Integrative proposals (INT) spanningup to 4 years with multi-disciplinary teams will be considered in response to this solicitation."], 
                ["link_to_additional_info", "https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=5690"]
              ],
              "officers": [this.user.username] // this list may include members from organization_id and include grant creator
            }
          ]
        ];

        grantsService.createGrantContract(
          this.user.privKey,
          {
            grantor: this.user.username,
            amount: this.toAssetUnits(100000),
            type: 2, // FOA
            target_disciplines: [3, 41],
            details: details
          }
        )
        .then(() => {
          return grantsService.getFundingOpportunityAnnouncementByNumber(foaNumber)
        })
        .then((foa) => {
          console.log(foa);
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },

    created() {
      // use research group with "national-science-foundation" permlink instead this call
      tenantService.getTenantProfile(window.env.TENANT)
        .then((agency) => {
          this.agency = agency;
        })
    }
  };
</script>

<style lang="less">
</style>
