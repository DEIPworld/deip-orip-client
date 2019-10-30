<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Add title and number</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto meta-max-width">
                    <v-text-field
                        label="Opportunity title"
                        v-model="opportunity.title"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        label="Opportunity number"
                        v-model="opportunity.number"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field v-if="agency"
                        label="Agency name"
                        v-model="agency.name"
                        disabled
                    ></v-text-field>
                </div>

            </div>
        </div>
        
        <div class="row legacy-justify-center align-center">
            <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FundingOpportunityTitle",

        props: {
            opportunity: { type: Object, required: true },
            agency: { type: Object },
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

            isNextDisabled() {
                return !this.opportunity.title || !this.opportunity.number;
            }
        }
    };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
