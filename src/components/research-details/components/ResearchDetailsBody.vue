<template>
<div class="research-body-container spinner-container">
    <v-progress-circular class="section-spinner"
        v-if="isLoadingResearchPage"
        :size="100" indeterminate
        color="primary"
    ></v-progress-circular>

    <div v-if="isLoadingResearchPage === false">
        <!-- ### START Research Details Section ### -->
        <div class="c-pt-6 research-details-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchDetails"
                indeterminate color="primary"
            ></v-progress-circular>

            <div v-if="isLoadingResearchDetails === false">
                <div class="row justify-between align-center">
                    <div>
                        <v-icon size="18px">date_range</v-icon>
                        <span>Created on {{ research.created_at | dateFormat('D MMM YYYY', true) }}</span>
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
        <!-- ### END Research Details Section ### -->

        <!-- ### START Research Content Section ### -->
        <div v-if="contentList.length">
            <div class="c-pt-8 title">Timeline</div>
            <div class="c-pt-6">
                <research-timeline :contentList="contentList" :research="research"></research-timeline>
            </div>
        </div>

        <div v-if="research" class="c-pt-8 title">Research results</div>

        <div v-if="!contentList.length && isLoadingResearchContent === false" class="c-pt-8">
            There is no content posted in the research yet. 
            <span v-if="isResearchGroupMember">Please use the form below to upload your pdf files and images or add them manually with the Editor.</span>
        </div>

        <div class="c-pt-6 research-content-container spinner-container">
            <v-progress-circular class="section-spinner"
                v-if="isLoadingResearchContent"
                indeterminate color="primary"
            ></v-progress-circular>

            <v-expansion-panel v-if="isLoadingResearchContent === false">
                <v-expansion-panel-content v-for="(content, index) in contentList" :key="index">
                    <div slot="header">
                        <span class="bold">Chapter {{index + 1}}</span>
                        <span class="deip-blue-color bold c-pl-4"> 
                            <router-link style="text-decoration: none" 
                                :to="{ name: 'ResearchContentDetails', params: { research_group_permlink: research.group_permlink, research_permlink: research.permlink, content_permlink: content.permlink } }">
                                {{content.title}}
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
                                        <div v-for="(eci, index) in getContentEciList(content)">
                                            <span>
                                                <span class="c-pr-1">
                                                    <span class="bold green--text text--darken-2">{{ eci.disciplineName}}</span>
                                                </span>

                                                <span class="c-pr-4">
                                                    <span>{{ eci.value }}</span>
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="row-nowrap c-mt-3">
                                        <!-- <div class="c-pr-10">
                                            <v-icon size="18px">visibility</v-icon> <span>1999</span>
                                        </div> -->
                                        <div class="c-pr-10">
                                            <v-icon size="18px">event</v-icon>
                                            <span>{{ content.created_at | dateFormat('D MMM YYYY', true) }}</span>
                                        </div>

                                        <div class="c-pr-10">
                                            <v-icon size="18px">chat_bubble</v-icon>

                                            <span class="bold display-inline-flex">
                                                <span class="green--text text--darken-2">{{ countContentReviews(content, true) }}</span>
                                                <span>/</span>
                                                <span class="red--text text--darken-2">{{ countContentReviews(content, false) }}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </div>
        <!-- ### END Research Content Section ### -->

        <div v-if="isResearchGroupMember && !research.is_finished" class="c-pt-8 title">Work in progress</div>

        <div class="c-pt-6 research-drafts-container" v-if="isResearchGroupMember && !research.is_finished">
            <v-expansion-panel v-if="isLoadingResearchContentRefs === false">
                <v-expansion-panel-content v-for="(draft, index) in contentRefsList.filter(d => !draftIsApproved(d))" :key="index">
                    <div slot="header">
                        <span class="bold">Draft {{index + 1}}</span>
                        <span class="deip-blue-color bold c-pl-4"> 
                            <a @click="openDarDraft(draft)" style="text-decoration: none">
                                {{draft.title || draft._id}}
                            </a>
                        </span>
                        <span v-if="draftIsProposed(draft)" class="c-pl-2 italic orange--text">(proposed)</span>
                    </div>
                    <v-card>
                        <v-card-text class="pt-0">
                            <div class="c-ph-2">
                                <div class="row">
                                    <div class="col-8">
                                        <div class="c-pt-2">
                                            <span>
                                                <v-icon size="18px">date_range</v-icon> 
                                                <span>{{draft.updated_at | dateFormat('D MMM YYYY HH:mm', true)}}</span>
                                            </span>
                                            <span class="c-pl-2">
                                                <v-icon size="18px">note_add</v-icon> 
                                                <span>{{draft.type}}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="col-4 c-pr-8">
                                        <div>
                                            <div class="right">
                                                <v-btn @click="openDarDraft(draft)" outline small depressed color="primary lighten-1">
                                                    View
                                                </v-btn>
                                            </div>
                                            <div v-if="draftIsInProgress(draft)" class="right">
                                                <v-btn
                                                    @click="deleteDraft(draft)" :loading="isDeletingDraft" 
                                                    :disabled="isDeletingDraft" outline small depressed color="red lighten-1">
                                                    Delete
                                                </v-btn>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-expansion-panel-content>
            </v-expansion-panel>
            
            <div v-if="isResearchGroupMember && !research.is_finished">
                <upload-research-contnet-file-dialog></upload-research-contnet-file-dialog>
                <v-btn @click="createDarDraft()" :loading="isCreatingDraft" :disabled="isCreatingDraft" block outline color="primary" dark>Use Editor</v-btn>
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
</div>

