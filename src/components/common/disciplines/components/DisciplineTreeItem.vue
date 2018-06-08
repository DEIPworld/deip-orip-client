<template>
    <div :class="[!discipline.isTop ? 'pt-1 pl-3' : '']">
        <span class="deip-label" 
            v-if="!discipline.isTop" 
            @click="select(discipline)"
            :class="[{'selected': isSelected}]"
        >{{ discipline.label }}</span>
        
        <div v-if="discipline.children" v-show="isExpanded">
            <div v-for="(val, key) in discipline.children" :key="key">
                <discipline-tree-item
                    :discipline="val"
                    :selected="selected"
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
            discipline: {type: Object, required: true},
            selected: {type: Array, required: true}
        },
        methods: {
            select(discipline) {
                this.$emit('update', discipline);
            }
        },
        computed: {
            isSelected() {
                return this.selected.some(d => d.id == this.discipline.id);
            },
            isExpanded() {
                return this.selected.some(d => d.id == this.discipline.id) || this.discipline.isTop;
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
