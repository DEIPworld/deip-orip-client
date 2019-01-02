<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Provide additional information</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto guidelines-max-width">
                    <v-text-field
                        label="Opportunity description"
                        multi-line auto-grow
                        rows="2"
                        v-model="opportunity.description"
                    ></v-text-field>

                    <v-text-field
                        label="Link to additional information"
                        v-model="opportunity.additionalInfoLink"
                    ></v-text-field>

                    <v-text-field
                        label="Grantor contact e-mail address"
                        v-model="opportunity.grantorEmail"
                    ></v-text-field>
                </div>

            </div>
        </div>
        
        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" @click.native="finish()" :disabled="isNextDisabled()">Finish</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FundingOpportunityAdditional",

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
            finish() {
                this.$emit('finish');
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
