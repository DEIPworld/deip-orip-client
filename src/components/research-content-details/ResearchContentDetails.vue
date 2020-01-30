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

                        <span>{{!isPersonalGroup ? 'Create Proposal' : 'Upload Material'}}</span>
                    </v-tooltip>
                </div>
            </div>
        </sidebar>

        <div class="legacy-col-grow full-height">
            <div>
                <research-content-details-package v-if="isFilePackageContent" class="pa-5"></research-content-details-package>
                <research-content-details-dar v-if="isDarContent" :contentRef="contentRef"></research-content-details-dar>

                <!-- START Research Content Reviews section -->
                <div v-if="isPublished && contentReviewsList.length" class="px-5">
                    <div id="reviews">
                        <div class="py-2 title">Reviews: {{ contentReviewsList.length }}</div>
                        <div class="py-2">
                            <review-tile class="my-4" v-for="(review, i) in contentReviewsList" :review="review" :key="`review-${i}`" :researchContentType="content.content_type"></review-tile>
                        </div>
                    </div>
                </div>

                <div v-if="isPublished && !isResearchGroupMember" class="px-5 pt-2 pb-5">
                    <v-card class="py-4 px-5 elevation-0">
                        <v-layout id="reviews" class="py-2" row>
                            <v-flex shrink align-self-center pr-5>
                                <img src="/static/add-review-icon.png" />
                            </v-flex>
                            <v-flex grow align-self-center pl-5>
                                <div class="pb-3">
                                    <div v-if="!contentReviewsList.length" class="pb-1 subheading half-bold">There are no reviews for this material yet</div>
                                    <div v-if="userHasExpertise && !userHasReview">You will get ECI in <span class="body-2">{{userRelatedExpertise.map(exp => exp.discipline_name).join(", ")}}</span> for your contribution to this project</div>
                                    <div v-else-if="userHasExpertise && userHasReview" class="pb-1 subheading half-bold">You have reviewed this material already</div>
                                    <div v-else-if="!userHasExpertise">Users with expertise in <span class="body-2">{{research.disciplines.map(d => d.name).join(", ")}}</span> can review this project only</div>
                                </div>
                                <div style="width: 200px">
                                    <v-btn :to="{ 
                                            name: 'ResearchContentAddReview', 
                                            params: {
                                                group_permlink: decodeURIComponent(research.group_permlink),
                                                research_permlink: decodeURIComponent(research.permlink),
                                                content_permlink: decodeURIComponent(content.permlink),
                                            }}" 
                                            :disabled="!isCreatingReviewAvailable" block color="primary" class="ma-0">
                                        Add review
                                    </v-btn>
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-card>
                </div>
                <!-- END Research Content Reviews section -->

                <!-- START Research Content References section -->
                <div v-if="isInProgress && isDarContent" class="px-5 py-2">
                    <internal-references-picker 
                        :currentResearchId="research.id"
                        :preselected="contentRef.references.slice()" 
                        @referenceAdded="addReference" 
                        @referenceRemoved="removeReference">
                    </internal-references-picker>
                </div>
                <!-- END Research Content References section -->
                <div class="px-5 py-3">
                    <v-layout row>
                        <v-flex grow>
                            <div class="half-bold title">ECI History</div>
                        </v-flex>
                        <v-flex shrink>
                            <v-select
                                class="my-0 py-0"
                                v-model="selectedDisciplineId"
                                :items="research.disciplines"
                                item-text="name"
                                item-value="id"
                                solo
                                dense
                                @change="selectEciDiscipline()"
                                :disabled="eciHistoryRecordsTable.loading"
                            ></v-select>
                        </v-flex>
                    </v-layout>

                    <v-data-table
                        :headers="eciHistoryRecordsTable.headers"
                        :items="eciHistoryRecordsTable.items"
                        class="elevation-0 mt-3"
                        disable-initial-sort
                        :loading="eciHistoryRecordsTable.loading"
                        :rows-per-page-items="[5, 10]"
                        :pagination.sync="eciHistoryRecordsTable.pagination"
                        :total-items="eciHistoryRecordsTable.totalItems"
                    >
                    <template v-slot:items="props">
                        <td>
                            <v-chip :color="eciHistoryRecordsTable.actionsColorMap[props.item.action]" text-color="white">
                                <span class="bold">{{ props.item.action.replace(/_/g, ' ').toUpperCase() }}</span>
                            </v-chip>
                        </td>
                        <td>
                            <router-link v-if="props.item.meta.link" class="a" :to="props.item.meta.link">{{props.item.meta.title}}</router-link>
                            <span v-else class="body-2">{{props.item.meta.title}}</span>
                        </td>
                        <td class="text-xs-center">{{ moment(props.item.timestamp).format('D MMM YYYY') }}</td>
                        <td class="text-xs-center">{{ props.item.delta }}</td>
                        <td class="text-xs-center">{{ props.item.newAmount }}</td>
                    </template>
                    </v-data-table>
                </div>

                <!-- START Proposal dialog section -->
                    <v-dialog v-if="research" v-model="proposeContent.isOpen" persistent transition="scale-transition" max-width="600px">
                        <v-card class="pa-4">
                            <v-card-title>
                                <v-layout align-center>
                                    <v-flex grow headline>Upload material for research</v-flex>
                                    <v-flex shrink right-top-angle>
                                        <v-btn @click="closeContentProposalDialog()" icon class="pa-0 ma-0">
                                            <v-icon color="black">close</v-icon>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card-title>
                            <v-card-text>
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
                                        :menu-props="{ closeOnContentClick: true }"
                                        v-model="proposeContent.authors"
                                        hint="You can select multiple authors"
                                        persistent-hint
                                        placeholder="Authors"
                                        v-on:change="setDraftAuthors"
                                        multiple>
                                        <template slot="selection" slot-scope="data">
                                            <div class="legacy-row-nowrap align-center c-pl-4">
                                                <v-avatar size="30px">
                                                    <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(60, 60, false)" />
                                                    <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                                </v-avatar>

                                                <span class="c-pl-3">{{ data.item | fullname }}</span>
                                            </div>
                                        </template>

                                        <template slot="item" slot-scope="data">
                                            <template>
                                                <div class="legacy-row-nowrap align-center author-item" 
                                                    :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                                                    <v-avatar size="30px">
                                                        <img v-if="data.item.profile" v-bind:src="data.item.profile.avatar | avatarSrc(60, 60, false)" />
                                                        <v-gravatar v-else :email="data.item.account.name + '@deip.world'" />
                                                    </v-avatar>

                                                    <span class="c-pl-3">{{ data.item | fullname  }}</span>
                                                </div>
                                            </template>
                                        </template>
                                    </v-autocomplete>

                                </div>
                            </v-card-text>
                            <v-card-actions>
                                <v-layout row wrap>
                                    <v-flex xs12 py-2>
                                        <v-btn color="primary"
                                            :disabled="proposeContent.isLoading || !isCreatingProposalAvailable"
                                            :loading="proposeContent.isLoading"
                                            block
                                            @click="sendContentProposal()"
                                            >{{!isPersonalGroup ? 'Create Proposal' : 'Upload Material'}}</v-btn>
                                    </v-flex>
                                    <v-flex xs12 py-2>
                                        <v-btn 
                                            @click="closeContentProposalDialog()"
                                            :disabled="proposeContent.sLoading"
                                            color="primary" 
                                            block
                                            flat>Cancel</v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-card-actions>
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
    import deipRpc from '@deip/deip-oa-rpc-client';
    import { contentTypesList, getResearchContentType } from './../../services/ResearchService';
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
                },

                selectedDisciplineId: null,

                eciHistoryRecordsTable: {
                    headers: [
                        { text: 'Type', align: 'left', sortable: false },
                        { text: 'Title', align: 'left', sortable: false },
                        { text: 'Date', align: 'center', sortable: false },
                        { text: 'ECI', align: 'center', sortable: false },
                        { text: 'Total ECI', align: 'center', sortable: false },
                    ],
                    actionsColorMap: {
                        'review': '#161F63',
                        'vote_for_review': '#5ABAD1',
                        'init': '#8DDAB3',
                    },
                    pagination: {
                        page: 1,
                        rowsPerPage: 5,
                    },
                    items: [],
                    totalItems: 0,
                    loading: false,
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
                return this.research.research_group_id == this.userPersonalGroup.id;
            },
            isResearchGroupMember() {
                return this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id);
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
                return this.userExperise.some(exp => this.research.disciplines.some(d => d.id == exp.discipline_id));
            },
            userHasReview() {
                return this.contentReviewsList.some(r => r.author.account.name === this.user.username);
            },
            isCreatingReviewAvailable() {
                const userHasReview = this.contentReviewsList.some(r => r.author.account.name === this.user.username)
                return !this.isResearchGroupMember && !userHasReview && this.userHasExpertise && this.isPublished;
            },
            userRelatedExpertise() {
                return this.userExperise.filter(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
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
                                    message: "New material has been uploaded successfully"
                                });
                            }, (err) => {
                                console.log(err);
                                if (err.response && err.response.status == 409) {
                                    alert("This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.");
                                } else {
                                    this.$store.dispatch('layout/setError', { 
                                        message: "An error occurred while creating proposal, please try again later"
                                    });
                                }
                            })
                            .finally(() => {
                                this.proposeContent.isOpen = false;
                                this.proposeContent.isLoading = false;
                                setTimeout(() => {
                                    this.$router.push({ name: 'ResearchDetails', params: {
                                        research_group_permlink: encodeURIComponent(this.research.group_permlink),
                                        research_permlink: encodeURIComponent(this.research.permlink)
                                    }});
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

            selectEciDiscipline() {
                let disciplineId = this.selectedDisciplineId;
                let researchContentId = this.content.id;

                this.eciHistoryRecordsTable.loading = true;
                let cachedRecords = this.$store.getters['rcd/eciHistoryByDiscipline'](disciplineId);
                if (cachedRecords == null) {
                    this.$store.dispatch('rcd/loadResearchContentEciHistoryRecords', { researchContentId, disciplineId })
                        .then(() => {
                            let records = this.$store.getters['rcd/eciHistoryByDiscipline'](disciplineId);
                            this.eciHistoryRecordsTable.items = records;
                            this.eciHistoryRecordsTable.pagination.page = 1;
                            this.eciHistoryRecordsTable.loading = false;
                        });
                } else {
                    this.eciHistoryRecordsTable.items = cachedRecords;
                    this.eciHistoryRecordsTable.pagination.page = 1;
                    this.eciHistoryRecordsTable.loading = false;
                }
            },

            getResearchContentType
        },

        created() {
            let discipline = this.research.disciplines[0];
            this.selectedDisciplineId = discipline.id;
            this.selectEciDiscipline(discipline.id);
        }
    };
</script>

<style lang="less" scoped>

</style>
