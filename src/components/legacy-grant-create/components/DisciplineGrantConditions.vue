<template>
    <div class="legacy-column full-height">
        <div class="c-mb-4 legacy-col-grow legacy-column">
            <div class="step-title">Discipline supply grant</div>

            <div class="legacy-col-grow overflow-y-auto">
                
                <div class="c-mh-auto full-height discipline-conditions">
                    <v-form class="" ref="form" v-model="isFormValid">
                        <div class="subheading bold">Dates attended</div>

                        <div class="legacy-row">
                            <div class="legacy-col-6 c-pr-3">
                                <datetime-picker
                                    label="Start date"
                                    :datetime="grantInfo.startDate"
                                    :available-from-now="true"
                                    :rules="[
                                        rules.required,
                                        rules.greaterThanNow,
                                        rules.startDateShouldBeSmaller
                                    ]"
                                    @input="setDateFrom"
                                ></datetime-picker>
                            </div>
                            
                            <div class="legacy-col-6 c-pl-3">
                                <datetime-picker
                                    label="End date"
                                    :datetime="grantInfo.endDate"
                                    :available-from-now="true"
                                    :rules="[
                                        rules.required,
                                        rules.greaterThanNow,
                                        rules.endDateShouldBeGreater
                                    ]"
                                    @input="setDateTo"
                                ></datetime-picker>
                            </div>
                        </div>

                        <div class="c-pt-4 subheading bold">Description 
                            <span class="caption">(optional)</span>
                        </div>

                        <v-textarea v-model="grantInfo.description" rows="2" auto-grow></v-textarea>
                    </v-form>
                </div>

            </div>
        </div>

        <div class="legacy-row legacy-justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" 
                @click.native="finish()" 
                :disabled="!isFormValid || isLoading"
                :loading="isLoading"
            >Create grant</v-btn>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    
    export default {
        name: "DisciplineGrantConditions",

        props: {
            grantInfo: { type: Object, required: true },
            isLoading: { type: Boolean, required: true }
        },

        data() {
            return {
                isFormValid: false,

                rules: {
                    required: value => !!value || 'This field is required',
                    greaterThanNow: val => Date.parse(val) > Date.now() || 'Date should be in the future',

                    startDateShouldBeSmaller: val => {
                        return !this.grantInfo.endDate
                            || Date.parse(val) < Date.parse(this.grantInfo.endDate)
                            || 'Start date should be smaller than end date';
                    },

                    endDateShouldBeGreater: val => {
                        return !this.grantInfo.startDate
                            || Date.parse(val) > Date.parse(this.grantInfo.startDate)
                            || 'End date should be greater than start date';
                    },
                },
            }
        },

        methods: {
            finish() {
                this.$emit('finish');
            },
            prevStep() {
                this.$emit('decStep');
            },
            setDateFrom(date) {
                this.grantInfo.startDate = date;
            },
            setDateTo(date) {
                this.grantInfo.endDate = date;
            }
        },

        created() {
            const startDate = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm');
            this.setDateFrom(startDate);
        }
    };
</script>

<style lang="less" scoped>
    .discipline-conditions {
        max-width: 800px;
    }
</style>
