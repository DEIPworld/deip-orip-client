<template>
    <v-layout column full-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Enter funding amount</div>

            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <div class="mx-auto meta-max-width">
                    <v-form v-model="isFormValid">
                        <v-text-field
                            label="Estimated total program funding"
                            mask="##############"
                            suffix="$"
                            v-model="foa.totalProgramFunding"
                            :rules="[ rules.required, rules.totalProgrammingFundingValidator ]"
                        ></v-text-field>

                        <v-text-field
                            label="Expected number of awards"
                            mask="##############"
                            v-model.number="foa.numberOfAwards"
                            :rules="[ rules.required ]"
                        ></v-text-field>

                        <v-text-field
                            label="Award ceiling"
                            mask="##############"
                            suffix="$"
                            v-model="foa.awardCeiling"
                            :rules="[ rules.required, rules.awardCeilingValidator ]"
                        ></v-text-field>

                        <v-text-field
                            label="Award floor"
                            mask="##############"
                            suffix="$"
                            v-model="foa.awardFloor"
                            :rules="[ rules.required, rules.awardFloorValidator ]"
                        ></v-text-field>
                    </v-form>
                </div>

            </div>
        </v-flex>
        
        <v-flex flex-grow-0>
            <v-layout row justify-center align-center>
                <v-btn flat small @click.native="prevStep()">
                    <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
                </v-btn>
                
                <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import { AssetsService } from '@deip/assets-service';

const assetsService = AssetsService.getInstance();

    export default {
        name: "FundingOpportunityAwards",

        props: {
            foa: { type: Object, required: true }
        },

        data() { 
            return {
                isFormValid: false,

                rules: {
                    required: v => !!v || 'This field is required',

                    totalProgrammingFundingValidator: () => {
                        let totalProgramFunding = parseInt(this.foa.totalProgramFunding);
                        let awardFloor = parseInt(this.foa.awardFloor);
                        let awardCeiling = parseInt(this.foa.awardCeiling);

                        if (!totalProgramFunding) {
                            return true;
                        }

                        if (totalProgramFunding > this.userBalances[window.env.ASSET_UNIT]){
                            return "Total program funding can't be greater than your balance";
                        }

                        if (awardFloor && awardFloor > totalProgramFunding) {
                            return 'Total program funding should be greater than award floor';
                        }

                        if (awardCeiling && awardCeiling > totalProgramFunding) {
                            return 'Total program funding should be greater than award ceiling';
                        }

                        return true;
                    },

                    awardFloorValidator: () => {
                        let totalProgramFunding = parseInt(this.foa.totalProgramFunding);
                        let awardFloor = parseInt(this.foa.awardFloor);
                        let awardCeiling = parseInt(this.foa.awardCeiling);

                        if (!awardFloor) {
                            return true;
                        }

                        if (totalProgramFunding && awardFloor > totalProgramFunding) {
                            return 'Award floor should be smaller than total program funding';
                        }

                        if (awardCeiling && awardFloor > awardCeiling) {
                            return 'Award floor should be smaller than award ceiling';
                        }

                        return true;
                    },

                    awardCeilingValidator: () => {
                        let totalProgramFunding = parseInt(this.foa.totalProgramFunding);
                        let awardFloor = parseInt(this.foa.awardFloor);
                        let awardCeiling = parseInt(this.foa.awardCeiling);

                        if (!awardCeiling) {
                            return true;
                        }

                        if (awardFloor && awardCeiling < awardFloor) {
                            return 'Award ceiling should be greater than award floor';
                        }

                        if (totalProgramFunding && awardCeiling > totalProgramFunding) {
                            return 'Award ceiling should be smaller than total program funding';
                        }

                        return true;
                    }
                }
            } 
        },

        computed:{
            ...mapGetters({
                userBalances: 'auth/userBalances'
            })
        },
        
        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },

            isNextDisabled() {
                return !this.isFormValid;
            }
        }
    };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
