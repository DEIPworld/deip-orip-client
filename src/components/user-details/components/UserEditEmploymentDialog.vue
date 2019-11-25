<template>
        <v-dialog v-model="meta.isShown" persistent transition="scale-transition" max-width="600px">
            <v-card class="pa-4">
                <v-card-title>
                    <v-layout row align-center align-baseline>
                      <v-flex grow class="headline">
                        Employment
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
                        <div class="subheading bold">Company</div>
                        <div class="legacy-row">
                            <div class="legacy-col-12">
                                <v-text-field
                                    label="Company"
                                    v-model="company"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Location</div>
                        <div class="legacy-row">
                            <div class="legacy-col-6 c-pr-3">
                                <v-text-field
                                    label="City"
                                    v-model="city"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </div>
                            <div class="legacy-col-6 c-pl-3">
                                <v-text-field
                                    label="Country"
                                    v-model="country"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Period</div>
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
                                    <v-text-field slot="activator" label="From" 
                                        ref="dateFromInput"
                                        v-model="dateFrom"
                                        append-icon="event"
                                        :rules="[
                                            rules.required,
                                            rules.startDateValidation
                                        ]"
                                        readonly></v-text-field>
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
                                label="Is present"
                                :input-value="isActive"
                                hide-details
                                style="max-width: 125px"
                                @click="changeIsActive()"
                            ></v-checkbox>
                        </div>

                        <div class="subheading bold">Position</div>
                        <div class="legacy-row">
                            <div class="legacy-col-12">
                                <v-text-field
                                    label="Position"
                                    v-model="position"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Description  
                            <span class="caption grey--text">(optional)</span>
                        </div>
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
        name: "UserEditEmploymentDialog",
        props: {
            meta: { type: Object, required: true }
        },
        data() { 
            return {
                company: undefined,
                city: undefined,
                country: undefined,
                dateFrom: undefined,
                dateFromMenu: false,
                dateTo: undefined,
                dateToMenu: false,
                position: undefined,
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
        methods: {
            changeIsActive() {
                this.isActive = !this.isActive;

                if (this.isActive) {
                    this.dateTo = undefined;
                }

                this.$refs.dateToInput.validate();
            },
            save() {
                this.$emit('saveEmployment', { 
                    item: {
                        company: this.company,
                        location: {
                            city: this.city,
                            country: this.country
                        },
                        period: {
                            from: this.dateFrom,
                            to: this.dateTo
                        },
                        position: this.position,
                        description: this.description,
                        isActive: this.isActive
                    }, 
                    index: this.meta.index
                })

                this.company = undefined;
                this.city = undefined;
                this.country = undefined;
                this.dateFrom = undefined;
                this.dateFromMenu = false;
                this.dateTo = undefined;
                this.dateToMenu = false;
                this.position = undefined;
                this.description = undefined;
                this.isActive = false;
            }
        },

        computed: {
            disabled() {
                return !this.isFormValid;
            },
        },
        watch: {
            'meta.item': function(employment) {
                this.company = employment != null ? employment.company : undefined;
                this.city = employment != null && employment.location ? employment.location.city : undefined;
                this.country = employment != null && employment.location ? employment.location.country : undefined;
                this.dateFrom = employment != null ? moment(employment.period.from).format('YYYY-MM') : undefined;
                this.dateFromMenu = false;
                this.dateTo = employment != null ? moment(employment.period.to).format('YYYY-MM') : undefined;
                this.dateToMenu = false;
                this.position = employment != null ? employment.position : undefined;
                this.description = employment != null ? employment.description : undefined;
                this.isActive = employment != null ? employment.isActive : false;
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
