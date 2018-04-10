<template>
    <div class="subheading clickable" 
        :class="[{'deip-blue-color underlined': label === selected }]"
        @click.stop="activateLabel()"
    >{{ label.title }}</div>
</template>

<script>
    export default {
        name: "ResearchFeedSortByItem",
        props: {
            label: Object,
            selected: Object
        },
        methods: {
            activateLabel() {
                this.$emit('update', this.label);
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
