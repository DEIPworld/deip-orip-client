<template>
    <div>
        <div class="c-pt-6 research-details-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchDetails" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchDetails === false">
                <div class="row justify-between align-center">
                    <div>
                        <v-icon size="18px">date_range</v-icon>
                        <span>Created on {{ new Date(research.created_at).toDateString() }}</span>
                    </div>
                <!-- <v-btn @click="afterComplete" small color="primary" class="ma-0">Vote</v-btn> -->
                </div>

                <div class="display-1 half-bold c-mt-10">
                    {{ research.title }}
                </div>

                <div class="c-pt-8">
                    {{ research.abstract }}
                </div>
            </div>
        </div>

        <div v-if="contentList.length">
            <div class="c-pt-8 title">Timeline</div>
            <div class="c-pt-6">
                <research-timeline :contentList="contentList" :research="research"></research-timeline>
            </div>
        </div>

        <div v-if="research" class="c-pt-8 title">Research</div>

        <div v-if="!contentList.length && isLoadingResearchContent === false" class="c-pt-8">
            There is no content posted in the research yet. 
            <span v-if="isResearchGroupMember">Please use the form below to upload your pdf files and images</span>
        </div>
        <div class="c-pt-6 research-content-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchContent" indeterminate color="primary"></v-progress-circular>
            <v-expansion-panel v-if="isLoadingResearchContent === false">
                <v-expansion-panel-content v-for="(content, index) in contentList" :key="index">
                    <div slot="header">
                        <span class="bold">Chapter {{index + 1}}</span>
                        <span class="deip-blue-color bold c-pl-4"> 
                            <router-link  :to="`/${research.group_permlink}/research/${research.permlink}/${content.permlink}`" 
                                          style="text-decoration: none">{{content.title}}
                            </router-link>
                        </span>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="caption grey--text c-pt-2"> {{contentAuthorsStr(content.authors)}}</div>
                                <div class="c-pt-4 half-bold">
                                </div>
                                <div class="c-pt-2">
                                    <div class="row-nowrap">
                                        <div v-for="(discipline, index) in disciplinesList">
                                            <span v-if="contentWeightByDiscipline[content.id] && contentWeightByDiscipline[content.id][discipline.id]">
                                                <span class="c-pr-1">
                                                    <span class="bold green--text text--darken-2">{{discipline.name}}</span>
                                                </span>
                                                <span class="c-pr-4">
                                                    <span>{{contentWeightByDiscipline[content.id][discipline.id] }}</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row-nowrap c-mt-3">
                                        <div class="c-pr-10">
                                            <v-icon size="18px">visibility</v-icon> <span>1999</span>
                                        </div>
                                        <div class="c-pr-10">
                                            <v-icon size="18px">chat_bubble</v-icon> <span>23</span>
                                        </div>
                                        <div>
                                            <v-icon size="18px">date_range</v-icon> <span>{{new Date(content.created_at).toDateString()}}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <add-research-contnet-dialog v-if="isResearchGroupMember && !research.is_finished"></add-research-contnet-dialog>
        </div>

        <div class="research-reviews-container spinner-container">
            <v-progress-circular v-if="isLoadingResearchReviews" indeterminate color="primary"></v-progress-circular>
            <div v-if="isLoadingResearchReviews === false && reviewsList.length">
                <div class="c-pt-8 title">Reviews: {{ reviewsList.length }}</div>
                <div class="c-pt-6">
                    <review-list-item v-for="(review, i) in reviewsList" :review="review" :key="i"></review-list-item>
                </div>
            </div>
        </div>
        <!-- <div class="c-pt-4 title">Grants: 4</div>

        <div class="c-pt-6">
            <v-card>
                <div class="info-card-list">
                    <div class="list-line">
                        <div class="list-header-cell col-3">Organization</div>
                        <div class="list-header-cell col-5">Project</div>
                        <div class="list-header-cell col-2 text-align-center">Date</div>
                        <div class="list-header-cell col-2 text-align-right">Amount</div>
                    </div>
                    <div class="list-line" v-for="i in 5" :key="i">
                        <div class="col-3 list-body-cell a">JJHK</div>
                        <div class="col-5 list-body-cell">General Support</div>
                        <div class="col-2 list-body-cell text-align-center">20 Jan 2018</div>
                        <div class="col-2 list-body-cell text-align-right">$50 000</div>
                    </div>
                </div>
            </v-card>
        </div>-->

    <!--    <div class="c-pt-8 title">References: 2</div>

        <div class="c-pt-6">
            <div>
                1. Crawford, Lynn. (2007). Global body of project management knowledge and standards. 
                In Jeffrey K. Pinto & Peter W.G. Morris (Eds.): The Wiley Guide to Managing Projects (1st ed., pp. 206-252). 
                Hoboken, N.J.: Wiley & Sons, Inc.
            </div>
            <div class="c-pt-2">
                2. Kwak, Young Hoon, and Frank T. Anbari. (2009). Analysing project management research: Perspectives 
                from top management journals. International Journal of Project Management, 27(5), 435-446.
            </div>
        </div>  -->
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        name: "ResearchDetailsBody",

        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                research: 'rd/research',
                contentList: 'rd/contentList',
                reviewsList: 'rd/reviewsList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList',
                contentWeightByDiscipline: 'rd/contentWeightByDiscipline',
                membersList: 'rd/membersList',
                isLoadingResearchContent: 'rd/isLoadingResearchContent',
                isLoadingResearchDetails: 'rd/isLoadingResearchDetails',
                isLoadingResearchReviews: 'rd/isLoadingResearchReviews',
                isLoadingResearchReviews: 'rd/isLoadingResearchReviews'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            }
        },
        methods: {
            contentAuthorsStr(authors) {
                return this.membersList
                    .filter(m => authors.some(a => a == m.account.name))
                    .map(m => this.$options.filters.fullname(m))
                    .join("  ·  ");
            }
        }
    };
</script>

<style lang="less" scoped>
    .research-details-container {
        min-height: 200px;
    }

    .research-content-container {
        min-height: 150px;
    }

    .research-reviews-container {
        min-height: 150px;
    }

</style>