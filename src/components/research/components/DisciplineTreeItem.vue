<template>
    <div :class="[!discipline.isTop ? 'pt-1 pl-3' : '']">
        <div class="clickable-label bold" 
            v-if="!discipline.isTop" 
            @click="select(discipline.path)"
            :class="[{'selected': isSelected}]"
        >{{ discipline.label }}</div>
        
        <div v-if="discipline.children" v-show="isExpanded">
            <div v-for="(val, key) in discipline.children" :key="key">
                <discipline-tree-item
                    :discipline="val"
                    :selectedPath="selectedPath"
                    @update="select"
                ></discipline-tree-item>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "DisciplineTreeItem",
        props: {
            discipline: Object,
            selectedPath: String
        },
        methods: {
            select(value) {
                this.$emit('update', value);
            }
        },
        computed: {
            isSelected() {
                return this.selectedPath === this.discipline.path;
            },
            isExpanded() {
                return _.startsWith(this.selectedPath, this.discipline.path) || this.discipline.isTop;
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
