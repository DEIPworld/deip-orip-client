<template>
        <v-dialog v-model="meta.isShown" persistent transition="scale-transition" max-width="600px">
            <v-card class="pa-4">
                <v-card-title>
                    <v-layout row align-center align-baseline>
                      <v-flex grow class="headline">
                        Employment
                      </v-flex>
                      <v-flex shrink align-self-center right-top-angle>
                        <v-btn @click.native="meta.isShown = false" icon class="pa-0 ma-0">
                            <v-icon color="black">close</v-icon>
                        </v-btn>
                      </v-flex>
                    </v-layout>
                </v-card-title>

                <v-card-text>
                    <v-form v-model="isFormValid" ref="form">
                        <div class="subheading font-weight-bold">Company</div>
                        <v-layout row>
                            <v-flex xs12>
                                <v-text-field
                                    label="Company"
                                    v-model="company"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <div class="subheading font-weight-bold">Location</div>
                        <v-layout row>
                            <v-flex xs6 pr-3>
                                <v-text-field
                                    label="City"
                                    v-model="city"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs6 pl-3>
                                <v-text-field
                                    label="Country"
                                    v-model="country"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <div class="subheading font-weight-bold">Period</div>
                        <v-layout row>
                            <v-flex xs5 pr-3>
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
                            </v-flex>

                            <v-flex xs5 pl-3>
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
                            </v-flex>
                        </v-layout>

                        <v-layout row pb-3>
                            <v-checkbox class="ma-0 pa-0"
                                label="Is present"
                                v-model="isActive"
                                hide-details
                                style="max-width: 125px"
                            ></v-checkbox>
                        </v-layout>

                        <div class="subheading font-weight-bold">Position</div>
                        <v-layout row>
                            <v-flex xs12>
                                <v-text-field
                                    label="Position"
                                    v-model="position"
                                    :rules="[rules.required]"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <div class="subheading font-weight-bold">Description  
                            <span class="caption grey--text">(optional)</span>
                        </div>
                        <v-layout row>
                            <v-flex xs12>
                                <v-textarea
                                    :rows="2"
                                    auto-grow
                                    label="Description"
                                    v-model="description"
                                ></v-textarea>
                            </v-flex>
                        </v-layout>
                        <div>
                            <v-layout row wrap>
                                <v-flex xs12 py-2>
                                    <v-btn class="ma-0" color="primary" block @click="save()" :disabled="disabled">Save</v-btn>
                                </v-flex>
                                <v-flex xs12 py-2>
                                    <v-btn class="ma-0" color="primary" block flat @click.native="meta.isShown = false">Cancel</v-btn>
                                </v-flex>
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
            },
            isActive(){
                if (this.isActive) {
                    this.dateTo = undefined;
                }

                this.$refs.dateToInput.validate();
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
