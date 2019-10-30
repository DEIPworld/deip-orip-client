<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Select discipline(s) your funding opportunity is related to</div>

            <div class="subheading c-mb-2 text-align-center c-mh-auto discipline-max-width">
                {{ opportunity.disciplines.map(discipline => discipline.label).join(' · ') }}
            </div>

            <div class="legacy-col-grow overflow-y-auto">
                <div class="c-mh-auto discipline-max-width c-pt-2 full-height">
                    <advanced-discipline-picker
                        :preselected="opportunity.disciplines"
                        :without-user-disciplines="true"
                        @select="selectDiscipline"
                    ></advanced-discipline-picker>
                </div>
            </div>
        </div>

        <div class="legacy-row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>

            <v-btn color="primary" @click.native="nextStep()"
                :disabled="isDisabled()"
            >Next</v-btn>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "FundingOpportunityDiscipline",

        props: {
            opportunity: { type: Object, required: true }
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
                this.opportunity.disciplines = disciplines;
            },

            isDisabled() {
                return _.isEmpty(this.opportunity.disciplines);
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
