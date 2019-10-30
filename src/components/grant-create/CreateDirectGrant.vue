<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-stepper v-model="currentStep" alt-labels class="legacy-column full-width full-height stepper-page">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Research</div>
                    </v-stepper-step>

                    <v-divider></v-divider>

                    <v-stepper-step step="2" :complete="currentStep > 2">
                        <div class="uppercase">Amount</div>
                    </v-stepper-step>
                    
                    <v-divider></v-divider>

                    <v-stepper-step step="3" :complete="currentStep > 3">
                        <div class="uppercase white-space-nowrap">Special conditions</div>
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items class="legacy-col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <direct-grant-pick-research
                                @incStep="incStep"
                                :grant-info="grantInfo"
                            ></direct-grant-pick-research>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <direct-grant-amount
                                @incStep="incStep" @decStep="decStep"
                                :grant-info="grantInfo"
                                :deip-token-balance="
                                    user.account ? this.fromAssetsToFloat(user.account.balance) : 0
                                "
                            ></direct-grant-amount>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <direct-grant-conditions
                                @decStep="decStep"
                                @finish="finish"
                                :grant-info="grantInfo"
                                :isLoading="isLoading"
                            ></direct-grant-conditions>
                        </div>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-layout>
    </v-container>
</template>


<script>
    import { mapGetters } from 'vuex';
    import moment from 'moment';
    import deipRpc from '@deip/deip-rpc-client';

    export default {
        name: "CreateDirectGrant",

        computed: {
            ...mapGetters({
                user: 'auth/user'
            })
        },

        data() {
            return {
                currentStep: 0,
                isLoading: false,

                grantInfo: {
                    research: undefined,
                    amount: '',
                    startDate: undefined,
                    endDate: undefined,
                    description: ''
                }
            }
        },

        methods: {
            incStep() {
                this.currentStep++;
            },
            decStep() {
                this.currentStep--;
            },
            finish() {
                // this.isLoading = true;
                console.log('FINISHED');
            }
        },

        created(){
        }
    };
</script>

<style lang="less">
</style>
