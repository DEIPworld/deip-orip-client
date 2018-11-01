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
        <v-card v-if="isInProgress">
          <template>
            <div class="row c-p-3">
              <div class="c-pt-6 c-pr-4">
                <v-icon color="primary">mdi-note-text</v-icon>
              </div>
              <div class="col-grow">
                <v-text-field
                  label="Material title"
                  ></v-text-field>
              </div>
              <div class="c-pt-5 c-pl-4">
                <v-btn class="ma-0" icon>
                  <v-icon color="grey">close</v-icon>
                </v-btn>
              </div>
            </div>
            <v-divider></v-divider>
          </template>
          <div class="c-p-6">
            <v-btn outline icon color="primary" class="ma-0">
              <v-icon small>add</v-icon>
            </v-btn>
            <span class="deip-blue-color c-pl-3">Add Reference to research posted at DEIP</span>
          </div>
        </v-card>
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
                    deipRefs: [],
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
                } else if (this.isFileContent) {
                    this.proposeContent.isOpen = true;
                }
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
                            return contentHttpService.getContentRef(this.contentRef._id)
                        });
                } else if (this.isFileContent) {
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
