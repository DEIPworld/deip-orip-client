<template>
    <div class="row-nowrap">
        <div class="filter-title subheading grey--text">Sort by</div>
        <div class="row">
            <div class="pr-4 sort-label" v-for="(label, index) in labels" :key="index">
                <research-feed-sort-by-item 
                    :selected="activeLabel" 
                    :label="label" @update="onActivate"
                ></research-feed-sort-by-item>
            </div>
        </div>
    </div>
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
        text-transform: uppercase;
        width: 120px;
    }
</style>
