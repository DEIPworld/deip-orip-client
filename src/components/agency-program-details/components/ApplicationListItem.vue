<template>
    <div>
        <v-divider v-if="isFirst"></v-divider>

        <v-layout row wrap class="c-pb-2">
            <v-flex xs12>
                <div class="c-pl-5 c-pt-5">
                    <router-link class="subheading" style="text-decoration: none"
                        :to="{
                            name: 'ResearchDetails',
                            params: {
                                research_group_permlink: encodeURIComponent(application.research.group_permlink),
                                research_permlink: encodeURIComponent(application.research.permlink)
                            }
                        }"
                    >{{ application.research.title }}</router-link>
                    <span class="subheading c-pl-2 c-pr-2 grey--text">|</span>
                    <router-link class="a subheading" 
                        :to="{
                            name: 'ResearchApplicationDetails',
                            params: {
                                research_group_permlink: encodeURIComponent(application.research.group_permlink),
                                research_permlink: encodeURIComponent(application.research.permlink),
                                application_id: application.id
                            }
                        }"
                    >{{ application.title || application.letterHash.slice(0, 8) }}</router-link>
                </div>
            </v-flex>

            <v-flex xs10>
                <div class="c-pl-5 c-pt-2 c-pb-2">
                    <router-link class="a c-pr-2 caption" 
                        :to="{
                            name: 'ResearchGroupDetails',
                            params: { research_group_permlink: encodeURIComponent(application.research.group_permlink) }
                        }"
                    >{{ application.group.name }}:</router-link>

                    <span class="caption grey--text">
                        <template v-for="author in application.authors">
                            <span>{{ author | fullname}}</span>
                            <span> · </span>
                        </template>
                    </span>
                </div>
            </v-flex>

            <v-flex xs2>
                <div class="c-pl-5 c-pt-3 c-pb-">
                    <span class="title">$ {{fromAssetsToFloat(application.total_amount)}}</span>      
                </div>
            </v-flex>

            <v-flex xs12>
                <div class="legacy-row c-pl-5 c-pb-2">
                    <div v-for="eci in eciList" class="grey--text">
                        <span class="c-pr-5">
                            <span class="">{{ eci.disciplineName }}</span>
                        </span>
                    <!-- <span class="c-pr-4 bold">
                            <span>{{ eci.value }}</span>
                        </span> -->
                    </div>
                </div>
            </v-flex>

            <v-flex xs12>
                <div class="legacy-row-nowrap c-pl-5">
                    <div class="c-pr-8 c-pt-1">
                        <v-icon color="grey" size="18px">chat_bubble</v-icon>
                        <span class="bold display-inline-flex">
                            <span class="green--text text--darken-2">{{ countReviews(true) }}</span>
                            <span>/</span>
                            <span class="red--text text--darken-2">{{ countReviews(false) }}</span>
                        </span>
                    </div>

                    <div class="c-pr-8 c-pt-1">
                        <span class="grey--text">Status:</span>
                        <span class="bold display-inline-flex c-pl-1">
                            <span v-if="application.status === applicationStatusMap.APPROVED" class="green--text text--darken-2">Approved</span>
                            <span v-if="application.status === applicationStatusMap.REJECTED" class="red--text text--darken-2">Declined</span>
                            <span v-if="application.status === applicationStatusMap.PENDING" class="grey--text">Pending</span>
                        </span>
                    </div>
                    <div v-if="isDuplicated" class="c-pr-8 body-2">
                        <span v-if="duplicate.status === applicationStatusMap.APPROVED">
                            Similar application has been <span class="green--text text--darken-2">approved</span> by 
                        </span>
                        <span v-if="duplicate.status == applicationStatusMap.REJECTED">
                            Similar application has been <span class="red--text text--darken-2">rejected</span> by 
                        </span>
                        <span v-if="duplicate.status == applicationStatusMap.PENDING">
                            There is a similar application in 
                        </span>
                        <span class="c-pr-1 c-pl-1">{{ duplicate.program.agency_name.toUpperCase()}}</span>
                        <span>
                            <v-avatar size="30px">
                                <img :src="{ _id: duplicate.program.agency_name } | tenantLogoSrc(60, 60, false)" />
                            </v-avatar>
                        </span>
                        <span class="caption grey--text">($ {{fromAssetsToFloat(duplicate.total_amount)}} requested)</span>
                    </div>
                </div>
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "ApplicationListItem",

        props: {
            application: { required: true, default: undefined },
            isFirst: { default: false },
            applicationStatusMap: Object
        },

        data() { 
            return {
            }
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
            isDuplicated() {
                return this.application.similarResearchApplications.length;
            },
            duplicate() {
                return this.isDuplicated 
                    ? this.application.similarResearchApplications[0]
                    : null
            }
        },

        methods: {
            countReviews(isPositive = true) {
                return _.filter(this.application.reviews, review => review.is_positive === isPositive).length;
            }
        }
    };
</script>


<style lang="less" scoped>

</style>
