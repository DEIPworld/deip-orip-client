<template>
    <div>
        <div class="ma-0">
            <router-link class="a title" 
                :to="{ name: 'ResearchDetails', params: { 
                        research_group_permlink: encodeURIComponent(research.group_permlink),
                        research_permlink: encodeURIComponent(research.permlink)
                    }
                }"
            >{{ research.title }}</router-link>
        </div>

        <!-- ### START Draft Actions Section ### -->
        <div class="c-mt-4" v-if="!isPublished && isResearchGroupMember">
            <div v-if="isProposed || isUnlockActionAvailable" class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div v-if="isProposed" class="c-mt-3 c-mb-3">
                <div class="subheading orange--text text-align-center">
                    Draft is
                    <router-link class="a orange--text" 
                        :to="{
                            name: 'ResearchGroupDetails',
                            params: { research_group_permlink: encodeURIComponent(research.group_permlink) },
                            hash: '#proposals'
                        }"
                    >proposed</router-link>
                    as research content and locked for editing
                </div>
            </div>
            <div v-if="isUnlockActionAvailable" class="c-mt-3 c-mb-3">
                <div class="text-align-center">
                    <v-btn color="orange" @click="unlockDraft()">Unlock Draft</v-btn>
                </div>
            </div>
        </div>
        <!-- ### END Draft Actions Section ### -->

        <!-- ### START Research Content ECI Section ### -->
        <div v-if="isPublished" class="c-mb-6 c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Expertise Contribution Index</div>
            
            <div class="c-mt-4">
                <div v-for="(eci, index) in eciList" :key="index"
                    class="legacy-row align-center legacy-justify-between eci-item c-ph-2" 
                    :class="index === 0 ? '' : 'c-mt-1'"
                >
                    <div class="grey--text">ECI</div>

                    <div class="c-pv-2 eci-label">
                        {{ eci.disciplineName }}: {{ eci.value }}
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Content ECI Section ### -->

        <!-- ### START Research TOC Section ### -->
        <div class="c-mb-6 c-mt-4" v-if="researchTableOfContent.length">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Research table of content</div>
            <div class="c-mt-2">
                <div v-for="(item, index) in researchTableOfContent" :key="index" 
                    :class="index === 0 ? '' : 'c-mt-1'"
                >
                    <div>
                        <div class="body-2">{{index + 1 }}. {{item.type}}</div>

                        <div class="c-pl-5">
                            <router-link target="_blank" class="a body-1" 
                                :to="{ 
                                    name: 'ResearchContentDetails', 
                                    params: { 
                                        research_group_permlink: encodeURIComponent(research.group_permlink),
                                        research_permlink: encodeURIComponent(research.permlink),
                                        content_permlink: encodeURIComponent(item.permlink)
                                    }
                                }"
                            >{{ item.title }}</router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research TOC Section ### -->

        <!-- ### START Research Content Authors Section ### -->
        <div class="c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Authors</div>

            <div v-if="isPublished" class="legacy-row-nowrap legacy-justify-between align-center c-pt-2 c-pb-2" v-for="(author, index) in contentAuthorsList" :key="index">
                <div>
                    <v-avatar size="40px">
                        <img v-if="author.profile" v-bind:src="author.profile.avatar | avatarSrc(80, 80, false)" />
                        <v-gravatar v-else :title="author.account.name" :email="author.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link :to="'/user-details/' + author.account.name" class="a c-pl-3">
                        {{author | fullname}}
                    </router-link>
                </div>
            </div>

            <div v-if="!isPublished" class="legacy-row-nowrap legacy-justify-between align-center c-pt-2 c-pb-2" v-for="(member, index) in draftAuthorsList" :key="index">
                <div class="legacy-col-10">
                    <v-avatar size="40px">
                        <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(80, 80, false)" />
                        <v-gravatar v-else :title="member.account.name" :email="member.account.name + '@deip.world'" />
                    </v-avatar>

                    <router-link :to="'/user-details/' + member.account.name" class="a c-pl-3">
                        {{member | fullname}}
                    </router-link>
                </div>

                <div class="legacy-col-2">
                    <div v-if="isInProgress" class="author-checkbox">
                        <!-- v-checkbox depends on v-model binding which doesn't play well with Vuex.
                            TODO: create a custom checkbox with the same styles as v-checkbox has -->
                        <input id="checkbox"
                            type="checkbox"
                            :disabled="draftAuthorGuard(member)"
                            :checked="isDraftAuthor(member)"
                            v-on:input="setDraftAuthor($event, member)"/>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Content Authors Section ### -->

        <!-- ### START Research Content Review Section ### -->
        <div v-if="isPublished" class="c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>

            <div class="subheading bold c-mt-4">
                Reviews: <span class="green--text text--darken-2">{{positiveReviewsCount}}</span> / <span class="red--text text--darken-2">{{negativeReviewsCount}}</span> 
            </div>

            <div class="c-pt-3">
                <div class="caption"><v-icon small class="c-pr-2">rate_review</v-icon>Reward for review: <span class="bold">{{convertToPercent(research.review_share_in_percent)}}%</span></div>
                <div class="caption" v-if="isContentRewardDistributionActive">
                    <div><v-icon small class="c-mr-2">av_timer</v-icon>Reward period active till</div>
                    <div class="bold"><v-icon small class="c-mr-2">today</v-icon>{{contentRewardDistributionState.end.toDateString()}}</div>
                </div>
            </div>

            <div v-if="isCreatingReviewAvailable" class="c-mt-4">
                <v-btn @click="goAddReview()" dark round outline color="primary" class="full-width ma-0">
                    <v-icon small>add</v-icon>
                    <div class="legacy-col-grow add-review-label">
                        Add a review
                        <span class="caption grey--text">
                            reward {{convertToPercent(research.review_share_in_percent)}}%
                        </span>
                    </div>
                </v-btn>
            </div>
        </div>
        <!-- ### END Research Content Review Section ### -->

        <!-- ### START Research Content Blockchain Data Section ### -->
        <div v-if="isPublished" class="c-mt-6">
            <div class="sidebar-fullwidth">
                <v-divider></v-divider>
            </div>

            <div class="c-mt-6">
                <router-link class="a title"
                    :to="{ 
                        name: 'ResearchContentMetadata', 
                        params: { 
                            research_group_permlink: encodeURIComponent(research.group_permlink),
                            research_permlink: encodeURIComponent(research.permlink),
                            content_permlink: encodeURIComponent(content.permlink)
                        }
                    }"
                >Blockchain Metadata</router-link>
            </div>
        </div>
        <!-- ### END Research Content Blockchain Data Section ### -->

        <!-- ### START Quorum Info Section ### -->
        <div v-if="!isPublished" class="c-mt-6">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Quorum</div>

            <div class="body-2 c-mt-2">
                <div class="legacy-row-nowrap align-center body-2 c-pt-1 c-pb-1">
                    <div class="legacy-col-10">{{createContentGroupQuorumValue.text}}:</div>
                    <div class="legacy-col-2">{{convertToPercent(createContentGroupQuorumValue.value)}}%</div>
                </div> 
            </div>
        </div>
        <!-- ### END Quorum Info Section ### -->

        <!-- ### START Reward Info Section ### -->
        <div v-if="!isPublished" class="c-mt-6">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Reviews</div>
            
            <div class="body-2 c-mt-2">
                <div class="legacy-row-nowrap align-center body-2 c-pt-1 c-pb-1">
                    <div class="legacy-col-10"><v-icon small class="c-pr-2">rate_review</v-icon> Reward for review:</div>
                    <div class="legacy-col-2">{{convertToPercent(research.review_share_in_percent)}}%</div>
                </div> 
            </div>
        </div>
        <!-- ### END Reward Info Section ### -->
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-oa-rpc-client';
    import contentHttpService from './../../../services/http/content'
    import { contentTypesList } from './../../../services/ResearchService';
    import { CREATE_RESEARCH_MATERIAL, labels } from './../../../services/ProposalService';

    export default {
        name: "ResearchContentDetailsSidebar",

        data() {
            return {};
        },
        
        computed: {
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                group: 'rcd/group',
                membersList: 'rcd/membersList',
                disciplinesList: 'rcd/disciplinesList',
                contentList: 'rcd/contentList',
                contentReviewsList: 'rcd/contentReviewsList',
                contentWeightByDiscipline: 'rcd/contentWeightByDiscipline',
                contentProposal: 'rcd/contentProposal',
                contentRef: 'rcd/contentRef'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },
            isInProgress() {
                return this.contentRef && this.contentRef.status === 'in-progress';
            },
            isProposed() {
                return this.contentRef && this.contentRef.status === 'proposed';
            },
            isPublished() {
                return this.content != null;
            },
            isUnlockActionAvailable() {
                return this.isResearchGroupMember && this.hasNoActiveProposal && this.isProposed;
            },
            hasNoActiveProposal() {
                const proposal = this.contentProposal;
                if (proposal) {
                    const isExpired = !(proposal.is_completed || 
                        (new Date(`${proposal.expiration_time}Z`).getTime() > new Date().getTime()));
                    return isExpired;
                }
                return true;
            },
            userHasExpertise() {
                return this.userExperise != null && this.research != null
                    ?  this.userExperise.some(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
                    : false
            },
            isCreatingReviewAvailable() {
                const userHasReview = this.contentReviewsList.some(r => r.author.account.name === this.user.username)
                return !this.isResearchGroupMember && !userHasReview && this.userHasExpertise && this.isPublished
            },
            positiveReviewsCount() {
                return this.contentReviewsList.filter(r => r.is_positive).length;
            },
            negativeReviewsCount() {
                return this.contentReviewsList.filter(r => !r.is_positive).length;
            },
            contentRewardDistributionState() {
                return this.content ? {
                    state: this.content.activity_state,
                    start: new Date(`${this.content.activity_window_start}Z`),
                    end: new Date(`${this.content.activity_window_end}Z`)
                } : null;
            },
            isContentRewardDistributionActive() {
                return this.contentRewardDistributionState && this.contentRewardDistributionState.state === 'active';
            },
            contentAuthorsList() {
                return this.content ? this.membersList.filter(m => this.content.authors.some(a => a === m.account.name)) : [];
            },
            draftAuthorsList() {
                return this.isInProgress ? this.membersList : this.membersList.filter(m => this.contentRef.authors.some(a => a === m.account.name))
            },
            researchTableOfContent() {
                return this.contentList.map(content => {
                    let typeObj = contentTypesList.find(c => c.type === content.content_type);
                    return {
                        type: typeObj ? typeObj.text : 'Milestone',
                        title: content.title,
                        permlink: content.permlink
                    }
                })
            },
            createContentGroupQuorumValue() {
                return this.group ? {
                    text: labels[CREATE_RESEARCH_MATERIAL],
                    value: this.group.proposal_quorums[CREATE_RESEARCH_MATERIAL - 1][1]
                } : undefined;
            },
            eciList() {
                return this.disciplinesList.map(discipline => {
                    const eciObj = this.content.eci_per_discipline.find(item => item[0] === discipline.id);

                    return {
                        disciplineName: discipline.name,
                        value: eciObj ? eciObj[1] : 0
                    }
                });
            }
        },

        methods: {
            userHasExpertiseInDiscipline(discipline) {
                return this.userExperise != null && this.research != null
                    ? this.userExperise.some(exp => exp.discipline_id == discipline.id)
                    : false
            },
            unlockDraft() {
                contentHttpService.unlockContentDraft(this.contentRef._id)
                    .then(() => {
                        location.reload()
                    }, (err) => {
                        console.log(err)
                    })
            },
            isDraftAuthor(member) {
                return this.contentRef.authors.some(a => a === member.account.name);
            },
            draftAuthorGuard(member) {
                return this.contentRef.authors.length == 1 && this.isDraftAuthor(member)
            },
            setDraftAuthor(event, member) {
                event.preventDefault();
                event.stopPropagation();
                const checked = event.target.checked;
                const authors = checked
                    ? [...this.contentRef.authors, member.account.name]
                    : this.contentRef.authors.filter(a => a !== member.account.name);
                this.$emit('setDraftAuthors', this.membersList.filter(m => authors.some(a => a === m.account.name)));
            },
            goAddReview() {
                this.$router.push({ name: 'ResearchContentAddReview', params: this.$route.params });
            }
        }
    };
</script>

<style lang="less" scoped>
    .eci-item {
        border: 1px solid #e4e4e4;
        border-radius: 3px;
    }
    .eci-label {
       color: #818181;
    }
    .selected-author-item {
        background-color: #e0e0e0;
        width: 100%;
        height: 100%;
    }
    .add-review-label {
        text-transform: none;
    }
    .author-checkbox {
        max-height: 30px !important;
    }
</style>
