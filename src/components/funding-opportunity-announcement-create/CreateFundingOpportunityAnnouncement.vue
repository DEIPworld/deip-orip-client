<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-flex xs12 class="full-height" v-if="!isFinished && agency">
              <v-stepper v-model="currentStep" alt-labels class="stepper-page full-height">
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

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card height="100%">
                            <funding-opportunity-title
                                @incStep="incStep"
                                :opportunity="opportunity"
                                :agency="agency"
                            ></funding-opportunity-title>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <v-card height="100%">
                            <funding-opportunity-discipline
                                @incStep="incStep" @decStep="decStep"
                                :opportunity="opportunity"
                            ></funding-opportunity-discipline>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card height="100%">
                            <funding-opportunity-period
                                @incStep="incStep" @decStep="decStep"
                                :opportunity="opportunity"
                            ></funding-opportunity-period>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <v-card height="100%">
                            <funding-opportunity-awards
                                @incStep="incStep" @decStep="decStep"
                                :opportunity="opportunity"
                            ></funding-opportunity-awards>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="5">
                        <v-card height="100%">
                            <funding-opportunity-guidelines
                                @incStep="incStep" @decStep="decStep"
                                :opportunity="opportunity"
                            ></funding-opportunity-guidelines>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="6">
                        <v-card height="100%">
                            <funding-opportunity-program-officers
                                @incStep="incStep" @decStep="decStep"
                                :opportunity="opportunity"
                            ></funding-opportunity-program-officers>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="7">
                        <v-card height="100%">
                            <funding-opportunity-review-committee
                                @incStep="incStep" @decStep="decStep"
                                :opportunity="opportunity"
                            ></funding-opportunity-review-committee>
                        </v-card>
                    </v-stepper-content>

                    <v-stepper-content step="8">
                        <v-card height="100%">
                            <v-switch
                                v-model="mustBeEqualToStandard"
                                label="Must be equal to standard"
                            ></v-switch>
                            <funding-opportunity-additional
                                @finish="finish" @decStep="decStep"
                                :is-sending="isSending"
                                :opportunity="opportunity"
                            ></funding-opportunity-additional>
                        </v-card>
                    </v-stepper-content>
                </v-stepper-items>
              </v-stepper>
            </v-flex>
            
            <v-flex xs12 class="full-height" v-if="isFinished">
              <div class="display-flex full-width full-height" v-if="isFinished">
                <div class="c-m-auto text-align-center">
                    <div class="display-1">New Funding Opportunity has been created <br/> successfully</div>
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
            </v-flex>
        </v-layout>
    </v-container>
</template>


