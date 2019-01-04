<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-stepper v-model="currentStep" v-if="!isFinished" alt-labels class="column full-width full-height">
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
                        <div class="uppercase white-space-nowrap">Additional</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <funding-opportunity-title
                                @incStep="incStep"
                                :opportunity="opportunity"
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
                            <funding-opportunity-additional
                                @finish="finish" @decStep="decStep"
                                :is-sending="isSending"
                                :opportunity="opportunity"
                            ></funding-opportunity-additional>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

            <div class="display-flex full-width full-height" v-else>
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
                        <v-btn color="primary" class="ma-0" :to="{name: 'Default'}">Close</v-btn>
                    </div>
                </div>
            </div>
        </v-layout>
    </v-container>
</template>


<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import agency from './agencyTmp.js';

    export default {
        name: "FundingOpportunityAnnouncement",

        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },

        data() { 
            return {
                currentStep: 0,
                
                opportunity: {
                    title: '',
                    number: '',
                    agency: null,
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
                    endDate: null
                },

                isFinished: false,
                isSending: false
            }
        },

        methods: {
            incStep() {
                if (this.currentStep < 7) {
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
                    "nsf",
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
                    this.opportunity.endDate
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
            this.opportunity.agency = agency;
        }
    };
</script>

<style lang="less">    
    .stepper__content {
        height: 100%;
        padding-right: 0px;
        padding-left: 0px;
        .stepper__wrapper {
            height: 100%;
        }
    }

    .step-title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        padding-bottom: 16px;
    }
</style>
