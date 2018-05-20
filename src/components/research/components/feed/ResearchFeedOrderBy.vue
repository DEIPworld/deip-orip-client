<template>
    <div class="row-nowrap">
        <div class="filter-title subheading grey--text">Sort by</div>
        <div class="row">
            <div class="pr-4 sort-label" v-for="(order, index) in orders" :key="index">
                <research-feed-order-by-item
                        :position="index"
                        :order="order"
                        :isSelected="currentOrderIdx === index" 
                        @onSelect="updateFilter">
                </research-feed-order-by-item>
            </div>
        </div>
    </div>
</template>

<script>
    
    export default {
        name: "ResearchFeedOrderBy",
        data() { 
            return {
                currentOrderIdx : undefined,
                orders: [
                    {
                        default: 'asc',
                        asc: { title: 'A-Z Title',  iteratee: ['title'], order: ['asc']},
                        desc: { title: 'Z-A Title', iteratee: ['title'], order: ['desc']}
                    },
                    {
                        default: 'desc',
                        asc: { title: 'A-Z Author', iteratee: (r) => r.authors.join().toLowerCase(), order: ['asc']},
                        desc: { title: 'Z-A Author', iteratee: (r) => r.authors.join().toLowerCase(), order: ['desc']}
                    },
                    {
                        default: 'desc',
                        asc: { title: 'Votes <', iteratee: ['total_votes'], order: ['asc']},
                        desc: { title: 'Votes >', iteratee: ['total_votes'], order: ['desc']},
                    }
                ]
            } 
        },
        methods: {
            updateFilter({orderAscOrDesc, position}) {
                this.currentOrderIdx = position;
                this.$store.dispatch('updateFilter', {key: 'orderBy', value: orderAscOrDesc})
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
