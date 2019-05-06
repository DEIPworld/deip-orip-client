<template>
    <page-container>
        <sidebar v-if="isInProgress" small>
            <div>
                <div>
                    <v-tooltip right>
                        <v-btn v-if="isSavingDraftAvailable" slot="activator" flat icon color="primary" 
                            @click="saveDraft()" :loading="isSavingDraft" :disabled="isSavingDraft">
                            <v-icon>save</v-icon>
                        </v-btn>

                        <span>Save Draft</span>
                    </v-tooltip>
                </div>

                <div>
                    <v-tooltip right>
                        <v-btn v-if="isInProgress" slot="activator" flat icon color="primary" 
                            @click="openContentProposalDialog()">
                            <v-icon>send</v-icon>
                        </v-btn>

                        <span>{{!isPersonalGroup ? 'Create Proposal' : 'Create Content'}}</span>
                    </v-tooltip>
                </div>
            </div>
        </sidebar>

        <div class="col-grow full-height">
            <div>
                <research-content-details-package v-if="isFilePackageContent"></research-content-details-package>
                <research-content-details-dar v-if="isDarContent" :contentRef="contentRef"></research-content-details-dar>

                <!-- START Research Content Reviews section -->
                <div v-if="isPublished && contentReviewsList.length">
                    <div class="sidebar-fullwidth"><v-divider></v-divider></div>

                    <div id="reviews" class="reviews-container">
                        <div class="c-pt-2 title">Reviews: {{ contentReviewsList.length }}</div>

                        <div class="c-pt-6">
                            <review-list-item v-for="(review, i) in contentReviewsList" :review="review" :key="i"></review-list-item>
                        </div>
                    </div>
                </div>

                <div v-if="contentReviewsList.length" class="c-pt-6">
                    <research-content-details-review-tab-chart>
                    </research-content-details-review-tab-chart>
                </div>

                <div v-else-if="isPublished && !contentReviewsList.length">
                    <div class="sidebar-fullwidth"><v-divider></v-divider></div>

                    <div id="reviews" class="subheading text-align-center no-reviews-container">
                        <span>There are no reviews for this {{ getContentType(content.content_type).text }} yet.</span>
                        
                        <div>
                            <span v-if="isCreatingReviewAvailable">
                                <a class="a" @click="goAddReview()">Add your review</a> to make a contribution to the research.
                            </span>
                        </div>
                    </div>
                </div>
                <!-- END Research Content Reviews section -->

                <!-- START Research Content References section -->
                <div v-if="isInProgress && isDarContent">
                    <internal-references-picker 
                        :currentResearchId="research.id"
                        :preselected="contentRef.references.slice()" 
                        @referenceAdded="addReference" 
                        @referenceRemoved="removeReference">
                    </internal-references-picker>
                </div>
                <!-- END Research Content References section -->

                <!-- START Proposal dialog section -->
                <v-dialog v-if="research" v-model="proposeContent.isOpen" persistent transition="scale-transition" max-width="500px">
                    <v-card class="">
                        <v-toolbar dark color="primary">
                            <v-btn icon dark @click="closeContentProposalDialog()">
                                <v-icon>close</v-icon>
                            </v-btn>

                            <v-toolbar-title>Propose content for the research project</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>

                        <page-container>
                            <contentbar>
                                <div>
                                    <v-text-field
                                        label="Title"
                                        v-model="proposeContent.title"
                                        hide-details>
                                    </v-text-field>

                                    <v-select v-model="proposeContent.type" 
                                        :items="proposeContent.contentTypesList" 
                                        label="Content Type" 
                                        class="c-mt-6"
                                        item-value="id">
                                    </v-select>

                                    <v-autocomplete
                                        :items="membersList"
                                        v-model="proposeContent.authors"
                                        placeholder="Authors"
                                        v-on:change="setDraftAuthors"
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
                                    </v-autocomplete>

                                    <div class="display-flex c-pt-8">
                                        <v-btn color="primary" 
                                            class="c-m-auto"
                                            :disabled="proposeContent.isLoading || !isCreatingProposalAvailable"
                                            :loading="proposeContent.isLoading"
                                            @click="sendContentProposal()"
                                        >{{!isPersonalGroup ? 'Create Proposal' : 'Create Content'}}</v-btn>
                                    </div>
                                </div>
                            </contentbar>
                        </page-container>
                    </v-card>
                </v-dialog>
                <!-- END Proposal dialog section -->
            </div>
        </div>

        <sidebar>
            <research-content-details-sidebar @setDraftAuthors="setDraftAuthors"></research-content-details-sidebar>
        </sidebar>
    </page-container>
</template>

