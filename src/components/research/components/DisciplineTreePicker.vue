<template>
    <div>
        <discipline-tree-item
            :discipline="tree"
            :selected="selected"
            @update="chooseSelectedDiscipline"
        ></discipline-tree-item>
    </div>
</template>

<script>
    import { disciplineTree, getNodeById } from '../services/DisciplineTreeService.js';

    export default {
        name: "DisciplineTreePicker",
        props: {
            preselected: { type: Array, required: false, default: () => [] }
        },
        methods: {
            chooseSelectedDiscipline(discipline) {
                
                if (this.selected.some(d => d.id == discipline.id)){
                    this.selected = this.selected.filter(d => d.id != discipline.id)
                } else {
                    this.selected.push(discipline)
                }
                
                this.$emit('select', this.selected.map(d => {
                    return { id: discipline.id, label: discipline.label, path: this.discipline.path }
                }));
            }
        },
        watch: {
            preselected: function(preselected) {
                this.selected = preselected.map(d => {
                    return { id: discipline.id, label: discipline.label, path: this.discipline.path }
                });
            }
        },
        data() {
            return {
                tree: disciplineTree,
                selected: this.preselected.length ? this.preselected.map(d => {
                    return { id: discipline.id, label: discipline.label, path: this.discipline.path }
                }) : []
            };
        }
    };
</script>

<style lang="less" scoped>
</style>
