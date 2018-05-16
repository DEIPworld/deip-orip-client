<template>
    <v-container fluid fill-height class="pa-0 column-page">
        <v-card height="100%" class="sidebar">
            <research-feed-filter :filter="filter" @update="updateSelection"></research-feed-filter>
        </v-card>

        <div class="content-column">
            <div class="filling">
                <div class="row-nowrap">
                    <div class="filter-title subheading grey--text">My Choise</div>
                    <div class="row col-grow align-center">
                        <div class="c-pr-4 display-flex" v-if="filter.q !== ''">
                            <span>{{ filter.q }}</span>
                            <span class="small-remove-btn ml-1" @click="resetFilter({ key: 'q', value: '' })">
                                <v-icon>close</v-icon>
                            </span>
                        </div>
                        <div class="c-pr-4 display-flex" v-if="filter.discipline">
                            <span>{{ filter.discipline.label }}</span>
                            <span class="small-remove-btn ml-1" @click="resetFilter({ key: 'discipline', value: undefined })">
                                <v-icon>close</v-icon>
                            </span>
                        </div>
                    </div>
                </div>
                
                <v-flex class="c-pt-6">
                    <research-feed-sort-by :filter="filter" @update="updateSelection"></research-feed-sort-by>
                </v-flex>

                <div class="row justify-between align-end c-pt-10">
                    <div class="title">Search Results: {{ researchList.length }}</div>
                    <div class="list-state-label half-bold" @click.stop="changeViewMode()">
                        <span v-show="!areAllCollapsed">Collapse all</span>
                        <span v-show="areAllCollapsed">Expand all</span>
                    </div>
                </div>

                <div class="c-pt-6">
                    <v-card class="hidden-last-child">
                        <template v-for="item in researchList">
                            <research-list-item :is-collapsable="true" :research="item"></research-list-item>
                            <v-divider></v-divider>
                        </template>
                    </v-card>
                </div>
            </div>
        </div>
    </v-container>   
</template>

<script>

    import deipRpc from '@deip/deip-rpc';
    import _ from 'lodash';

    export default {
        name: "ResearchFeed",
        data() { 
            return {
                researchList: [],
                fullResearchList: [],
                filter: {
                    discipline: undefined,
                    q: '',
                    sortBy: 'titleAsc'
                },

                sortIteratees: {
                    titleAsc: ['title'],
                    authorAsc: research => research.authors.join().toLowerCase(),
                    votes: ['total_votes']
                }
            } 
        },
        methods: {
            loadAllResearches() {
                const disciplineId = _.get(this.filter, 'discipline.id') || 0;

                deipRpc.api.getAllResearchesListingAsync(0, disciplineId)
                    .then(data => {
                        this.fullResearchList = _.each(data, (item, i) => { item.isCollapsed = true; });
                        this.getResearchListing();
                    });
            },
            getResearchListing(){
                let handler = _(this.fullResearchList);

                if (this.filter.q !== '') {
                    handler = handler.filter(research => 
                        _.startsWith(research.title.toLowerCase(), this.filter.q.toLowerCase())
                    );
                }

                if (this.filter.discipline) {
                    handler = handler.filter(research => 
                        _.find(research.disciplines, { id: this.filter.discipline.id }) !== undefined
                    );
                }

                this.researchList = handler
                    .sortBy(this.sortIteratees[this.filter.sortBy])
                    .value();
            },
            changeViewMode() {
                let value = !this.areAllCollapsed;
                this.researchList.forEach(item => { item.isCollapsed = value });
            },
            updateSelection() {
                this.getResearchListing();
            },
            resetFilter(option) {
                this.filter[option.key] = option.value;
                this.getResearchListing();
            }
        },
        computed: {
            areAllCollapsed() {
                return this.researchList.reduce((acc, item) => acc && item.isCollapsed, true);
            }
        },
        created() {
            this.loadAllResearches();
        }
    };
</script>

<style lang="less" scoped>
    .filter-title {
        text-transform: uppercase;
        width: 120px;
    }
    .list-state-label {
        cursor: pointer;
        opacity: 0.5;
        user-select: none;
        &:hover {
            opacity: 1;
        }
    }
</style>
