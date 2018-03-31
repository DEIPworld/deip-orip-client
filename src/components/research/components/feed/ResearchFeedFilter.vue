<template>
    <div class="full-width">
        <v-text-field
            name="searchResearchList"
            label="Search..."
            single-line
            append-icon="search"
        ></v-text-field>

        <div class="font-18px bold deip-blue-color">Filters Setup</div>
        <div class="py-3">
            <div class="deip-blue-color font-16px pb-2">Discipline</div>
            <discipline-tree-picker></discipline-tree-picker>
        </div>
        <v-divider></v-divider>

        <div class="pt-3 bold">Author</div>

        <div>
            <v-layout class="pt-3" row align-center>
                <v-flex shrink class="bold">Year:from</v-flex>
                <v-flex class="date-picker ml-2">
                    <v-menu
                        ref="menuFrom"
                        lazy
                        :close-on-content-click="false"
                        v-model="menuFrom"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                        :return-value.sync="dateFrom"
                    >
                        <v-text-field slot="activator" width="95px" 
                            v-model="dateFrom" readonly solo 
                            class="textfield-low"
                        ></v-text-field>
                        <v-date-picker type="month" v-model="dateFrom" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menuFrom = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menuFrom.save(dateFrom)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-flex>
                <v-flex shrink class="bold ml-2">to</v-flex>
                <v-flex class="date-picker ml-2">
                    <v-menu
                        ref="menuTo"
                        lazy
                        :close-on-content-click="false"
                        v-model="menuTo"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                        :return-value.sync="dateTo"
                    >
                        <v-text-field slot="activator" width="95px" 
                            v-model="dateTo" readonly solo 
                            class="textfield-low"
                        ></v-text-field>
                        <v-date-picker type="month" v-model="dateTo" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menuTo = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.menuTo.save(dateTo)">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                </v-flex>
            </v-layout>
        </div>
        <div>
            <v-layout class="pt-3" row align-center>
                <v-flex shrink class="bold">Finished</v-flex>
                <v-flex shrink class="ml-2">
                    <v-checkbox v-model="checkbox" hide-details color="green darken-3"></v-checkbox>
                </v-flex>
            </v-layout>
        </div>
        <div class="pt-3 bold">Content Type</div>
    </div>
</template>

<script>
    export default {
        name: "ResearchFeedFilter",
        data() {
            return {
                dateFrom: null,
                menuFrom: false,
                dateTo: null,
                menuTo: false,
                checkbox: false
            };
        }
    };
</script>

<style lang="less">
    .input-group.input-group--text-field.textfield-low {
        min-height: initial;

        & .input-group__input {
            padding: 0px 5px;
        }
    }
    .date-picker {
        max-width: 70px;
    }
</style>
