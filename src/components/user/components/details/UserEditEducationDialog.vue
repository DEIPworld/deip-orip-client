<template>
    <v-dialog v-model="isShown.value" persistent transition="scale-transition">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click.native="isShown.value = false">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Add education</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>

            <div class="column-page">
                <div class="content-column">
                    <div class="filling">

                        <div class="subheading bold">School</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="School"
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
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Area of study</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Area of study"
                                ></v-text-field>
                            </div>
                        </div>

                        <div class="subheading bold">Description (optional)</div>
                        <div class="row">
                            <div class="col-12">
                                <v-text-field
                                    placeholder="Description"
                                ></v-text-field>
                            </div>
                        </div>
                        
                        <div>
                            <v-btn class="ma-0 width-10" color="primary" @click="">Save</v-btn>
                            <span class="c-pr-4"></span>
                            <v-btn class="ma-0" color="primary" flat @click="">Cancel</v-btn>
                        </div>

                    </div>
                </div>
            </div>

        </v-card>
    </v-dialog>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "UserEditEducationDialog",
        props: {
            isShown: { type: Object, required: true }
        },
        data() { 
            return {
                dateFrom: undefined,
                dateFromMenu: false,
                dateTo: undefined,
                dateToMenu: false
            }
        },
        watch: {
            'isShown.value': function(value) {
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
