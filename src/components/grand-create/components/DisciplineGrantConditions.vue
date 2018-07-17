<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Discipline supply grant</div>
            <div class="sm-title bold c-mb-4 text-align-center">Please define conditions</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height discipline-conditions">
                    <div class="subheading bold">Dates attended</div>

                    <div class="row">
                        <div class="col-6 c-pr-3">
                            <datetime-picker
                                label="From"
                                :datetime="dateFrom"
                                @input="setDateFrom"
                            ></datetime-picker>
                        </div>
                        
                        <div class="col-6 c-pl-3">
                            <datetime-picker
                                label="To"
                                :datetime="dateTo"
                                @input="setDateTo"
                            ></datetime-picker>
                        </div>
                    </div>

                    <div class="c-pt-4 subheading bold">Description (optional)</div>

                    <v-text-field v-model="grantInfo.description" multi-line rows="2" auto-grow></v-text-field>
                </div>

            </div>
        </div>

        <div class="row justify-center align-center">
            <v-btn flat small @click.native="prevStep()">
                <v-icon dark class="pr-1">keyboard_arrow_left</v-icon> Back
            </v-btn>
            
            <v-btn color="primary" 
                @click.native="finish()" 
                :disabled="!dateFrom || !dateTo"
            >Give grant</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DisciplineGrantConditions",

        props: {
            grantInfo: { type: Object, required: true }
        },

        methods: {
            finish() {
                this.$emit('finish');
            },
            prevStep() {
                this.$emit('decStep');
            },
            setDateFrom(date) {
                this.dateFrom = date;
            },
            setDateTo(date) {
                this.dateTo = date;
            }
        },

        data() {
            return {
                dateFrom: undefined,
                dateTo: undefined,

                rules: {
                    required: value => !!value || 'This field is required'
                },
            }
        }
    };
</script>

<style lang="less" scoped>
    .discipline-conditions {
        max-width: 800px;
    }
</style>
