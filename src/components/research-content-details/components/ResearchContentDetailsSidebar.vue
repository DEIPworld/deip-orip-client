<template>
    <div class="research-content-details-sidebar-container">
      <sidebar-loader v-if="isLoadingResearchContentPage"></sidebar-loader>
      <div v-if="isLoadingResearchContentPage === false">

        <div class="ma-0">
            <router-link class="a sm-title" 
                :to="{ name: 'research-details', params: { 
                        research_group_permlink: research.group_permlink,
                        research_permlink: research.permlink }
                    }">
                    {{ research.title }}
            </router-link>
        </div>

        <!-- ### START Draft Actions Section ### -->
        <div v-if="!isPublished && isResearchGroupMember" class="c-mb-3 c-mt-3">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div v-if="isInProgress" class="c-mt-3 c-mb-3">
                <div class="text-align-center">
                    <v-btn @click="openContentProposalDialog()" color="primary" block outline>Propose Content</v-btn>
                </div>
            </div>
            <div v-if="isSavingActionAvailable" class="c-mt-3 c-mb-3">
                <div class="text-align-center">
                    <v-btn @click="saveDraft()" :loading="isSavingDraft" :disabled="isSavingDraft" 
                        color="secondary" block outline>
                        Save Draft
                    </v-btn>
                </div>
            </div>
            <div v-if="isProposed" class="c-mt-3 c-mb-3">
                <div class="text-align-center">
                    Draft is proposed as research content and locked for editing
                </div>
            </div>
            <div v-if="isUnlockActionAvailable" class="c-mt-3 c-mb-3">
                <div class="text-align-center">
                    <v-btn @click="unlockDraft()">Unlock Draft</v-btn>
                </div>
            </div>
        </div>
        <!-- ### END Draft Actions Section ### -->

        <!-- ### START Research TOC Section ### -->
        <div class="c-mb-6 c-mt-4" v-if="researchTableOfContent.length">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Research Table of Content</div>
            <div class="c-mt-2">
                <div v-for="(item, index) in researchTableOfContent" :key="index" 
                        :class="index === 0 ? '' : 'c-mt-1'">
                    <div>
                        <div class="body-2">{{index + 1 }}. {{item.type}}</div>
                        <div class="c-pl-5">
                            <router-link target="_blank" class="a body-1" 
                                :to="{ name: 'ResearchContentDetails', params: { 
                                    research_group_permlink: research.group_permlink,
                                    research_permlink: research.permlink,
                                    content_permlink: item.permlink } }">
                                {{ item.title }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research TOC Section ### -->


        <!-- ### START Research Content ECI Section ### -->
        <div v-if="isPublished" class="c-mb-6 c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Expertise Contribution Index</div>
            <div class="c-mt-4">
                <div v-for="(discipline, index) in disciplinesList" :key="index"
                    class="row align-center justify-between eci-item" 
                    :class="index === 0 ? '' : 'c-mt-1'">

                    <div class="c-p-2 eci-label">
                        {{discipline.name}}:  

                        {{contentWeightByDiscipline[content.id] !== undefined && 
                        contentWeightByDiscipline[content.id][discipline.id] !== undefined ?
                        contentWeightByDiscipline[content.id][discipline.id] : 0}}
                    </div>
                </div>
            </div>
        </div>
        <!-- ### END Research Content ECI Section ### -->

        <!-- ### START Research Content Authors Section ### -->
        <div class="c-mt-4">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Authors</div>
            <div v-if="isPublished" class="row-nowrap justify-between align-center c-pt-2 c-pb-2" v-for="(author, index) in contentAuthorsList" :key="index">
                <div>
                    <v-avatar size="40px">
                        <img v-if="author.profile" v-bind:src="author.profile.avatar | avatarSrc(40, 40, false)" />
                        <v-gravatar v-else :title="author.account.name" :email="author.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link :to="'/user-details/' + author.account.name" class="a c-pl-3">
                        {{author | fullname}}
                    </router-link>
                </div>
            </div>
            <div v-if="isInProgress" class="row-nowrap justify-between align-center c-pt-2 c-pb-2" v-for="(member, index) in membersList" :key="index">
                <div class="col-10">
                    <v-avatar size="40px">
                        <img v-if="member.profile" v-bind:src="member.profile.avatar | avatarSrc(40, 40, false)" />
                        <v-gravatar v-else :title="member.account.name" :email="member.account.name + '@deip.world'" />
                    </v-avatar>
                    <router-link :to="'/user-details/' + member.account.name" class="a c-pl-3">
                        {{member | fullname}}
                    </router-link>
                </div>
                <div class="col-2">
                    <div class="author-checkbox">
                        <!-- v-checkbox depends on v-model binding which doesn't play well with Vuex.
                            TODO: create a custom checkbox with the same styles as v-checkbox has -->
                        <input id="checkbox" type="checkbox" :checked="isDraftAuthor(member)" 
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
                Reviews: <span style="color: green">{{positiveReviewsCount}}</span> / <span style="color: red">{{negativeReviewsCount}}</span> 
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
                    <div class="col-grow add-review-label">
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
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="c-mt-6">
                <router-link class="a sm-title" 
                    :to="{  name: 'ResearchContentMetadata', 
                            params: { 
                                research_group_permlink: research.group_permlink,
                                research_permlink: research.permlink,
                                content_permlink: content.permlink
                        }}">
                    Blockchain Metadata
                </router-link>
            </div>
        </div>
        <!-- ### END Research Content Blockchain Data Section ### -->

        <!-- ### START Quorum Info Section ### -->
        <div v-if="!isPublished" class="c-mt-6">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Quorum</div>
            <div class="body-2 c-mt-2">
                <div class="row-nowrap align-center body-2 c-pt-1 c-pb-1">
                    <div class="col-10">{{createContentGroupQuorumValue.text}}:</div>
                    <div class="col-2">{{convertToPercent(createContentGroupQuorumValue.value)}}%</div>
                </div> 
            </div>
        </div>
        <!-- ### END Quorum Info Section ### -->

        <!-- ### START Reward Info Section ### -->
        <div v-if="!isPublished" class="c-mt-6">
            <div class="sidebar-fullwidth"><v-divider></v-divider></div>
            <div class="subheading bold c-mt-4">Reviews</div>
            <div class="body-2 c-mt-2">
                <div class="row-nowrap align-center body-2 c-pt-1 c-pb-1">
                    <div class="col-10"><v-icon small class="c-pr-2">rate_review</v-icon> Reward for review:</div>
                    <div class="col-2">{{convertToPercent(research.review_share_in_percent)}}%</div>
                </div> 
            </div>
        </div>
        <!-- ### END Reward Info Section ### -->
      </div>

      <v-dialog v-if="research" v-model="proposeContent.isOpen" persistent transition="scale-transition" max-width="500px">
        <v-card class="">
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeContentProposalDialog()">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Propose content for research</v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            
            <page-container>
                <contentbar>
                    <div v-if="membersList.length">

                        <v-text-field
                            label="Title"
                            v-model="proposeContent.title"
                            hide-details>
                        </v-text-field>

                        <v-select v-model="proposeContent.type" 
                            :items="proposeContent.contentTypes" 
                            label="Content Type" 
                            class="c-mt-6"
                            item-value="id">
                        </v-select>

                        <v-select
                            :items="membersList"
                            v-model="proposeContent.authors"
                            placeholder="Authors"
                            v-on:change="setDraftAuthors"
                            autocomplete
                            multiple>
                            
                            <template slot="selection" slot-scope="data">
                                <div class="row-nowrap align-center c-pl-4">
                                    <v-avatar size="30px">
                                        <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(30, 30, false)" />
                                        <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                    </v-avatar>
                                    <span class="deip-blue-color c-pl-3">{{ data.item | fullname }}</span>
                                </div>
                            </template>
                            
                            <template slot="item" slot-scope="data">
                                <template>
                                    <div class="row-nowrap align-center author-item" 
                                        :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                                        <v-avatar size="30px">
                                            <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(30, 30, false)" />
                                            <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                        </v-avatar>
                                        <span class="deip-blue-color c-pl-3">{{ data.item | fullname  }}</span>
                                    </div>
                                </template>
                            </template>
                        </v-select>


                        <div class="display-flex c-pt-8">
                            <v-btn color="primary" 
                                class="c-m-auto"
                                :disabled="proposeContent.isLoading || !isCreatingProposalAvailable"
                                :loading="proposeContent.isLoading"
                                @click="sendContentProposal()"
                            >Create proposal</v-btn>
                        </div>
                    </div>

                    <div class="display-flex" v-else>
                        <v-progress-circular class="c-m-auto" indeterminate color="primary"></v-progress-circular>
                    </div>
                </contentbar>
            </page-container>
        </v-card>
      </v-dialog>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import contentHttpService from './../../../services/http/content'
    import * as proposalService from "./../../../services/ProposalService";
    import { signOperation } from './../../../utils/blockchain';
    import { createContentProposal, contentTypes } from './../../../services/ResearchService';
    import { CREATE_RESEARCH_MATERIAL, labels } from './../../../services/ProposalService';

    export default {
        name: "ResearchContentDetailsSidebar",
        data() {
            return {
                vote: {
                    discipline: {},
                    weight: 50,
                    isLoading: false,
                    isOpen: false
                },
                proposeContent: {
                    title: "",
                    type: null,
                    authors: [],
                    contentTypes: contentTypes,
                    deipRefs: [],

                    isOpen: false,
                    isLoading: false
                },

                isSavingDraft: false,

                researchGroupPermlink: this.$route.params.research_group_permlink,
                researchPermlink: this.$route.params.research_permlink,
                researchContentPermlink: this.$route.params.content_permlink
            };
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
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage',
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
            isSavingActionAvailable() {
                return this.isResearchGroupMember && this.contentRef.type === 'dar' && this.isInProgress;
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
            isCreatingProposalAvailable() {
                return this.proposeContent.title && this.proposeContent.type && this.proposeContent.authors.length;
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
                return this.contentRef ? this.contentRef.authors : [];
            },
            researchTableOfContent() {
                return this.contentList.map(content => {
                    let typeObj = contentTypes.find(c => c.type === content.content_type);
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
            }
        },

        methods: {
            saveDraft() {
                this.isSavingDraft = true;
                const texture = this.$store.getters['rcd/texture'];

                contentHttpService.getContentRef(this.contentRef._id)
                    .then((draft) => {
                        return draft.status == 'in-progress' ? 
                            texture.save()
                                .then(() => {
                                    this.$store.dispatch('layout/setSuccess', 
                                        { message: "Draft is saved !" });
                                }, (err) => {
                                    console.error(err);
                                    this.$store.dispatch('layout/setError', 
                                        { message: "Please, make sure you have specified all required fields for metadata" });
                                }) : Promise.resolve().then(() => {
                                    this.$store.dispatch('layout/setError', 
                                        { message: "Draft is locked for editing !" });
                                })
                    })
                    .finally(() => {
                        this.isSavingDraft = false;
                    });
            },

            sendContentProposal() {
                var promise;
                this.proposeContent.isLoading = true;
                if (this.contentRef.type === 'dar') {
                    const texture = this.$store.getters['rcd/texture'];
                    promise = texture.save()
                        .then(() => {
                            return contentHttpService.getContentRef(this.contentRef._id)
                        });
                } else {
                    contentRef.title = this.proposeContent.title;
                    promise = Promise.resolve(this.contentRef)
                }

                promise
                    .then((contentRef) => {

                        contentRef.title = contentRef.title || this.proposeContent.title;
                        contentRef.authors = this.proposeContent.authors.map(a => a.account.name);
                        contentRef.references = this.proposeContent.deipRefs.map(r => r.id);

                        createContentProposal(contentRef, this.proposeContent.type)
                            .then(() => {
                                this.$store.dispatch('layout/setSuccess', {
                                    message: "New Content Proposal has been created successfuly!"
                                });
                                this.$router.push({
                                    name: 'ResearchGroupDetails',
                                    params: { research_group_permlink: this.$route.params.research_group_permlink  }
                                });
                            }, (err) => {
                                console.log(err) 
                                this.$store.dispatch('layout/setError', {
                                    message: "An error occurred while creating proposal, please try again later"
                                });
                            })
                            .finally(() => {
                                this.proposeContent.isOpen = false;
                                this.proposeContent.isLoading = false;
                            })
                    })
            },
            
            userHasExpertiseInDiscipline(discipline) {
                return this.userExperise != null && this.research != null
                    ? this.userExperise.some(exp => exp.discipline_id == discipline.id)
                    : false
            },


            openContentProposalDialog() {
                if (this.contentRef.type === 'dar') {
                    const texture = this.$store.getters['rcd/texture'];
                    const articleTitle = texture.api.getArticleTitle();
                    const deipRefs = texture.api.getDeipReferences();
                    const authors = texture.api.getAuthors();
                    
                    const deipAuthors = this.membersList.filter(m => authors.some(a => a.alias === m.account.name));
                    const deipRefsPromises = deipRefs.filter(ref => ref.researchGroupPermlink != this.researchGroupPermlink && ref.researchPermlink != this.researchPermlink)
                        .map(ref => 
                            deipRpc.api.getResearchContentByAbsolutePermlinkAsync(ref.researchGroupPermlink, ref.researchPermlink, ref.researchContentPermlink)
                        );

                    Promise.all(deipRefsPromises)
                        .then((contents) => {
                            this.proposeContent.deipRefs = contents;
                            this.proposeContent.authors = deipAuthors;
                            this.proposeContent.title = articleTitle || "";
                            this.proposeContent.isOpen = true;
                        });
                } else if (this.contentRef.type === 'file') {
                    this.proposeContent.isOpen = true;
                }
            },

            closeContentProposalDialog() {
                this.proposeContent.isOpen = false;
            },

            isAuthorSelected(member) {
                return this.proposeContent.authors.some(a => a.account.name === member.account.name)
            },

            unlockDraft() {
                contentHttpService.unlockContentDraft(this.contentRef._id)
                    .then(() => {
                        location.reload()
                    }, (err) => {
                        console.log(err)
                    })
            },
            isDraftAuthor(member, i) {
                return this.contentRef ? this.contentRef.authors.some(a => a === member.account.name) : false;
            },
            setDraftAuthor(event, member) {
                // used by checkbox
                event.preventDefault();
                event.stopPropagation();
                const checked = event.target.checked;
                const authors = checked
                    ? [...this.contentRef.authors, member.account.name] 
                    : this.contentRef.authors.filter(a => a !== member.account.name);
                this.setDraftAuthors(this.membersList.filter(m => authors.some(a => a === m.account.name)));
            },
            setDraftAuthors(authors) {
                // used by selectlist
                const texture = this.$store.getters['rcd/texture']; 
                const persons = texture.api.getAuthors();
                const deletedAuthors = persons
                    .filter(p => !authors.some(a => a.account.name == p.alias))
                    // filter out authors without DEIP account
                    .filter(p => this.membersList.some(m => m.account.name === p.alias));
                const addedAuthors = authors.filter(a => !persons.some(p => a.account.name == p.alias)); 
                for (let i = 0; i < deletedAuthors.length; i++) { 
                    let person = deletedAuthors[i];
                    texture.api.removeAuthor(person);
                } 

                for (let i = 0; i < addedAuthors.length; i++) { 
                    let author = addedAuthors[i];
                    let alias = author.account.name;
                    let surname = author.profile && author.profile.lastName ? author.profile.lastName : "";
                    let givenName = author.profile && author.profile.firstName ? author.profile.firstName : alias;
                    texture.api.addAuthor(alias, surname, givenName);
                }
                this.$store.dispatch('rcd/setDraftAuthors', authors.map(a => a.account.name));
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
