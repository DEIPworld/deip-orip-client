<template>
    <page-container>
        <sidebar>
            <research-feed-filter></research-feed-filter>
        </sidebar>

        <contentbar>
            <div class="row-nowrap">
                <div :class="{ 'invisible': !filter.disciplines.length && filter.q === '' }"
                    class="filter-title subheading grey--text"
                >My choise</div>

                <div class="row col-grow align-center">
                    <div class="c-pr-4 display-flex" v-if="filter.q !== ''">
                        <span>{{ filter.q }}</span>
                        <span class="small-remove-btn ml-1" @click="updateFilter({ key: 'q', value: '' })">
                            <v-icon>close</v-icon>
                        </span>
                    </div>

                    <div v-for="discipline in filter.disciplines" class="c-pr-4 display-flex">
                        <span>{{ discipline.label }}</span>
                        <span v-if="!hasSelectedChildDiscipline(discipline)" class="small-remove-btn ml-1" 
                                @click="updateFilter({
                                    key: 'disciplines', 
                                    value: filter.disciplines.filter(d => { return d.id != discipline.id })
                                })">
                            <v-icon>close</v-icon>
                        </span>
                    </div>
                </div>
            </div>
            
            <v-flex class="c-pt-6">
                <research-feed-order-by></research-feed-order-by>
            </v-flex>

            <div class="row justify-between align-end c-pt-10">
                <div class="title">Search Results: {{ researchFeed.length }}</div>
                <div class="list-state-label half-bold" @click.stop="toggleFeed()">
                    <span v-show="!allCollapsed">Collapse all</span>
                    <span v-show="allCollapsed">Expand all</span>
                </div>
            </div>

            <div class="c-pt-6 feed-items-container spinner-container">
                <v-progress-circular class="section-spinner"
                    v-if="isLoadingResearchFeed"
                    :size="100" indeterminate
                    color="primary"
                ></v-progress-circular>
                
                <v-card v-if="isLoadingResearchFeed === false" class="hidden-last-child">
                    <template v-for="item in researchFeed">
                        <research-feed-list-item :research="item"></research-feed-list-item>
                        <v-divider></v-divider>
                    </template> 
                </v-card>
            </div>
        </contentbar>
    </page-container>
</template>

<script>

    import { mapGetters } from 'vuex';
    import _ from 'lodash';

    export default {
        name: "ResearchFeed",
        computed: {
            ...mapGetters({
                researchFeed: 'feed/researchFeed',
                filter: 'feed/filter',
                allCollapsed: 'feed/allCollapsed',
                isLoadingResearchFeed: 'feed/isLoadingResearchFeed'
            })
        },
        methods: {
            toggleFeed() {
                this.$store.dispatch('feed/toggleFeed')
            },
            updateFilter(condition) {
                this.$store.dispatch('feed/updateFilter', condition)
            },
            hasSelectedChildDiscipline(node){
                return this.$store.getters['feed/hasSelectedChildDiscipline'](node)
            }
        },
        created() {
            this.$store.dispatch('feed/loadAllResearches')
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
    .feed-items-container {
        min-height: 400px
    }
</style>
