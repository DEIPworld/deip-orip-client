<template>
    <v-layout column full-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Add title and number</div>

            <div class="flex-grow-1 overflow-y-auto flex-basis-0">

                <div class="mx-auto meta-max-width">
                    <v-text-field
                        label="Opportunity title"
                        v-model="foa.title"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field
                        label="Opportunity number"
                        v-model="foa.number"
                        :rules="[rules.required]"
                    ></v-text-field>

                    <v-text-field v-if="organization"
                        label="Organization name"
                        v-model="organization.name"
                        disabled
                    ></v-text-field>
                </div>

            </div>
        </v-flex>
        
        <v-flex flex-grow-0>
            <v-layout row justify-center align-center>
                <v-btn color="primary" @click.native="nextStep()" :disabled="isNextDisabled()">Next</v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "FundingOpportunityTitle",

        props: {
            foa: { type: Object, required: true },
            organization: { type: Object },
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
                return !this.foa.title || !this.foa.number;
            }
        }
    };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
