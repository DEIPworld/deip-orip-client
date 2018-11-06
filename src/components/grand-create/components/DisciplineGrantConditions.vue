<template>
    <div class="column full-height">
        <div class="c-mb-4 col-grow column">
            <div class="step-title">Discipline supply grant</div>

            <div class="col-grow overflow-y-auto">

                <div class="c-mh-auto full-height discipline-conditions">
                    <div class="subheading bold">Dates attended</div>

                    <div class="row">
                        <div class="col-6 c-pr-3">
                            <datetime-picker
                                label="From"
                                :datetime="grantInfo.startDate"
                                @input="setDateFrom"
                            ></datetime-picker>
                        </div>
                        
                        <div class="col-6 c-pl-3">
                            <datetime-picker
                                label="To"
                                :datetime="grantInfo.endDate"
                                @input="setDateTo"
                            ></datetime-picker>
                        </div>
                    </div>

                    <div class="c-pt-4 subheading bold">Description 
                        <span class="caption">(optional)</span>
                    </div>

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
                :disabled="!grantInfo.startDate || !grantInfo.endDate || !grantInfo.description || isLoading"
                :loading="isLoading"
            >Give grant</v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DisciplineGrantConditions",

        props: {
            grantInfo: { type: Object, required: true },
            isLoading: { type: Boolean, required: true }
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

        data() {
            return {
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
