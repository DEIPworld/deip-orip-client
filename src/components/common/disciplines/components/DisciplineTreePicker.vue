<template>
    <div>
        <discipline-tree-item
            :discipline="tree"
            :selected="selected"
            :is-multiple-select="isMultipleSelect"
            @update="selectDiscipline"
        ></discipline-tree-item>
    </div>
</template>

<script>
    import { disciplineTree, getNodeById } from './../DisciplineTreeService';
    import _ from 'lodash';

    const mapExternalDisciplines = (selected, isMultipleSelect) => 
        isMultipleSelect
            ? selected.map(d => {
                    return { id: d.id, label: d.label, path: d.path };
                })
            : { id: selected.id, label: selected.label, path: selected.path };

    // todo: make single and multiselect handled by arrays bc it will be easier and more readable
    export default {
        name: "DisciplineTreePicker",

        props: {
            preselected: { 
                validator(value) {
                    return value === undefined || typeof value === 'array' || typeof value === 'object';
                },
                required: false
            },
            isMultipleSelect: { type: Boolean, required: false, default: true }
        },

        methods: {
            selectDiscipline(picked) {
                if (this.isMultipleSelect) {
                    if (this.selected.some(d => d.id == picked.id)){
                        // parent can't be unselected if any of his child is selected
                        const filterOut = picked.children ? this.selected.find(d => {
                            const parts = d.path.split('.');
                            return d.id != picked.id && parts.some(p => p == picked.path);
                        }) === undefined : true;

                        if (filterOut) {
                            this.selected = this.selected.filter(d => d.id != picked.id);
                        }
                    } else {
                        this.selected.push(picked);
                    }
                } else {
                    this.selected = picked;
                }
                
                this.$emit('select', mapExternalDisciplines(this.selected, this.isMultipleSelect));
            }
        },

        watch: {
            preselected(preselected) {
                this.selected = mapExternalDisciplines(preselected, this.isMultipleSelect);
            }
        },

        data() {
            return {
                tree: disciplineTree,
                selected: undefined
            };
        },

        created() {
            if (this.isMultipleSelect) {
                this.selected = !_.isEmpty(this.preselected)
                    ? mapExternalDisciplines(this.preselected, this.isMultipleSelect) 
                    : [];
            } else {
                this.selected = this.preselected
                    ? mapExternalDisciplines(this.preselected, this.isMultipleSelect)
                    : undefined;
            }
        }
    };
</script>

<style lang="less" scoped>
</style>
