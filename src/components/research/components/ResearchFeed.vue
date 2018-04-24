<template>
    <v-container fluid fill-height class="pa-0 two-column-page">
        <v-card height="100%" class="sidebar">
            <research-feed-filter></research-feed-filter>
        </v-card>

        <div class="content-column">
            <div class="filling">
                <div class="row-nowrap">
                    <div class="filter-title subheading grey--text">My Choise</div>
                    <div class="row col-grow align-center">
                        <div class="c-pr-4 display-flex">
                            <span>Quantum Physics</span>
                            <span class="small-remove-btn ml-1">
                                <v-icon>close</v-icon>
                            </span>
                        </div>
                        <div class="c-pr-4 display-flex">
                            <span>2018</span>
                            <span class="small-remove-btn ml-1">
                                <v-icon>close</v-icon>
                            </span>
                        </div>
                    </div>
                </div>
                
                <v-flex class="c-pt-6">
                    <research-feed-sort-by></research-feed-sort-by>
                </v-flex>

                <div class="row justify-between align-end c-pt-10">
                    <div class="title">Search Results: 108</div>
                    <div class="list-state-label half-bold" @click.stop="changeViewMode()">
                        <span v-show="!areAllCollapsed">Collapse all</span>
                        <span v-show="areAllCollapsed">Expand all</span>
                    </div>
                </div>

                <div class="c-pt-6">
                    <v-card v-for="item in researchList">
                        <research-list-item :is-collapsed="isCollapsed[0]" :research="item"></research-list-item>
                        <v-divider></v-divider>
                    </v-card>
                </div>
            </div>
        </div>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchFeed",
        data() { 
            return {
                researchList: [],
                isCollapsed: [{ value: true }, { value: true }, { value: true }]
            } 
        },
        methods: {
            getResearchListing (){
                deipRpc.api.getResearchListingAsync(0, 100)
                    .then((data) => {
                        for (var i = 0; i < data.length; i++) {
                            var research = data[i];
                            this.researchList.push(research);
                        }
                })
            },
            changeViewMode() {
                let value = !this.areAllCollapsed;
                this.isCollapsed.forEach(item => { item.value = value });
            }
        },
        computed: {
            areAllCollapsed() {
                return this.isCollapsed.reduce((acc, item) => acc && item.value, true);
            }
        },
        created() {
            this.getResearchListing();
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
