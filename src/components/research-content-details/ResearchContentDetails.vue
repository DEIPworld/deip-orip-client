<template>
  <page-container>
    <sidebar v-if="isLoadingResearchContentPage === false && isInProgress" small>
      <div >
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
            <span>Propose Content</span>
          </v-tooltip>
        </div>
      </div>
    </sidebar>
    <div class="col-grow full-height">
      <div v-if="isLoadingResearchContentPage === false">
        <research-content-details-file v-if="isFileContent"></research-content-details-file>
        <research-content-details-dar v-if="isDarContent" :contentRef="contentRef"></research-content-details-dar>
        <div class="research-reviews-container" v-if="contentReviewsList.length">
          <div class="c-pt-2 title">Reviews: {{ contentReviewsList.length }}</div>
          <div class="c-pt-6">
            <review-list-item v-for="(review, i) in contentReviewsList" :review="review" :key="i"></review-list-item>
          </div>
        </div>


        <!-- START Research Content References section -->
        <v-card v-if="isInProgress && isDarContent">
          <template>
            <div class="row c-p-3 c-mb-5">
              <div class="col-grow">
                <div class="row c-mh-auto group-members-max-width">
                  <div class="col-12">
               <!-- <div>
                      <div class="row-nowrap justify-between align-center c-pt-4"
                        v-for="(reference, i) in internalReferences.selected" :key="i + '-picked'">
                        <div>
                          {{reference.title}} ({{reference.research_title}})
                        </div>
                        <v-btn @click="removeReference(reference)" flat color="grey" class="ma-0">Remove</v-btn>
                      </div>
                    </div>
                    <v-divider class="c-mt-4 c-mb-4" v-show="internalReferences.selected.length"></v-divider> -->
                    <div>
                      <div class="row-nowrap justify-between align-center c-pt-4" v-for="(reference, i) in internalReferences.searchable" 
                        :key="i + '-selectable'" v-if="!isReferenceSelected(reference)">
                        <div>
                            <router-link target="_blank" class="a body-1"
                                :to="{ name: 'ResearchContentDetails', params: { research_group_permlink: reference.group_permlink, research_permlink: reference.research_permlink, content_permlink: reference.permlink } }">
                                {{reference.title}} ({{reference.research_title}})
                            </router-link>
                        </div>
                        <v-btn @click="addReference(reference)" flat color="primary" class="ma-0">+ Add reference</v-btn>
                      </div>
                    </div>
                    <v-text-field
                      label="Add references to material posted at DEIP"
                      single-line
                      append-icon="search"
                      prepend-icon="mdi-note-text"
                      v-model="internalReferences.search"
                      @input="searchReferences()">
                    </v-text-field>
                  </div>
                </div>
              </div>
            </div>
            <v-divider></v-divider>
          </template>
        </v-card>
        <!-- END Research Content References section -->


        <!-- START Proposal dialog section -->
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
                <div>
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
    import { contentTypes, createContentProposal } from './../../services/ResearchService';
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
                    contentTypes: contentTypes,
                    references: [],
                    isOpen: false,
                    isLoading: false
                },

                internalReferences: {
                    loading: false,
                    selected: [],
                    search: '',
                    searchable: []
                },
                
                references: []
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
                isLoadingResearchContentPage: 'rcd/isLoadingResearchContentPage',
                contentRef: 'rcd/contentRef'
            }),
            isResearchGroupMember() {
                return this.research != null 
                    ? this.$store.getters['auth/userIsResearchGroupMember'](this.research.research_group_id) 
                    : false
            },
            isFileContent() {
                return this.contentRef && this.contentRef.type === 'file';
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
                var promise;
                this.proposeContent.isLoading = true;
                if (this.isDarContent) {
                    const texture = this.$store.getters['rcd/texture'];
                    promise = texture.save()
                        .then(() => {
                            return contentHttpService.getContentRef(this.contentRef._id);
                        });
                } else if (this.isFileContent) {
                    return contentHttpService.getContentRef(this.contentRef._id);
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
            setDraftAuthors(authors) {
                if (!authors.length) return; // do not set empty list to texture
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

            isAuthorSelected(member) {
                return this.proposeContent.authors.some(a => a.account.name === member.account.name)
            },
            
            searchReferences: _.debounce(
                function() {
                    const q = this.internalReferences.search.toLowerCase();
                    if (!q) {
                        this.internalReferences.searchable = [];
                        return;
                    };
                    if (!this.references.length) {
                        searchHttpService.getAllResearchContents()
                            .then((contents) => {
                                this.references.push(...contents);
                                this.internalReferences.searchable = filter.call(this, q);
                            });
                    } else {
                        this.internalReferences.searchable = filter.call(this, q);
                    }

                    function filter(term) {
                        return this.references.filter(content => {
                            return content.title.toLowerCase().startsWith(term) && content.research_id != this.research.id;
                        });
                    }
                    
                }, 600
            ),
            
            addReference(ref) {
                const texture = this.$store.getters['rcd/texture'];
                if (!this.internalReferences.selected.some(r => r.title == ref.title)) {
                    let uri = `${location.protocol}//${process.env.HOST}/#/${ref.group_permlink}/research/${ref.research_permlink}/${ref.permlink}`;
                    let title = `${ref.title} (${ref.research_title})`, containerTitle = title;
                    texture.api.addReference(uri, title, containerTitle);
                    this.internalReferences.selected.push(ref);
                    this.internalReferences.search = '';
                    this.internalReferences.searchable = [];
                    this.$store.dispatch('rcd/setDraftReferences', this.internalReferences.selected.map(r => r.id));
                }
            },
            
            removeReference(ref) {
                const texture = this.$store.getters['rcd/texture'];
                let uri = `${location.protocol}//${process.env.HOST}/#/${ref.group_permlink}/research/${ref.research_permlink}/${ref.permlink}`;
                let reference = texture.api.getReferences().find(r => r.uri == uri);
                texture.api.removeReference(reference);
                this.internalReferences.selected = this.internalReferences.selected.filter(r => r.title != ref.title);
                this.$store.dispatch('rcd/setDraftReferences', this.internalReferences.selected.map(r => r.id));
            },

            isReferenceSelected(ref) {
                return this.contentRef.references.some(r => r == ref.id);
            }
        },
        created() {
            const permlinks = {
                group_permlink: this.$route.params.research_group_permlink,
                research_permlink: this.$route.params.research_permlink,
                content_permlink: this.$route.params.content_permlink,
                ref: this.$route.query.ref
            }
            this.$store.dispatch('rcd/loadResearchContentDetails', permlinks);
        }
    };
</script>

<style lang="less" scoped>
    .research-reviews-container {
        margin: 5%;
    }
    .deip-panel-container {
        position: relative;
        z-index: 101 !important;
        
        .save-draft-btn {
            position: absolute;
            left: 150px;
        }
        .propose-content-btn {
            position: absolute;
        }
    }
</style>
