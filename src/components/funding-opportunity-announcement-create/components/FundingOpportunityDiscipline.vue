<template>
    <v-layout column full-height>
        <v-flex display-flex flex-column flex-grow-1 mb-3>
            <div class="step-title">Select discipline(s) your funding opportunity is related to</div>

            <div class="subheading mb-2 text-align-center mx-auto discipline-max-width">
                {{ foa.disciplines.map(discipline => discipline.label).join(' · ') }}
            </div>

            <v-flex flex-basis-0 overflow-y-auto>
                <div class="mx-auto discipline-max-width pt-2 full-height">
                    <advanced-discipline-picker
                        :preselected="foa.disciplines"
                        :without-user-disciplines="true"
                        @select="selectDiscipline"
                    ></advanced-discipline-picker>
                </div>
            </v-flex>
        </v-flex>

        <v-flex flex-grow-0>
            <v-layout row wrap justify-center align-center>
                <v-btn flat small @click.native="prevStep()">
                    <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
                </v-btn>

                <v-btn color="primary" @click.native="nextStep()"
                    :disabled="isDisabled()"
                >Next</v-btn>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "FundingOpportunityDiscipline",

        props: {
            foa: { type: Object, required: true }
        },

        data() { 
            return {
                isFormValid: false,

                required: value => !!value || 'This field is required'
            } 
        },

        methods: {
            nextStep() {
                this.$emit('incStep');
            },
            prevStep() {
                this.$emit('decStep');
            },

            selectDiscipline(disciplines) {
                this.foa.disciplines = disciplines;
            },

            isDisabled() {
                return _.isEmpty(this.foa.disciplines);
            }
        }
    };
</script>

<style lang="less" scoped>
    .discipline-max-width {
        max-width: 600px;
        min-height: 25px;
    }
</style>
