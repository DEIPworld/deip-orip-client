<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height stepper-page">
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
                        <div class="uppercase">Min/Max Amount</div>
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
                                :research="research"
                                :isLoading="isLoading"
                            ></token-sale-caps>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-layout>
    </v-container>
</template>


<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import { createTokenSaleProposal } from './../../services/ProposalService'; 

    export default {
        name: "CreateTokenSale",
        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },
        data() { 
            return {
                research: null,
                currentStep: 0,
                tokenSaleInfo: {
                    amountToSell: 10,
                    startDate: undefined,
                    endDate: undefined,
                    softCap: '',
                    hardCap: ''
                },

                isLoading: false
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
                // there is no way to pick time in date picker currently, 
                // but Token Sale status is set to inactive initially until its start_time
                // const nowPlus2Minutes = new Date(Date.now() + (2 * 60 * 1000)); 

                createTokenSaleProposal(
					this.research.research_group_id,
                    this.research.id,
                    this.tokenSaleInfo.startDate.toISOString().split('.')[0],
                    this.tokenSaleInfo.endDate.toISOString().split('.')[0],
                    this.toDeipPercent(parseInt(this.tokenSaleInfo.amountToSell)),
                    this.toAssetUnits(this.tokenSaleInfo.softCap),
                    this.toAssetUnits(this.tokenSaleInfo.hardCap)
				).then(() => {
                    this.isLoading = false;

                    this.$store.dispatch('layout/setSuccess', {
                        message: "Fundraise Proposal has been created successfully! Approve it to start the fundraise!"
                    });
                }).catch(err => {
                    this.isLoading = false;
                    this.$store.dispatch('layout/setError', {
                        message: "An error occurred while creating proposal, please try again later"
                    });
                    console.log(err)
                }).finally(() => {
                    setTimeout(() => {
                        self.$router.push({ name: 'ResearchFeed' });
                    }, 1500);
                })
            }
        },

        created() {
            deipRpc.api.getResearchByAbsolutePermlinkAsync(
                    decodeURIComponent(this.$route.params.research_group_permlink),
                    decodeURIComponent(this.$route.params.research_permlink)
                )
                .then((research) => {
                   this.research = research;
                });
        }
    };
</script>

<style lang="less">
</style>
