<template>
    <v-container fluid fill-height class="pa-0 legacy-justify-center">

        <div class="page-container c-pv-10">
            <div class="headline text-align-center">Select your discipline</div>

            <div class="legacy-row discipline-picker c-mt-8">

                <div class="legacy-col-4 c-p-4 overflow-y-auto">
                    <div class="half-bold uppercase c-pb-3">Popular</div>
                    <div class="c-pt-1" v-for="(item, i) in popular" :key="i">
                        <span class="discipline-picker-label"
                            @click="selectDiscipline(item)"
                            :class="[{'selected': selectedDiscipline && item.id === selectedDiscipline.id}]"
                        >{{ item.label }}</span>
                    </div>
                </div>

                <div class="legacy-col-8 c-p-4 overflow-y-auto">
                    <div class="half-bold uppercase c-pb-4">All</div>
                    <discipline-tree-picker :preselected="[]" @select="selectDiscipline"></discipline-tree-picker>
                </div>

            </div>
            <div class="red--text c-pt-2 text-align-center">
                <v-icon color="red">warning</v-icon>
                Please be accurate, you will need the community assistance to change the disciplines
            </div>

            <div class="legacy-row legacy-justify-center c-pt-8">
                <v-btn color="primary" @click="setDiscipline()" :disabled="selectedDiscipline === undefined">
                    Set disciplines
                </v-btn>
            </div>
            <div class="legacy-row legacy-justify-center c-pt-2">
                <router-link to="/research-feed" class="a">Skip</router-link>
            </div>
        </div>

    </v-container>   
</template>

<script>
    export default {
        name: 'ClaimExpertiseRegesitration',
        data() {
            return {
                popular: [
                    { label: 'Applied psychology', id: 26 }, 
                    { label: 'Bioinformatics', id: 42 }
                ],
                selectedDiscipline: undefined
            }
        },
        methods: {
            selectDiscipline(discipline) {
                this.selectedDiscipline = discipline;
            },
            setDiscipline() {
                this.$router.push({ name: 'ResearchFeed' });
            }
        }
    }
</script>

<style lang="less" scoped>
    @import './../../styles/colors.less';

    .page-container {
        width: 700px;
    }

    .discipline-picker {
        border: 1px solid @grey;
        background-color: @grey-lighten-2;
        height: 300px;

        & > :not(:last-child) {
            border-right: 1px solid @grey;
        }
    }
</style>
