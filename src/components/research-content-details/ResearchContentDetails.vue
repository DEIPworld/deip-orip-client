<template>
  <base-page-layout content-class="xl9 lg9 md9 sm12 xs12" right-sidebar-class="xl3 lg3 md3 sm12 xs12">
    <div slot="content" class="full-height">
      <v-card class="full-height">
        <v-layout row>
          
          <v-flex shrink v-if="isInProgress">
            <v-card class="full-height">
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
            </v-card>
          </v-flex>

          <v-flex grow>
            <research-content-details-package v-if="isFilePackageContent"></research-content-details-package>
            <research-content-details-dar v-if="isDarContent" :contentRef="contentRef" :researchGroupMembers="membersList"></research-content-details-dar>
            <research-content-details-eci v-if="isPublished"></research-content-details-eci>
            <v-divider class="mx-5"></v-divider>

            <!-- START Research Content Reviews section -->
            <div v-if="isPublished && contentReviewsList.length" class="px-5 py-4">
              <div id="reviews">
                <div class="py-2 title">Reviews: {{ contentReviewsList.length }}</div>
                <div class="py-2">
                  <div v-for="(review, i) in contentReviewsList" :key="`review-${i}`">
                    <review-tile class="my-2" :review="review" :researchContentType="content.content_type"></review-tile>
                    <v-divider v-if="i != contentReviewsList.length - 1"></v-divider>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isPublished && !isResearchGroupMember" class="px-5 pt-2 pb-5">
              <v-card class="py-4 px-5">
                <v-layout id="reviews" class="py-2" row>
                  <v-flex shrink align-self-center pr-5>
                    <img src="/assets/img/add-review.png" />
                  </v-flex>
                  <v-flex grow align-self-center pl-5>
                    <div class="pb-3">
                      <div v-if="!contentReviewsList.length" class="pb-1 subheading half-bold">There are no reviews for this material yet</div>
                      <div v-if="userHasResearchExpertise && !userHasReview">You will get <span class="body-2">approximately 3000 ECI reward in {{userRelatedExpertise.map(exp => exp.discipline_name).join(", ")}}</span> for your contribution to this project</div>
                      <div v-else-if="userHasResearchExpertise && userHasReview" class="pb-1 subheading half-bold">You have reviewed this material already</div>
                      <div v-else-if="!userHasResearchExpertise">Users with expertise in <span class="body-2">{{research.disciplines.map(d => d.name).join(", ")}}</span> can review this project only</div>
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
          </v-flex>
        </v-layout>

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
                  <div class="pl-2">
                    <platform-avatar
                      :user="data.item"
                      :size="30"
                      noFollow
                      noFollowName
                      link-to-profile-class="pl-2"
                    ></platform-avatar>
                  </div>
                </template>

                <template slot="item" slot-scope="data">
                  <template>
                    <div class="author-item"  :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                      <platform-avatar
                        :user="data.item"
                        :size="30"
                        noFollow
                        noFollowName
                        link-to-profile-class="pl-2"
                      ></platform-avatar>
                    </div>
                  </template>
                </template>
              </v-autocomplete>

              <internal-references-picker 
                :showSelected="true"
                :currentResearchId="research.id"
                :preselected="contentRef.references" 
                @referenceAdded="addReference" 
                @referenceRemoved="removeReference">
              </internal-references-picker>

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
      </v-card>
    </div>

    <div class="full-height" slot="right-sidebar">
      <research-content-details-sidebar @setDraftAuthors="setDraftAuthors"></research-content-details-sidebar>
    </div>
    
  </base-page-layout>

</template>

<script>
import { mapGetters } from 'vuex';
import deipRpc from '@deip/deip-oa-rpc-client';
import { contentTypesList, getResearchContentType } from './../../services/ResearchService';
import { createContentProposal } from './../../services/ProposalService';
import contentHttpService from './../../services/http/content';
import searchHttpService from './../../services/http/search';
import { bus } from './../../main';

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
      isInProgress: 'rcd/isInProgress',
      isFilePackageContent: 'rcd/isFilePackageContent',
      isDarContent: 'rcd/isDarContent',
      isPublished: 'rcd/isPublished',
      isPersonalGroup: 'rcd/isPersonalGroup',
      isResearchGroupMember: 'rcd/isResearchGroupMember',
      isCreatingReviewAvailable: 'rcd/isCreatingReviewAvailable',
      userHasResearchExpertise: 'rcd/userHasResearchExpertise',
      userHasReview: 'rcd/userHasReview',      
      isSavingDraftAvailable: 'rcd/isSavingDraftAvailable'
    }),

    isCreatingProposalAvailable(state, getters, rootState, rootGetters) {
      return this.proposeContent.title && this.proposeContent.type && this.proposeContent.authors.length;
    },

    userRelatedExpertise() {
      return this.userExperise.filter(exp => this.research.disciplines.some(d => d.id == exp.discipline_id))
    },
  },
  
  methods: {
    openContentProposalDialog() {
      const openDialog = (title) => {
        this.proposeContent.title = title;
        this.proposeContent.authors = this.membersList.filter(m => this.contentRef.authors.some(a => a === m.account.name));
        this.proposeContent.isOpen = true;
      }
      if (this.isDarContent) {
        bus.$emit('texture:getArticleTitle', openDialog);
      } else if (this.isFileContent) {
        openDialog(this.contentRef.title)
      }
    },

    closeContentProposalDialog() {
      this.proposeContent.isOpen = false;
    },

    sendContentProposal() {
      this.proposeContent.isLoading = true;

      const saveDocument = () => {
        if (this.isDarContent) {
          return new Promise((resolve, reject) => {
            bus.$emit('texture:saveDocument', resolve);
          })
          .then(() => {
            return contentHttpService.getContentRefById(this.contentRef._id);
          });
        } else {
          return contentHttpService.getContentRefById(this.contentRef._id);
        }
      }

      saveDocument()
        .then((contentRef) => {
          contentRef.title = this.proposeContent.title || contentRef.title;
          contentRef.authors = this.proposeContent.authors.map(a => a.account.name);
          contentRef.references = [...this.contentRef.references];

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
      contentHttpService.getContentRefById(this.contentRef._id)
        .then((draft) => {
          if (draft.status == 'in-progress') {
            bus.$emit('texture:saveDocument', () => {
              this.isSavingDraft = false;
              this.$store.dispatch('layout/setSuccess', { message: "Document draft has been saved !" });
            });
          } else {
            this.isSavingDraft = false;
            this.$store.dispatch('layout/setError', { message: "Document draft is locked for editing !" });
          }
        });
    },

    setDraftAuthors(authors) {
      if (!authors.length) return;
      bus.$emit('texture:setAuthors', { authors, members: this.membersList });
      this.$store.dispatch('rcd/setDraftAuthors', authors.map(a => a.account.name));
    },
    
    isAuthorSelected(member) {
      return this.proposeContent.authors.some(a => a.account.name === member.account.name)
    },
    
    addReference(reference) {
      bus.$emit('texture:addReference', { reference });
      const refs = this.contentRef.references.slice();
      refs.push(reference.id);
      this.$store.dispatch('rcd/setDraftReferences', refs);
    },
    
    removeReference(reference) {
      bus.$emit('texture:removeReference', { reference });
      const refs = this.contentRef.references.slice().filter(r => r != reference.id);
      this.$store.dispatch('rcd/setDraftReferences', refs);
    },
    getResearchContentType
  },
};
</script>

<style lang="less" scoped>
</style>
