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
                            ></token-sale-caps>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

        </v-layout>
    </v-container>   
</template>

<script>
    import * as proposalService from "../../research/services/ProposalService"; 

    export default {
        name: "TokenSale",
        data() { 
            return {
                currentStep: 0,
                tokenSaleInfo: {
                    amountToSell: 0,
                    startDate: undefined,
                    endDate: undefined,
                    softCap: '',
                    hardCap: ''
                },
                user: { name: 'initdelegate', postingWif: '5JidFW79ttL9YP3W2Joc5Zer49opYU3fKNeBx9B6cpEH1GiDm5p' }
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
                let data = proposalService.getStringifiedProposalData(proposalService.types.startResearchTokenSale, [
                    0, // research id
                    this.tokenSaleInfo.startDate.toISOString().split('.')[0],
                    this.tokenSaleInfo.endDate.toISOString().split('.')[0],
                    this.toDeipPercent(
                        parseInt(this.tokenSaleInfo.amountToSell)
                    ),
                    parseInt(this.tokenSaleInfo.softCap),
                    parseInt(this.tokenSaleInfo.hardCap)
                ]);

                deipRpc.broadcast.createProposalAsync(
					this.user.postingWif,
					this.user.name, 
					0, // group id
					data,
                    proposalService.types.startResearchTokenSale,
					new Date( new Date().getTime() + 2 * 24 * 60 * 60 * 1000 )
				).then(() => {
                    // go to another route state
                    console.log('hooray!!!');
                }).catch(err => {
                    alert(err.message);
                });
            }
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
