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
                        validate-on-blur
                        :rules="[rules.required, rules.foaNumber]"
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
                MIN_FOA_NUMBER_LENGTH: 3,
                MAX_FOA_NUMBER_LENGTH: 15,
                rules: {
                    required: v => !!v || 'This field is required',
                    foaNumber: (v) => {
                        if (v.length < this.MIN_FOA_NUMBER_LENGTH){
                            return `Award number length should be greater/equal than ${this.MIN_FOA_NUMBER_LENGTH}`
                        } else if (v.length > this.MAX_FOA_NUMBER_LENGTH){
                            return `Award number length should be less/equal than ${this.MAX_FOA_NUMBER_LENGTH}`
                        }
                        return true
                    },
                }
            } 
        },
        
        methods: {
            nextStep() {
                this.$emit('incStep');
            },

            isNextDisabled() {
                return !this.foa.title || !this.foa.number || this.foa.number.length < this.MIN_FOA_NUMBER_LENGTH || this.foa.number.length > this.MAX_FOA_NUMBER_LENGTH;
            }
        }
    };
</script>

<style lang="less" scoped>
    .meta-max-width {
        max-width: 500px;
    }
</style>
