<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Enter funding amount</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto meta-max-width">
                    <v-form v-model="isFormValid">
                        <v-text-field
                            label="Estimated total program funding"
                            mask="##############"
                            suffix="$"
                            v-model="opportunity.totalProgramFunding"
                            :rules="[ rules.required, rules.totalProgrammingFundingValidator ]"
                        ></v-text-field>

                        <v-text-field
                            label="Expected number of awards"
                            mask="##############"
                            v-model="opportunity.numberOfAwards"
                            :rules="[ rules.required ]"
                        ></v-text-field>

                        <v-text-field
                            label="Award ceiling"
                            mask="##############"
                            suffix="$"
                            v-model="opportunity.awardCeiling"
                            :rules="[ rules.required, rules.awardCeilingValidator ]"
                        ></v-text-field>

                        <v-text-field
                            label="Award floor"
                            mask="##############"
                            suffix="$"
                            v-model="opportunity.awardFloor"
                            :rules="[ rules.required, rules.awardFloorValidator ]"
                        ></v-text-field>
                    </v-form>
                </div>

            </div>
        </div>
        
        <div class="row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FundingOpportunityAwards",

        props: {
            opportunity: { type: Object, required: true }
        },

        data() { 
            return {
                isFormValid: false,
                
                rules: {
                    required: v => !!v || 'This field is required',

                    totalProgrammingFundingValidator: () => {
                        let totalProgramFunding = parseInt(this.opportunity.totalProgramFunding);
                        let awardFloor = parseInt(this.opportunity.awardFloor);
                        let awardCeiling = parseInt(this.opportunity.awardCeiling);

                        if (!totalProgramFunding) {
                            return true;
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
                        let totalProgramFunding = parseInt(this.opportunity.totalProgramFunding);
                        let awardFloor = parseInt(this.opportunity.awardFloor);
                        let awardCeiling = parseInt(this.opportunity.awardCeiling);

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
                        let totalProgramFunding = parseInt(this.opportunity.totalProgramFunding);
                        let awardFloor = parseInt(this.opportunity.awardFloor);
                        let awardCeiling = parseInt(this.opportunity.awardCeiling);

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
