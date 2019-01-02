<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Describe program guidelines</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto guidelines-max-width">
                    <v-text-field
                        label="Eligible applicants"
                        multi-line auto-grow
                        rows="2"
                        v-model="opportunity.eligibleApplicants"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        label="Additional information on eligibility"
                        multi-line auto-grow
                        rows="2"
                        v-model="opportunity.eligibilityAdditionalInformation"
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
        name: "FundingOpportunityGuidelines",

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
                return !this.opportunity.eligibleApplicants
                    || !this.opportunity.eligibilityAdditionalInformation;
            }
        }
    };
</script>

<style lang="less" scoped>
    .guidelines-max-width {
        max-width: 600px;
    }
</style>
