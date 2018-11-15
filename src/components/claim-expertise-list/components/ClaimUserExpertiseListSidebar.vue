<template>
    <div>
        <div class="subheading c-pb-4 bold">Disciplines</div>

        <discipline-tree-picker
            :preselected="selectedDisciplines"
            @select="selectDisciplines"
        ></discipline-tree-picker>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { mapGetters } from 'vuex';

    export default {
        name: "ClaimUserExpertiseListSidebar",

        data() {
            return {
            };
        },

        computed: {
            ...mapGetters({
                selectedDisciplines: 'claimExpertiseList/selectedDisciplines'
            })
        },
        
        methods: {
            selectDisciplines(disciplines) {
                this.$store.dispatch('claimExpertiseList/setSelectedDisciplines', disciplines);
            }
        }
    };
</script>

<style lang="less" scoped>

</style>
