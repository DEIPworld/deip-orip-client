<template>
    <v-container fluid fill-height class="pa-0">
        <v-layout shrink class="d-block">
            <v-card width="300px" height="100%" class="px-4 pb-3">
                <research-feed-filter></research-feed-filter>
            </v-card>
        </v-layout>

        <v-layout class="d-block pa-4">
            <v-flex>
                <v-layout row>
                    <v-flex shrink class="py-1">
                        <div class="filter-title">My Choise</div>
                    </v-flex>
                    <v-layout row wrap>
                        
                        <v-layout class="pr-3 py-1" align-center shrink>
                            <span>Quantum Physics</span>
                            <span class="small-remove-btn ml-1">
                                <v-icon>close</v-icon>
                            </span>
                        </v-layout>
                        <v-layout class="pr-3 py-1" align-center shrink>
                            <span>2018</span>
                            <span class="small-remove-btn ml-1">
                                <v-icon>close</v-icon>
                            </span>
                        </v-layout>
                    </v-layout>
                </v-layout>
            </v-flex>
            
            <v-flex class="pt-3">
                <research-feed-sort-by></research-feed-sort-by>
            </v-flex>

            <v-flex class="pt-5">
                <v-layout row justify-space-between align-end>
                    <v-flex shrink>
                        <div class="font-18px bold deip-blue-color">Search Results: 108</div>
                    </v-flex>
                    <v-flex shrink>
                        <div class="list-state-label" @click.stop="isCollapsed = !isCollapsed">
                            <span v-show="!isCollapsed">Collapse all</span>
                            <span v-show="isCollapsed">Expand all</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex class="pt-3">
                <research-list :is-collapsed="isCollapsed"></research-list>
            </v-flex>

        </v-layout>
    </v-container>   
</template>

<script>
    export default {
        name: "ResearchFeed",
        data() { 
            return {
                isCollapsed: true
            } 
        }
    };
</script>

<style lang="less" scoped>
    .filter-title {
        font-size: 16px;
        text-transform: uppercase;
        width: 120px;
        color: #BDBDBD;
    }
    .list-state-label {
        cursor: pointer;
        font-size: 14px;
        opacity: 0.5;
        user-select: none;
        &:hover {
            opacity: 1;
        }
    }
</style>
