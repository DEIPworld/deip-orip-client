<template>
    <v-dialog v-model="meta.isShown" persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click.native="meta.isShown = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Add Employment</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <div class="column-page">
                <div class="content-column">
                    <div class="filling">

                        <div class="subheading bold">Company</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Company"
                                    v-model="company"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Location</div>
                        <div class="row">
                            <div class="col-6 c-pr-3">
                                <v-text-field
                                    label="City"
                                    v-model="city"
                                ></v-text-field>
                            </div>
                            <div class="col-6 c-pl-3">
                                <v-text-field
                                    label="Country"
                                    v-model="country"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Period</div>
                        <div class="row">
                            <div class="col-6 c-pr-3">
                                <v-menu
                                    lazy
                                    :close-on-content-click="false"
                                    v-model="dateFromMenu"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <v-text-field slot="activator" label="From" v-model="dateFrom" append-icon="event" readonly></v-text-field>
                                    <v-date-picker v-model="dateFrom" @input="dateFromMenu = false" type="month"></v-date-picker>
                                </v-menu>
                            </div>
                            <div class="col-6 c-pl-3">
                                <v-menu
                                    lazy
                                    :close-on-content-click="false"
                                    v-model="dateToMenu"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                                >
                                    <v-text-field slot="activator" label="To" v-model="dateTo" append-icon="event" readonly></v-text-field>
                                    <v-date-picker v-model="dateTo" @input="dateToMenu = false" type="month"></v-date-picker>
                                </v-menu>
                            </div>
                        </div>

                        <div class="subheading bold">Position</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Position"
                                    v-model="position"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Description (optional)</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Description"
                                    v-model="description"
                                ></v-text-field>
                            </div>
                        </div>

                     <!--   <div>
                            <v-btn class="ma-0 width-10" color="primary" @click="save" :disabled="disabled">Save</v-btn>
                            <span class="c-pr-4"></span>
                            <v-btn class="ma-0" color="primary" flat @click.native="meta.isShown = false">Cancel</v-btn>
                        </div> -->

                        <div>
                            <div class="row">
                                <div class="col-1">
                                    <v-checkbox label="Is active" v-model="isActive"></v-checkbox>
                                </div>
                                <div class="col-11">
                                    <v-btn class="ml-5 ma-0 width-10" color="primary" @click="save()" :disabled="disabled">Save</v-btn>
                                    <span class="c-pr-4"></span>
                                    <v-btn class="ma-0 width-10" color="primary" flat @click.native="meta.isShown = false">Cancel</v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

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
                isActive: false
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
                return !this.company || !this.country || !this.city || !this.dateFrom || !this.dateTo || !this.position;
            }
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
