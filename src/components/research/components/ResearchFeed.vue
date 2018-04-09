<template>
    <v-container fluid fill-height class="pa-0" style="align-items: stretch;">
        <v-card width="300px" class="c-ph-6 c-pb-10 c-pt-6">
            <research-feed-filter></research-feed-filter>
        </v-card>

        <div class="c-p-10 col-grow">
            <div class="row-nowrap">
                <div class="filter-title">My Choise</div>
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
                <div class="sm-title bold deip-blue-color">Search Results: 108</div>
                <div class="list-state-label" @click.stop="isCollapsed = !isCollapsed">
                    <span v-show="!isCollapsed">Collapse all</span>
                    <span v-show="isCollapsed">Expand all</span>
                </div>
            </div>

            <div class="c-pt-6">
                <v-card>
                    <research-list-item :is-collapsed="isCollapsed"></research-list-item>
                    <v-divider></v-divider>
                    <research-list-item :is-collapsed="isCollapsed"></research-list-item>
                    <v-divider></v-divider>
                    <research-list-item :is-collapsed="isCollapsed"></research-list-item>
                </v-card>
            </div>

        </div>
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