<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import agencyHttp from './../../services/http/agency';

    export default {
        name: "CreateFundingOpportunityAnnouncement",

        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
        data() { 
            return {
                currentStep: 0,
                e1: 0,
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

                standard: `{"title":"Smart and Connected Health (SCH)","number":"18-541","disciplines":[{"id":9,"label":"Medicine and health","path":"medicine_and_health"}],"totalProgramFunding":"5000000","awardCeiling":"1000000","awardFloor":"100000","numberOfAwards":"5","eligibleApplicants":"Others (see text field entitled 'Additional Information on Eligibility' for clarification)","eligibilityAdditionalInformation":"Who May Submit Proposals: Proposals may only be submitted by the following: -Non-profit, non-academic organizations: Independent museums, observatories, research labs, professional societies and similar organizations in the U.S. associated with educational or research activities. -Institutions of Higher Education (IHEs) - Two- and four-year IHEs (including community colleges) accredited in, and having a campus located in the US, acting on behalf of their faculty members.Special Instructions for International Branch Campuses of US IHEs: If the proposal includes funding to be provided to an international branch campus of a US institution of higher education (including through use of subawards and consultant arrangements), the proposer must explain the benefit(s) to the project of performance at the international branch campus, and justify why the project activities cannot be performed at the US campus.","officers":["alex"],"description":"The goal of the interagency Smartand Connected Health (SCH): Connecting Data, People and Systems program is to accelerate the development and integration of innovative computer and information scienceand engineering approaches to support the transformation of health and medicine. Approaches that partner technology-based solutions with biomedical and biobehavioral research are supported by multiple agencies of the federal government including the National Science Foundation (NSF) and the National Institutes of Health (NIH). The purpose of this program is to develop next-generation multidisciplinary science that encourages existing and new research communities to focus on breakthrough ideas in a variety of areas of value to health, such as networking, pervasive computing, advanced analytics, sensor integration, privacy and security, modeling of socio-behavioral and cognitive processes and system and process modeling. Effective solutions must satisfy a multitude of constraints arising from clinical/medical needs, barriers to change, heterogeneity of data, semantic mismatch and limitations of current cyberphysical systems and an aging population.Such solutions demand multidisciplinary teams ready to address issues ranging from fundamental science and engineering to medical and public health practice. The SCH program: -takes a coordinated approach that balances theory with evidenced-based analysis and systematic advances with revolutionary breakthroughs; - seeks cross-disciplinary collaborative research that will lead to new fundamental insights; and - encourages empirical validation of new concepts through research prototypes, ranging from specific components to entire systems.The purpose of this interagency program solicitation is to support the development of technologies, analytics and models supporting next generation health and medical research through high-risk, high-reward advances in computer and information science, engineering and technology, behavior and cognition. Collaborations between academic, industry, and other organizations are strongly encouraged to establish better linkages between fundamental science, medicine and healthcare practice and technology development, deployment and use. This solicitation is aligned with national reports calling for new partnerships to facilitate major changes in health and medicine, as well as healthcare delivery and is aimed at the fundamental research to enable these changes. Realizing the promise of disruptive transformation in health, medicine and/or healthcare will require well-coordinated, multi-disciplinary approaches that draw from the computer and information sciences, engineering, social, behavioral, cognitive and economic sciences, biomedical and health research. Only Integrative proposals (INT) spanningup to 4 years with multi-disciplinary teams will be considered in response to this solicitation.","additionalInfoLink":"https://www.nsf.gov/funding/pgm_summ.jsp?pims_id=5690","grantorEmail":"grantsgovsupport@nsf.gov","startDate":"2019-01-01T21:00:00.000Z","endDate":"2021-01-01T21:00:00.000Z","reveiwCommittee":{"id":2,"name":"NSF Official Review Commitee","permlink":"nsf-review-commitee","description":"NSF Official Review Commitee","quorum_percent":1000,"proposal_quorums":[[1,1000],[2,1000],[3,1000],[4,1000],[5,1000],[6,1000],[7,1000],[8,1000],[9,1000],[10,1000]],"is_personal":false,"balance":{"amount":0,"asset_id":3},"locked_balance":{"amount":0,"asset_id":3},"enrichedMembers":[{"profile":{"location":{"city":null,"country":null},"email":null,"avatar":"default_avatar.png","firstName":"Alexey","lastName":"K","bio":null,"birthday":null,"agencies":[],"_id":"sherlock","socialNetworks":[],"contacts":[],"education":[],"employment":[],"created":"2018-08-10T11:29:15.374Z","updated":"2018-08-10T11:29:15.374Z","created_at":"2018-08-10T11:29:15.377Z","updated_at":"2018-11-22T13:52:52.708Z","__v":0},"account":{"id":14,"name":"sherlock","owner":{"weight_threshold":1,"account_auths":[],"key_auths":[["DEIP8Y6vwKDcTLYy5ywFXQEdz9SLVgJNtnM5epwX5F6fwGnjbJfPfX",1]]},"active":{"weight_threshold":1,"account_auths":[],"key_auths":[["DEIP8Y6vwKDcTLYy5ywFXQEdz9SLVgJNtnM5epwX5F6fwGnjbJfPfX",1]]},"posting":{"weight_threshold":1,"account_auths":[],"key_auths":[["DEIP8Y6vwKDcTLYy5ywFXQEdz9SLVgJNtnM5epwX5F6fwGnjbJfPfX",1]]},"memo_key":"DEIP8Y6vwKDcTLYy5ywFXQEdz9SLVgJNtnM5epwX5F6fwGnjbJfPfX","json_metadata":"{created at: 'GENESIS'}","proxy":"","last_owner_update":"1970-01-01T00:00:00","last_account_update":"1970-01-01T00:00:00","created":"2018-09-06T17:00:00","mined":false,"recovery_account":"regacc","last_account_recovery":"1970-01-01T00:00:00","lifetime_vote_count":0,"can_vote":true,"common_tokens_balance":1,"expert_tokens_balance":10000,"received_common_tokens":0,"common_tokens_withdraw_rate":0,"next_common_tokens_withdrawal":"1969-12-31T23:59:59","withdrawn":0,"to_withdraw":0,"withdraw_routes":0,"proxied_vsf_votes":[0,0,0,0],"witnesses_voted_for":0,"average_bandwidth":0,"lifetime_bandwidth":0,"last_bandwidth_update":"1970-01-01T00:00:00","average_market_bandwidth":0,"lifetime_market_bandwidth":0,"last_market_bandwidth_update":"1970-01-01T00:00:00","organisation_id":4,"balances":[{"amount":"50000000000","asset_id":0}],"witness_votes":[]}}]}}`,
                mustBeEqualToStandard: true,

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

                if (this.mustBeEqualToStandard) {
                    let stringifiedOpportunity = JSON.stringify(this.opportunity);
                    if (stringifiedOpportunity !== this.standard) {
                        alert("Input is different from standard !");
                        console.log(`${stringifiedOpportunity} is not equal to ${this.standard}`);
                        this.isSending = false;
                        return;
                    }
                }
                // alert("Sent!")
                // this.isSending = false;

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
                    this.opportunity.totalProgramFunding,
                    this.opportunity.awardCeiling,
                    this.opportunity.awardFloor,
                    "NGT",
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
                        message: "An error occurred while creating Funding Opportunity, please try again later"
                    });
                    console.log(err)
                })
                .finally(() => { this.isSending = false; });
            }
        },
        created() {
            agencyHttp.getAgencyProfile(window.env.TENANT)
                .then((agency) => {
                    this.agency = agency;
                })
        }
    };
</script>

<style lang="less">
</style>
