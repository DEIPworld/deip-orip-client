<template>
    <div>
        <v-divider v-if="isFirst"></v-divider>

        <v-layout row wrap class="c-pb-2">
            <v-flex xs12>
                <div class="c-pl-5 c-pt-5">
                    <router-link class="a subheading"
                        :to="{
                            name: 'ResearchDetails',
                            params: {
                                research_group_permlink: encodeURIComponent(application.research.group_permlink),
                                research_permlink: encodeURIComponent(application.research.permlink)
                            }
                        }"
                    >{{ application.research.title }}</router-link>
                </div>
            </v-flex>

            <v-flex xs12>
                <div class="c-pl-5 c-pt-2 c-pb-2">
                    <router-link class="a c-pr-2 caption" 
                        :to="{
                            name: 'ResearchGroupDetails',
                            params: { research_group_permlink: encodeURIComponent(application.research.group_permlink) }
                        }"
                    >{{ application.group.name }}:</router-link>

                    <span class="caption grey--text hidden-last-child">
                        <template v-for="author in application.enrichedAuthors">
                            <span>{{ author | fullname}}</span>
                            <span> · </span>
                        </template>
                    </span>
                </div>
            </v-flex>

            <v-flex xs12>
                <div class="row c-pl-5 c-pb-2">
                    <div v-for="eci in eciList" class="grey--text">
                        <span class="c-pr-1">
                            <span class="">{{ eci.disciplineName }}</span>
                        </span>

                        <span class="c-pr-4 bold">
                            <span>{{ eci.value }}</span>
                        </span>
                    </div>
                </div>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>
    </div>
</template>

<script>
    export default {
        name: "ProgramListItem",

        props: {
            application: { required: true, default: undefined },
            isFirst: { default: false }
        },

        data() { 
            return {}
        },

        computed: {
            disciplines() {
                return this.application.research.disciplines && this.application.research.totalVotes
                    ? this.application.research.disciplines.map(discipline => {
                        return {
                            disciplineName: discipline.name,
                            totalWeight: this.application.research.totalVotes.reduce(
                                (accumulator, value) => value.discipline_id === discipline.id 
                                    ? accumulator + value.total_weight
                                    : accumulator,
                                0
                            )
                        };
                    })
                    : [];
            },
            eciList() {
                return this.application.research.disciplines.map(discipline => {
                    const eciObj = this.application.research.eci_per_discipline.find(item => item[0] === discipline.id);

                    return {
                        disciplineName: discipline.name,
                        value: eciObj ? eciObj[1] : 0
                    }
                });
            },
        }
    };
</script>


<style lang="less" scoped>

</style>
