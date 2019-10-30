<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Provide additional information</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto guidelines-max-width">
                    <v-textarea
                        label="Opportunity description"
                        auto-grow
                        rows="2"
                        v-model="opportunity.description"
                    ></v-textarea>

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
        
        <div class="legacy-row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" @click.native="finish()" :loading="isSending" :disabled="isNextDisabled() || isSending">Finish</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FundingOpportunityAdditional",

        props: {
            opportunity: { type: Object, required: true },
            isSending: { type: Boolean, default: false },
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
