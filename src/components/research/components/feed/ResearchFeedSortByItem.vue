<template>
    <div class="subheading clickable" 
        :class="[{'deip-blue-color underlined': label.key === selectedKey }]"
        @click.stop="activateLabel()"
    >{{ label.title }}</div>
</template>

<script>
    export default {
        name: "ResearchFeedSortByItem",
        props: {
            label: Object,
            selectedKey: String
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