<script>
    import { mapGetters } from 'vuex';
    import deipRpc from '@deip/deip-rpc-client';
    import { contentTypesList, getContentType } from './../../services/ResearchService';
    import { createContentProposal } from './../../services/ProposalService';
    import contentHttpService from './../../services/http/content';
    import searchHttpService from './../../services/http/search'

    export default {
        name: "ResearchContentDetails",

        data() {
            return {
                isSavingDraft: false,
                
                proposeContent: {
                    title: "",
                    type: null,
                    authors: [],
                    contentTypesList: contentTypesList,
                    isOpen: false,
                    isLoading: false
                }
            }
        },

        computed:{
            ...mapGetters({
                user: 'auth/user',
                userExperise: 'auth/userExperise',
                content: 'rcd/content',
                research: 'rcd/research',
                membersList: 'rcd/membersList',
                contentReviewsList: 'rcd/contentReviewsList',
                contentRef: 'rcd/contentRef',
                userPersonalGroup: 'auth/userPersonalGroup'
            }),
            isPersonalGroup() {
                return this.research 
                    ? this.research.research_group_id == this.userPersonalGroup.id 
                    : false;
            },
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },
            isFilePackageContent() {
                return this.contentRef && (this.contentRef.type === 'package' || this.contentRef.type === 'file' /* legacy*/);
            },
            isDarContent() {
                return this.contentRef && this.contentRef.type === 'dar';
            },
            isInProgress() {
                return this.contentRef && this.contentRef.status === 'in-progress';
            },
            isPublished() {
                return this.content != null;
            },
            isSavingDraftAvailable() {
                return this.isResearchGroupMember && this.isDarContent && this.isInProgress;
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
            goAddReview() {
                this.$router.push({ name: 'ResearchContentAddReview', params: this.$route.params });
            }
        },
        
        methods: {
            openContentProposalDialog() {
                if (this.isDarContent) {
                    const texture = this.$store.getters['rcd/texture'];
                    this.proposeContent.title = texture.api.getArticleTitle() || "";
                } else if (this.isFileContent) {
                    this.proposeContent.title = this.contentRef.title;
                }

                this.proposeContent.authors = this.membersList.filter(m => this.contentRef.authors.some(a => a === m.account.name));
                this.proposeContent.isOpen = true;
            },
            closeContentProposalDialog() {
                this.proposeContent.isOpen = false;
            },

            sendContentProposal() {
                const self = this;
                var promise;
                this.proposeContent.isLoading = true;
                if (this.isDarContent) {
                    const texture = this.$store.getters['rcd/texture'];
                    promise = texture.save()
                        .then(() => {
                            return contentHttpService.getContentRefById(this.contentRef._id);
                        });
                } else if (this.isFilePackageContent) {
                    promise = contentHttpService.getContentRefById(this.contentRef._id);
                }

                promise
                    .then((contentRef) => {
                        contentRef.title = this.proposeContent.title || contentRef.title;
                        contentRef.authors = this.proposeContent.authors.map(a => a.account.name);
                        
                        createContentProposal(contentRef, this.proposeContent.type)
                            .then(() => {
                                this.$store.dispatch('layout/setSuccess', {
                                    message: "New Content Proposal has been created successfuly!"
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
                                setTimeout(() => {
                                    self.$router.push({ name: 'ResearchFeed' });
                                }, 1500);
                            })
                    })
            },
            saveDraft() {
                this.isSavingDraft = true;
                const texture = this.$store.getters['rcd/texture'];

                contentHttpService.getContentRefById(this.contentRef._id)
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
            setDraftAuthors(authors) {
                if (!authors.length) return; // do not set empty list to texture
                if (this.isDarContent) {
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
                }
                this.$store.dispatch('rcd/setDraftAuthors', authors.map(a => a.account.name));
            },

            isAuthorSelected(member) {
                return this.proposeContent.authors.some(a => a.account.name === member.account.name)
            },
            
            addReference(ref) {
                if (this.isDarContent) {
                    const texture = this.$store.getters['rcd/texture'];
                    const uri = `${location.protocol}//${window.env.DEIP_CLIENT_HOST}/#/${encodeURIComponent(ref.group_permlink)}/research/${encodeURIComponent(ref.research_permlink)}/${encodeURIComponent(ref.permlink)}`;
                    const title = `${ref.title} (${ref.research_title})`, containerTitle = title;
                    const refs = this.contentRef.references.slice();
                    texture.api.addReference(uri, title, containerTitle);
                    refs.push(ref.id);
                    this.$store.dispatch('rcd/setDraftReferences', refs);
                }
            },
            
            removeReference(ref) {
                if (this.isDarContent) {
                    const texture = this.$store.getters['rcd/texture'];
                    const uri = `${location.protocol}//${window.env.DEIP_CLIENT_HOST}/#/${encodeURIComponent(ref.group_permlink)}/research/${encodeURIComponent(ref.research_permlink)}/${encodeURIComponent(ref.permlink)}`;
                    const reference = texture.api.getReferences().find(r => r.uri == uri);
                    texture.api.removeReference(reference);
                    const refs = this.contentRef.references.slice().filter(r => r != ref.id);
                    this.$store.dispatch('rcd/setDraftReferences', refs);
                }
            },
            getContentType
        },

        created() {
        }
    };
</script>

<style lang="less" scoped>
    .reviews-container {
        margin: 5%;
    }
    .no-reviews-container {
        margin: auto;
        width: 50%;
        margin-top: 5%;
        margin-bottom: 5%;
    }
</style>
