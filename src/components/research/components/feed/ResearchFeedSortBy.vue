<template>
    <v-layout row>
        <v-flex shrink class="py-1">
            <div class="filter-title">Sort by</div>
        </v-flex>
        <v-flex shrink>
            <v-layout row wrap>
                <div class="pr-4 py-1 sort-label" v-for="(label, index) in labels" :key="index">
                    <research-feed-sort-by-item 
                        :selected="activeLabel" 
                        :label="label" @update="onActivate"
                    ></research-feed-sort-by-item>
                </div>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "ResearchFeedSortBy",
        data() { 
            return {
                activeLabel: undefined,
                labels: [
                    { key: 'date', title: 'Date'},
                    { key: 'titleDesc', title: 'A-Z Title'},
                    { key: 'authorDesc', title: 'A-Z Author'},
                    { key: 'reviews', title: 'Reviews'},
                    { key: 'votes', title: 'Votes'},
                    { key: 'citations', title: 'Citations'},
                    { key: 'reviews2', title: 'Reviews'}
                ]
            } 
        },
        methods: {
            onActivate(value) {
                this.activeLabel = value;
            }
        },
        created() {
            this.activeLabel = this.labels[0];
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
</style>
