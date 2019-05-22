<template>
    <div>
        <div v-if="!isAsc" class="subheading clickable" 
            :class="[{'underlined': isSelected }]"
            @click.stop="select(order.asc)">
            {{ order.asc.title }}
        </div>
        <div v-if="isAsc" class="subheading clickable" 
            :class="[{'underlined': isSelected }]"
            @click.stop="select(order.desc)">
            {{ order.desc.title }}
        </div>
    </div>
</template>

<script>
    export default {
        name: "ResearchFeedOrderByItem",
        data() {
            return {
                isAsc: this.order.default === 'asc'
            }
        },
        props: {
            order: Object,
            position : Number,
            isSelected: Boolean
        },
        methods: {
            select(item) {
                this.isAsc = item.order[0] === 'asc';
                this.$emit('onSelect', { orderAscOrDesc: item, position: this.position});
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
