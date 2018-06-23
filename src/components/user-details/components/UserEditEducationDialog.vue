<template>
    <v-dialog v-model="meta.isShown" persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click.native="meta.isShown = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Add education</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <div class="column-page">
                <div class="content-column">
                    <div class="filling">

                        <div class="subheading bold">Educational Institution</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Educational Institution"
                                    v-model="educationalInstitution"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Dates Attended</div>
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

                        <div class="subheading bold">Degree</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Degree"
                                    v-model="degree"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Area of study</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Area of study"
                                    v-model="area"
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
                        
                        <div>
                            <v-btn class="ma-0 width-10" color="primary" @click="save()" :disabled="disabled">Save</v-btn>
                            <span class="c-pr-4"></span>
                            <v-btn class="ma-0" color="primary" flat @click.native="meta.isShown = false">Cancel</v-btn>
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
                description: undefined
            }
        },
        computed: {
            disabled() {
                return !this.educationalInstitution || !this.dateFrom || !this.dateTo || !this.degree || !this.area;
            }
        },
        methods: {
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
                        description: this.description
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
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
