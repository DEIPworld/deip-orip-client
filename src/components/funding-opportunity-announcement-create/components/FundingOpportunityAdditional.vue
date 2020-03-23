<template>
    <v-layout column full-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Provide additional information</div>

            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <div class="mx-auto guidelines-max-width">
                    <v-textarea
                        label="Opportunity description"
                        auto-grow
                        rows="2"
                        v-model="foa.description"
                    ></v-textarea>

                    <v-text-field
                        label="Link to additional information"
                        v-model="foa.additionalInfoLink"
                    ></v-text-field>

                    <v-text-field
                        label="Grantor contact e-mail address"
                        v-model="foa.grantorEmail"
                    ></v-text-field>
                </div>

            </div>
        </v-flex>
        
        <v-flex flex-grow-0>
            <v-layout row justify-center align-center>
                <v-btn flat small @click.native="prevStep()">
                    <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
                </v-btn>
                
                <v-btn color="primary" @click.native="finish()" :loading="isSending" :disabled="isNextDisabled() || isSending">Finish</v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "FundingOpportunityAdditional",

        props: {
            foa: { type: Object, required: true },
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
