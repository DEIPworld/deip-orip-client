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
                            ></token-sale-amount>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <token-sale-period
                                @incStep="incStep" @decStep="decStep"
                            ></token-sale-period>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <token-sale-caps
                                @incStep="incStep" @decStep="decStep"
                            ></token-sale-caps>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>

        </v-layout>
    </v-container>   
</template>

<script>
    export default {
        name: "TokenSale",
        data() { 
            return {
                currentStep: 0
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
