<template>
    <div>
        <discipline-tree-item
            :discipline="disciplineTree"
            :selectedPath="selectedPath"
            @update="chooseSelectedDiscipline"
        ></discipline-tree-item>
    </div>
</template>

<script>
    import { disciplineTree, getNodeById } from '../services/DisciplineTreeService.js';

    export default {
        name: "DisciplineTreePicker",
        props: {
            selected: Object
        },
        methods: {
            chooseSelectedDiscipline(discipline) {
                this.$emit('select', { 
                    id: discipline.id, 
                    label: discipline.label 
                });

                this.currentId = discipline.id;
                this.selectedPath = discipline.path;
            }
        },
        watch: {
            selected: function(discipline) {
                if (!discipline) {
                    this.currentId = undefined;
                    this.selectedPath = '';
                } else if (discipline.id !== this.currentId) {
                    const newSelectedNode = getNodeById(this.disciplineTree, discipline.id);
                    this.currentId = discipline.id;
                    this.selectedPath = newSelectedNode.path;
                }
            }
        },
        data() {
            return {
                currentId: undefined,
                selectedPath: '',
                disciplineTree: disciplineTree
            };
        }
    };
</script>

<style lang="less" scoped>
</style>
