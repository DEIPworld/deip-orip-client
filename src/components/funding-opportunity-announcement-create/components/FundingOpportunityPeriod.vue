<template>
    <div>
        <div>
            <div class="step-title">Specify due dates</div>

            <div class="overflow-y-auto">

                <div class="c-mh-auto period-max-width c-mt-4">
                    <v-form class="row" ref="form" v-model="isFormValid">
                        <div class="col-12">
                            <datetime-picker
                                ref="startDatePicker"
                                label="Open date"
                                :datetime="startDate"
                                :allowedDates="() => true"
                                :rules="[
                                    rules.required,
                                    rules.startDateShouldBeSmaller
                                ]"
                                @input="setStartDate"
                            ></datetime-picker>
                        </div>

                        <div class="col-12">
                            <datetime-picker
                                label="Close date"
                                :datetime="endDate"
                                :allowedDates="() => true"
                                :rules="[
                                    rules.required,
                                    rules.endDateShouldBeGreater
                                ]"
                                @input="setEndDate"
                            ></datetime-picker>
                        </div>
                    </v-form>
                </div>
            </div>
        </div>

        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" 
                @click.native="nextStep()" 
                :disabled="!isFormValid"
            >Next</v-btn>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        name: "FundingOpportunityPeriod",

        props: {
            opportunity: { type: Object, required: true }
        },

        data() { 
            return {
                startDate: undefined,
                endDate: undefined,

                isFormValid: false,

                rules: {
                    required: val => !!val || 'This field is required',
                    // greaterThanNow: val => Date.parse(val) > Date.now() || 'Date should be in the future',

                    startDateShouldBeSmaller: val => {
                        return !this.endDate
                            || Date.parse(val) < Date.parse(this.endDate)
                            || 'Start date should be smaller than end date';
                    },

                    endDateShouldBeGreater: val => {
                        return !this.startDate
                            || Date.parse(val) > Date.parse(this.startDate)
                            || 'End date should be greater than start date';
                    },
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
            
            setStartDate(value) {
                this.startDate = value;
                this.opportunity.startDate = new Date(value);
            },
            setEndDate(value) {
                this.endDate = value;
                this.opportunity.endDate = new Date(value);
            },
        },

        mounted() {
            const startDate = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm');
            this.setStartDate(startDate);
        }
    };
</script>

<style lang="less" scoped>
    .period-max-width {
        max-width: 300px;
    }
</style>
