<template>
    <div :class="[!discipline.isTop ? 'pt-1 pl-3' : '']">
        <span class="deip-label" 
            v-if="!discipline.isTop" 
            @click="select(discipline)"
            :class="[{ 'selected': isSelected || isHighlighted }]"
        >{{ discipline.label }}</span>
        
        <div v-if="discipline.children" v-show="isExpanded">
            <div v-for="(val, key) in discipline.children" :key="key">
                <discipline-tree-item
                    :discipline="val"
                    :selected="selected"
                    :is-multiple-select="isMultipleSelect"
                    :is-highlighted-parent="isHighlightedParent"
                    @update="select"
                ></discipline-tree-item>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';

    // todo: make single and multiselect handled by arrays bc it will be easier and more readable
    export default {
        name: "DisciplineTreeItem",
        
        props: {
            discipline: { type: Object, required: true },
            isMultipleSelect: { type: Boolean, required: false, default: true },
            isHighlightedParent: { type: Boolean, required: false, default: false },

            selected: { 
                validator(value) {
                    return value === undefined || typeof value === 'array' || typeof value === 'object';
                }, 
                required: true 
            },
        },

        methods: {
            select(discipline) {
                this.$emit('update', discipline);
            }
        },

        computed: {
            isSelected() {
                return this.isMultipleSelect 
                    ? this.selected.some(d => d.id == this.discipline.id) 
                    : this.selected && this.selected.id === this.discipline.id;
            },
            isExpanded() {
                return this.isSelected 
                    || this.discipline.isTop 
                    || !this.isMultipleSelect && this.selected && _.startsWith(this.selected.path, this.discipline.path);
            },
            isHighlighted() {
                return !this.isMultipleSelect
                    && this.isHighlightedParent
                    && this.selected
                    && _.startsWith(this.selected.path, this.discipline.path);
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
