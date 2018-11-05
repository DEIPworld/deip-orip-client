<template>
    <div>
        <v-text-field
            label="Search..."
            single-line
            append-icon="search"
            @input="querySearch"
            hide-details
            :value="filter.q"
        ></v-text-field>

        <div class="c-pv-4">
            <div class="subheading c-pb-4">Disciplines</div>
            <discipline-tree-picker :preselected="filter.disciplines" @select="filterDisciplines"></discipline-tree-picker>
        </div>

        <!-- <div>
            <v-divider></v-divider>

            <div class="c-pt-6 half-bold">Author</div>

            <div class="c-pt-4 row-nowrap align-center">
                <div class="half-bold">Year:from</div>
                <div class="date-picker c-ml-2">
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
                </div>
                <div class="half-bold c-ml-2">to</div>
                <div class="date-picker c-ml-2">
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
                </div>
            </div>
            <div class="c-pt-4 row align-center">
                <div class="half-bold">Finished</div>
                <div class="c-ml-2">
                    <v-checkbox v-model="isFinished" hide-details color="green darken-3"></v-checkbox>
                </div>
            </div>
            <div class="c-pt-4 half-bold">Content Type</div>
        </div> -->
    </div>
</template>

<script>

    import _ from 'lodash';
    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchFeedFilter",
        computed: {
            ...mapGetters({
                filter: 'feed/filter'
            })
        },
        methods: {
            filterDisciplines(disciplines) {
                this.$store.dispatch('feed/updateFilter', { key: 'disciplines', value: disciplines });
            },
            querySearch(value) {
                this.$store.dispatch('feed/updateFilter', {key: 'q', value: value});
            }
        }
    };
</script>

<style lang="less" scoped>
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
