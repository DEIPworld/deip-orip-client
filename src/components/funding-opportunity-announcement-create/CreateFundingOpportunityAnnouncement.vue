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
