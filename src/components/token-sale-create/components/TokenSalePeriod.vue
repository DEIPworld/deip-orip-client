<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Select start and end dates of research fundraise</div>

            <div class="legacy-col-grow overflow-y-auto">

                <div class="c-mh-auto period-max-width c-pt-4">
                    <v-form class="legacy-row" ref="form" v-model="isFormValid">
                        <div class="legacy-col-12">
                            <datetime-picker
                                ref="startDatePicker"
                                label="Start date"
                                :datetime="startDate"
                                :available-from-now="true"
                                :rules="[
                                    rules.required,
                                    rules.greaterThanNow,
                                    rules.startDateShouldBeSmaller
                                ]"
                                @input="setStartDate"
                            ></datetime-picker>
                        </div>

                        <div class="legacy-col-12">
                            <datetime-picker
                                label="End date"
                                :datetime="endDate"
                                :available-from-now="true"
                                :rules="[
                                    rules.required,
                                    rules.greaterThanNow,
                                    rules.endDateShouldBeGreater
                                ]"
                                @input="setEndDate"
                            ></datetime-picker>
                        </div>
                    </v-form>
                </div>
            </div>
        </div>

        <div class="legacy-row legacy-justify-center align-center">
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
        name: "TokenSalePeriod",

        props: {
            tokenSaleInfo: { type: Object, required: true }
        },

        data() { 
            return {
                startDate: undefined,
                endDate: undefined,

                isFormValid: false,

                rules: {
                    required: val => !!val || 'This field is required',
                    greaterThanNow: val => Date.parse(val) > Date.now() || 'Date should be in the future',

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
                this.tokenSaleInfo.startDate = new Date(value);
            },
            setEndDate(value) {
                this.endDate = value;
                this.tokenSaleInfo.endDate = new Date(value);
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
