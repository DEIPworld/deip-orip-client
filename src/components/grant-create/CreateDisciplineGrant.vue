<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout>
            <v-stepper v-model="currentStep" alt-labels class="column full-width full-height stepper-page">
                <v-stepper-header>
                    <v-stepper-step step="1" :complete="currentStep > 1">
                        <div class="uppercase">Discipline</div>
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

                <v-stepper-items class="col-grow">
                    <v-stepper-content step="1">
                        <div class="full-height">
                            <discipline-grant-pick-discipline
                                @incStep="incStep"
                                :grant-info="grantInfo"
                            ></discipline-grant-pick-discipline>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="2">
                        <div class="full-height">
                            <discipline-grant-amount
                                @incStep="incStep" @decStep="decStep"
                                :grant-info="grantInfo"
                                :deip-token-balance="
                                    user.account ? this.fromAssetsToFloat(user.account.balance) : 0
                                "
                            ></discipline-grant-amount>
                        </div>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <div class="full-height">
                            <discipline-grant-conditions
                                @decStep="decStep"
                                @finish="finish"
                                :grant-info="grantInfo"
                                :isLoading="isLoading"
                            ></discipline-grant-conditions>
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
        name: "CreateDisciplineGrant",

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
                    discipline: undefined,
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
                const self = this;
                this.isLoading = true;

                deipRpc.api.getDynamicGlobalPropertiesAsync()
                    .then(data => {
                        // counting approximate start block and end block for blockchain
                        const BLOCK_CREATE_INTERVAL = 3; // 3 seconds

                        let nowDateUnix = moment().unix();
                        let startDateUnix = moment(this.grantInfo.startDate).unix();
                        let endDateUnix = moment(this.grantInfo.endDate).unix();

                        let startBlock = Math.floor((startDateUnix - nowDateUnix) / BLOCK_CREATE_INTERVAL) + data.last_irreversible_block_num;
                        let endBlock = Math.floor((endDateUnix - nowDateUnix) / BLOCK_CREATE_INTERVAL) + data.last_irreversible_block_num;

                        let isExtendable = true;
                        let contentHash = this.grantInfo.description;

                        deipRpc.broadcast.createGrantAsync(
                            this.user.privKey,
                            this.user.username,
                            his.grantInfo.amount,
                            window.env.ASSET_UNIT,
                            this.grantInfo.discipline.label,
                            startBlock,
                            endBlock,
                            isExtendable,
                            contentHash
                        ).then(() => {
                            this.$store.dispatch('layout/setSuccess', {
                                message: "Grant has been created successfully!"
                            });

                            setTimeout(() => {
                                self.$router.push({ 
                                    name: 'ResearchFeed'
                                }); 
                            }, 1500);
                        }).catch(err => {
                            this.$store.dispatch('layout/setError', {
                                message: "An error occurred while creating grant, please try again later"
                            });
                        }).finally(() => {
                            this.isLoading = false;
                        })
                    });
            }
        },

        created(){
        }
    };
</script>

<style lang="less">
</style>