</template>

<script>

    import { mapGetters } from 'vuex'
    import contentHttpService from './../../../services/http/content'

    export default {
        name: "ResearchDetailsBody",
        data() {
            return {
                isCreatingDraft: false,
                isDeletingDraft: false
            }
        },
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                research: 'rd/research',
                contentList: 'rd/contentList',
                reviewsList: 'rd/reviewsList',
                contentRefsList: 'rd/contentRefsList',
                disciplinesList: 'rd/disciplinesList',
                totalVotesList: 'rd/totalVotesList',
                contentWeightByDiscipline: 'rd/contentWeightByDiscipline',
                membersList: 'rd/membersList',
                isLoadingResearchPage: 'rd/isLoadingResearchPage',
                isLoadingResearchContent: 'rd/isLoadingResearchContent',
                isLoadingResearchDetails: 'rd/isLoadingResearchDetails',
                isLoadingResearchReviews: 'rd/isLoadingResearchReviews',
                isLoadingResearchReviews: 'rd/isLoadingResearchReviews',
                isLoadingResearchContentRefs: 'rd/isLoadingResearchContentRefs'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            }
        },
        methods: {
            countContentReviews(content, isPositive) {
                return content.reviews.reduce(
                    (acc, review) => review.is_positive && isPositive || !review.is_positive && !isPositive ? acc + 1 : acc,
                    0
                );
            },
            getContentEciList(content) {
                return this.disciplinesList.map(discipline => {
                    const eciObj = content.eci_per_discipline.find(item => item[0] === discipline.id);

                    return {
                        disciplineName: discipline.name,
                        value: eciObj ? eciObj[1] : 0
                    }
                });
            },
            openDarDraft(draft) {
                if (draft.type === 'dar' && draft.status === 'in-progress') {
                    // we have to do it this way as Texture InMemory buffer is getting flushed after the first saving
                    // and doesn't persist new changes for several instances during the current session
                    window.location.replace(`${window.location.href}/!draft?ref=${draft._id}`);
                    location.reload()
                } else {
                    const params = {
                        group_permlink: this.$route.params.research_group_permlink,
                        research_permlink: this.$route.params.research_permlink,
                        content_permlink: `!draft`
                    };
                    const query = { 'ref': draft._id };
                    this.$router.push({ name: 'ResearchContentDetails', params, query });
                }
            },
            createDarDraft() {
                this.isCreatingDraft = true;
                contentHttpService.createDarContent(this.research.id)
                    .then((res) => {
                        // we have to load page this way as Texture InMemoryBuffer is getting flushed after the first saving
                        // and doesn't persist new changes for several instances during the current session
                        window.location.replace(`${window.location.href}/!draft?ref=${res.draft._id}`);
                        location.reload()
                    }, (err) => {console.log(err)})
                    .finally(()=> {
                        this.isCreatingDraft = false;
                    })
            },
            deleteDraft(draft) {
                this.isDeletingDraft = true;
                contentHttpService.deleteContentDraft(draft._id)
                    .then(() => {
                        this.$store.dispatch('rd/loadResearchContentRefs', { researchId: draft.researchId });
                    })
                    .finally(() => {
                        this.isDeletingDraft = false;
                    })
            },
            draftIsApproved(draft) {
                return this.contentList.some(c => c.content == `${draft.type}:${draft.hash}`);
            },
            draftIsProposed(draft) {
                return draft.status === 'proposed'
            },
            draftIsInProgress(draft) {
                return draft.status === 'in-progress'
            },
            contentAuthorsStr(authors) {
                return this.membersList
                    .filter(m => authors.some(a => a == m.account.name))
                    .map(m => this.$options.filters.fullname(m))
                    .join("  ·  ");
            }
        }
    };
</script>

<style lang="less">
    .research-body-container {
        min-height: 500px;
    }

    .research-details-container {
        min-height: 200px;
    }

    .research-content-container {
        min-height: 70px;
    }

    .research-drafts-container {

    }

    .research-reviews-container {
        min-height: 150px;
    }

</style>