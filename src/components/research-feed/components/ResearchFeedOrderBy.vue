<template>
    <div class="legacy-row-nowrap">
        <div class="filter-title subheading grey--text">Sort by</div>
        <div class="legacy-row">
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
                currentOrderIdx : 0,
                orders: [
                    // todo: by date when BC will send this data
                    {
                        default: 'asc',
                        asc: { title: 'Z-A Title',  iteratee: ['title'], order: ['asc']},
                        desc: { title: 'A-Z Title', iteratee: ['title'], order: ['desc']}
                    }, {
                        default: 'asc',
                        asc: { title: 'Reviews >', iteratee: (r) => r.reviews.length, order: ['asc']},
                        desc: { title: 'Reviews <', iteratee: (r) => r.reviews.length, order: ['desc']}
                    }, {
                        default: 'desc',
                        asc: { title: 'ECI >', iteratee: (r) => r.eci_per_discipline.reduce((acc, item) => acc + item[1], 0), order: ['asc']},
                        desc: { title: 'ECI <', iteratee: (r) => r.eci_per_discipline.reduce((acc, item) => acc + item[1], 0), order: ['desc']}
                    }
                ]
            } 
        },
        methods: {
            updateFilter({orderAscOrDesc, position}) {
                this.currentOrderIdx = position;
                this.$store.dispatch('feed/updateFilter', {key: 'orderBy', value: orderAscOrDesc})
            }
        },
        computed: {
        }
    };
</script>

<style lang="less" scoped>
    .filter-title {
        text-transform: uppercase;
        width: 120px;
    }
</style>
