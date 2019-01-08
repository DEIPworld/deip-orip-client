<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Enter funding amount</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto meta-max-width">
                    <v-text-field
                        label="Estimated total program funding"
                        mask="##############"
                        suffix="$"
                        v-model="opportunity.totalProgramFunding"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        label="Expected number of awards"
                        mask="##############"
                        suffix="$"
                        v-model="opportunity.numberOfAwards"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        label="Award ceiling"
                        mask="##############"
                        suffix="$"
                        v-model="opportunity.awardCeiling"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        label="Award floor"
                        mask="##############"
                        suffix="$"
                        v-model="opportunity.awardFloor"
                        :rules="[rules.required]"
                    ></v-text-field>
                </div>

            </div>
        </div>
        
        <div class="row justify-center align-center">
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
                rules: {
                    required: v => !!v || 'This field is required'
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
                return !this.opportunity.totalProgramFunding
                    || !this.opportunity.awardCeiling
                    || !this.opportunity.awardFloor
                    || !this.opportunity.numberOfAwards;
            }
        }
    };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
