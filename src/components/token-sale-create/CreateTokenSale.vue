<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Amount</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase white-space-nowrap">Start/End Date</div>
                    </v-stepper-step>
                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase">Soft/Hard Cap</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <token-sale-amount
                                @incStep="incStep"
                                :token-sale-info="tokenSaleInfo"
                            ></token-sale-amount>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <token-sale-period
                                @incStep="incStep" @decStep="decStep"
                                :token-sale-info="tokenSaleInfo"
                            ></token-sale-period>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <token-sale-caps
                                @finish="finish" @decStep="decStep"
                                :token-sale-info="tokenSaleInfo"
                                :isLoading="isLoading"
                            ></token-sale-caps>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-layout>

        <v-snackbar :timeout="5000" color="error" v-model="isError">
            {{errorMessage ? errorMessage : "An error occurred while creating Token Sale proposal, please try again later"}}
        <v-btn dark flat @click.native="isError = false; errorMessage = '';">Close</v-btn>
        </v-snackbar>
        <v-snackbar :timeout="5000" color="success" v-model="isSuccess">
            Token Sale Proposal created successfully! Approve it to start the Token Sale !
            <v-btn dark flat @click.native="isSuccess = false;">Close</v-btn>
        </v-snackbar>
    </v-container>
</template>


<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc';
    import * as proposalService from './../research-group/services/ProposalService'; 

    export default {
        name: "CreateTokenSale",
        computed: {
            ...mapGetters({
                user: 'user'
            })
        },
        data() { 
            return {
                research: null,
                currentStep: 0,
                tokenSaleInfo: {
                    amountToSell: 0,
                    startDate: undefined,
                    endDate: undefined,
                    softCap: '',
                    hardCap: ''
                },

                isLoading: false,
                isSuccess: false,
                isError: false,
                errorMessage: ""
            }
        },
        methods: {
            incStep() {
                if (this.currentStep < 3) {
                    this.currentStep++;
                } else {
                    this.currentStep = 1;
                }
            },
            decStep() {
                this.currentStep--;
            },
            finish() {
                const self = this;

                this.isLoading = true;
                let proposal = proposalService.getStringifiedProposalData(proposalService.types.startResearchTokenSale, [
                    this.research.id,
                    this.tokenSaleInfo.startDate.toISOString().split('.')[0],
                    this.tokenSaleInfo.endDate.toISOString().split('.')[0],
                    this.toDeipPercent(parseInt(this.tokenSaleInfo.amountToSell)),
                    parseInt(this.tokenSaleInfo.softCap),
                    parseInt(this.tokenSaleInfo.hardCap)
                ]);

                deipRpc.broadcast.createProposalAsync(
					this.user.privKey,
					this.user.username, 
					this.research.research_group_id,
					proposal,
                    proposalService.types.startResearchTokenSale,
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    this.isLoading = false;
                    this.isSuccess = true;

                    setTimeout(() => {
                        self.$router.push({ 
                            name: 'ResearchGroupDetails',
                            params: { research_group_permlink: self.$route.params.research_group_permlink  }
                        }); 
                    }, 1500)

                }).catch(err => {
                    this.isLoading = false;
                    this.isError = true;
                    this.errorMessage = err.message;
                })
            }
        },

        created(){
            deipRpc.api.getResearchByAbsolutePermlinkAsync(
                    this.$route.params.research_group_permlink,
                    this.$route.params.research_permlink
                )
                .then((research) => {
                   this.research = research;
                })
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
