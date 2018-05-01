<template>
    <div class="row-nowrap">
        <div class="filter-title subheading grey--text">Sort by</div>
        <div class="row">
            <div class="pr-4 sort-label" v-for="(label, index) in labels" :key="index">
                <research-feed-sort-by-item 
                    :selected-key="filter.sortBy" 
                    :label="label" @update="onActivate"
                ></research-feed-sort-by-item>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchFeedSortBy",
        props: {
            filter: { type: Object, required: true }
        },
        data() { 
            return {
                labels: [
                    // { key: 'date', title: 'Date'},
                    { key: 'titleAsc', title: 'A-Z Title'},
                    { key: 'authorAsc', title: 'A-Z Author'},
                    // { key: 'reviews', title: 'Reviews'},
                    { key: 'votes', title: 'Votes'},
                    // { key: 'citations', title: 'Citations'}
                ]
            } 
        },
        methods: {
            onActivate(item) {
                this.filter.sortBy = item.key;
                this.$emit('update');
            }
        }
    };
</script>

<style lang="less" scoped>
    .filter-title {
        text-transform: uppercase;
        width: 120px;
    }
</style>
