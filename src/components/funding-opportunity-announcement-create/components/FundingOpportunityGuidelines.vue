<template>
    <v-layout column full-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Describe program guidelines</div>

            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <div class="mx-auto guidelines-max-width">
                    <v-textarea
                        label="Eligible applicants"
                        auto-grow
                        rows="2"
                        v-model="foa.eligibleApplicants"
                        :rules="[rules.required]"
                    ></v-textarea>

                    <v-textarea
                        label="Additional information on eligibility"
                        auto-grow
                        rows="2"
                        v-model="foa.eligibilityAdditionalInformation"
                        :rules="[rules.required]"
                    ></v-textarea>
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
    export default {
        name: "FundingOpportunityGuidelines",

        props: {
            foa: { type: Object, required: true }
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
                return !this.foa.eligibleApplicants
                    || !this.foa.eligibilityAdditionalInformation;
            }
        }
    };
</script>

<style lang="less" scoped>
    .guidelines-max-width {
        max-width: 600px;
    }
</style>
