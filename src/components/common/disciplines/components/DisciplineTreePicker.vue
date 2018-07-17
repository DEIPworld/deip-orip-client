<template>
    <div>
        <discipline-tree-item
            :discipline="tree"
            :selected="selected"
            @update="selectDiscipline"
        ></discipline-tree-item>
    </div>
</template>

<script>
    import { disciplineTree, getNodeById } from './../DisciplineTreeService';

    const mapExternalDisciplines = disciplines => disciplines.map(d => {
        return { id: d.id, label: d.label, path: d.path };
    });

    export default {
        name: "DisciplineTreePicker",

        props: {
            preselected: { type: Array, required: false, default: () => [] }
        },

        methods: {
            selectDiscipline(picked) {
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
                
                this.$emit('select', mapExternalDisciplines(this.selected));
            }
        },

        watch: {
            preselected(preselected) {
                this.selected = mapExternalDisciplines(preselected);
            }
        },

        data() {
            return {
                tree: disciplineTree,
                selected: this.preselected.length ? mapExternalDisciplines(this.preselected) : []
            };
        }
    };
</script>

<style lang="less" scoped>
</style>
