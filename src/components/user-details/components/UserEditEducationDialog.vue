<template>
    <v-dialog v-model="meta.isShown" persistent transition="scale-transition" max-width="600px">
        <v-card class="pa-4">
            <v-card-title>
                <v-layout row align-center align-baseline>
                    <v-flex grow class="headline">
                    Education
                    </v-flex>
                    <v-flex shrink align-self-center>
                    <v-btn @click.native="meta.isShown = false" icon class="pa-0 ma-0">
                        <v-icon color="black">close</v-icon>
                    </v-btn>
                    </v-flex>
                </v-layout>
            </v-card-title>

            <v-card-text>
                    <v-form v-model="isFormValid" ref="form">
                        <div class="subheading bold">Educational institution</div>
                        <div class="legacy-row">
                            <div class="legacy-col-12">
                                <v-text-field
                                    label="Educational institution"
                                    v-model="educationalInstitution"
                                    :rules="[ rules.required ]"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Dates attended</div>
                        <div class="legacy-row">
                            <div class="legacy-col-5 c-pr-3">
                                <v-menu
                                    lazy
                                    :close-on-content-click="false"
                                    v-model="dateFromMenu"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <v-text-field
                                        ref="dateFromInput"
                                        slot="activator"
                                        label="From"
                                        v-model="dateFrom"
                                        append-icon="event"
                                        readonly
                                        :rules="[
                                            rules.required,
                                            rules.startDateValidation
                                        ]"
                                    ></v-text-field>
                                    <v-date-picker v-model="dateFrom" @input="dateFromMenu = false" type="month"></v-date-picker>
                                </v-menu>
                            </div>

                            <div class="legacy-col-5 c-pl-3">
                                <v-menu
                                    lazy
                                    :close-on-content-click="false"
                                    v-model="dateToMenu"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                    :disabled="isActive"
                                >
                                    <v-text-field slot="activator"
                                        ref="dateToInput"
                                        label="To"
                                        v-model="dateTo"
                                        append-icon="event"
                                        :disabled="isActive"
                                        :rules="[
                                            rules.requiredDateTo,
                                            rules.endDateValidation
                                        ]"
                                        readonly
                                    ></v-text-field>
                                    
                                    <v-date-picker v-model="dateTo" @input="dateToMenu = false" type="month"></v-date-picker>
                                </v-menu>
                            </div>
                        </div>

                        <div class="legacy-row pb-3">
                            <v-checkbox class="ma-0 pa-0"
                                label="In progress"
                                :input-value="isActive"
                                hide-details
                                style="max-width: 140px"
                                @click="changeIsActive()"
                            ></v-checkbox>
                        </div>

                        <div class="subheading bold">Degree obtained</div>
                        <div class="legacy-row">
                            <div class="legacy-col-12">
                                <v-text-field
                                    label="Degree obtained"
                                    v-model="degree"
                                    :rules="[ rules.required ]"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Area of study</div>
                        <div class="legacy-row">
                            <div class="legacy-col-12">
                                <v-text-field
                                    label="Area of study"
                                    v-model="area"
                                    :rules="[ rules.required ]"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Description <span class="caption grey--text">(optional)</span></div>
                        <div class="legacy-row">
                            <div class="legacy-col-12">
                                <v-textarea
                                    :rows="2"
                                    auto-grow
                                    label="Description"
                                    v-model="description"
                                ></v-textarea>
                            </div>
                        </div>
                        
                        <div>
                            <v-layout>
                                <v-spacer></v-spacer>
                                <v-btn class="ma-0 width-10" color="black" flat @click.native="meta.isShown = false">Cancel</v-btn>
                                <v-btn class="ma-0 width-10" color="primary" @click="save()" :disabled="disabled">Save</v-btn>
                            </v-layout>
                        </div>
                    </v-form>
            </v-card-text>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';
    import moment from 'moment';

    export default {
        name: "UserEditEducationDialog",
        props: {
            meta: { type: Object, required: true }
        },
        data() { 
            return {
                educationalInstitution: undefined,
                dateFrom: undefined,
                dateFromMenu: false,
                dateTo: undefined,
                dateToMenu: false,
                degree: undefined,
                area: undefined,
                description: undefined,
                isActive: false,

                isFormValid: false,

                rules: {
                    required: value => !!value || 'This field is required',
                    requiredDateTo: value => this.isActive || !!value || 'This field is required',
                    startDateValidation: value => {
                        if (!value || !this.dateTo) {
                            return true;
                        }

                        return Date.parse(value) < Date.parse(this.dateTo) ? true : 'Start date should be smaller than end date';
                    },
                    endDateValidation: value => {
                        if (!value || !this.dateFrom) {
                            return true;
                        }

                        return Date.parse(value) > Date.parse(this.dateFrom) ? true : 'End date should be greater than start date';
                    },
                }
            }
        },
        computed: {
            disabled() {
                return !this.isFormValid;
            }
        },
        methods: {
            changeIsActive() {
                this.isActive = !this.isActive;

                if (this.isActive) {
                    this.dateTo = undefined;
                }

                this.$refs.dateToInput.validate();
            },
            save() {
                this.$emit('saveEducation', { 
                    item: {
                        educationalInstitution: this.educationalInstitution,
                        period: {
                            from: this.dateFrom,
                            to: this.dateTo
                        },
                        degree: this.degree,
                        area: this.area,
                        description: this.description,
                        isActive: this.isActive
                    }, 
                    index: this.meta.index
                })

                this.educationalInstitution = undefined;
                this.dateFrom = undefined;
                this.dateFromMenu = false;
                this.dateTo = undefined;
                this.dateToMenu = false;
                this.degree = undefined;
                this.area = undefined;
                this.description = undefined;
                this.isActive = false;
            }
        },
        watch: {
            'meta.item': function(education) {
                this.educationalInstitution = education != null ? education.educationalInstitution : undefined;
                this.dateFrom = education != null ? moment(education.period.from).format('YYYY-MM') : undefined;
                this.dateFromMenu = false;
                this.dateTo = education != null ? moment(education.period.to).format('YYYY-MM') : undefined;
                this.dateToMenu = false;
                this.degree = education != null ? education.degree : undefined;
                this.area = education != null ? education.area : undefined;
                this.description = education != null ? education.description : undefined;
                this.isActive = education != null ? education.isActive : false;
            }
        }
    };
</script>

<style lang="less" scoped>
    
</style>
