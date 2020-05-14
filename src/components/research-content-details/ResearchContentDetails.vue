<template>
  <base-page-layout>
    <template #sidebar>
      <layout-sidebar right>
        <research-content-details-sidebar @setDraftAuthors="setDraftAuthors" />
      </layout-sidebar>
    </template>

    <v-row>
      <v-col cols="auto" v-if="isInProgress">
        <v-card class="full-height">
          <div>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="isSavingDraftAvailable"
                  text
                  icon
                  color="primary"
                  :loading="isSavingDraft"
                  :disabled="isSavingDraft"
                  v-on="on"
                  @click="saveDraft()"
                >
                  <v-icon>save</v-icon>
                </v-btn>
              </template>
              <span>Save Draft</span>
            </v-tooltip>
          </div>
          <div>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="isInProgress"
                  text
                  icon
                  color="primary"
                  v-on="on"
                  @click="openContentProposalDialog()"
                >
                  <v-icon>send</v-icon>
                </v-btn>
              </template>

              <span>{{ !isCentralizedGroup ? 'Create Proposal' : 'Upload Material' }}</span>
            </v-tooltip>
          </div>
        </v-card>
      </v-col>
      <v-col>
        <research-content-details-package v-if="isFilePackageContent" />
        <research-content-details-dar
          v-if="isDarContent"
          :content-ref="contentRef"
          :research-group-members="membersList"
        />
        <research-content-details-eci v-if="isPublished" />
        <v-divider />

        <!-- START Research Content Reviews section -->
        <div v-if="isPublished && contentReviewsList.length" class="py-6">
          <div id="reviews">
            <div class="py-2 title">
              Reviews: {{ contentReviewsList.length }}
            </div>
            <div class="py-2">
              <div v-for="(review, i) in contentReviewsList" :key="`review-${i}`">
                <review-tile
                  class="my-2"
                  :review="review"
                  :research-content-type="content.content_type"
                />
                <v-divider v-if="i != contentReviewsList.length - 1" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="isPublished && !isResearchGroupMember" class="pt-2 pb-12">
          <v-card class="py-6 px-12">
            <v-row id="reviews" class="py-2">
              <v-col class="shrink pr-12" align-self="center">
                <img src="/assets/img/add-review.png">
              </v-col>
              <v-col class="grow pl-12" align-self="center">
                <div class="pb-4">
                  <div v-if="!contentReviewsList.length" class="pb-1 subtitle-1 font-weight-bold">
                    There are no reviews for
                    this material yet
                  </div>
                  <div v-if="userHasResearchExpertise && !userHasReview">
                    You will get <span class="body-2 font-weight-bold">approximately 3000 ECI reward in {{ userRelatedExpertise.map(exp => exp.discipline_name).join(', ') }}</span>
                    for your contribution to this project
                  </div>
                  <div v-else-if="userHasResearchExpertise && userHasReview" class="pb-1 subtitle-1 half-bold">
                    You
                    have reviewed this material already
                  </div>
                  <div v-else-if="!userHasResearchExpertise">
                    Users with expertise in <span class="body-2">{{ research.disciplines.map(d => d.name).join(', ') }}</span>
                    can review this project only
                  </div>
                </div>
                <div style="width: 200px">
                  <v-btn
                    :to="{
                      name: 'ResearchContentAddReview',
                      params: {
                        group_permlink: decodeURIComponent(research.research_group.permlink),
                        research_permlink: decodeURIComponent(research.permlink),
                        content_permlink: decodeURIComponent(content.permlink),
                      }}"
                    :disabled="!isCreatingReviewAvailable"
                    block
                    color="primary"
                    class="ma-0"
                  >
                    Add review
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <!-- START Proposal dialog section -->
    <v-dialog
      v-if="research"
      v-model="proposeContent.isOpen"
      persistent
      transition="scale-transition"
      max-width="600px"
    >
      <v-card class="pa-6">
        <v-card-title>
          <div class="headline">
            Upload material for research
          </div>
          <div class="right-top-angle">
            <v-btn icon class="pa-0 ma-0" @click="closeContentProposalDialog()">
              <v-icon color="black">
                close
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="proposeContent.title"
            label="Title"
            hide-details
          />

          <v-select
            v-model="proposeContent.type"
            :items="proposeContent.researchContentTypes"
            label="Content Type"
            class="c-mt-6"
            item-value="id"
          />

          <v-autocomplete
            v-model="proposeContent.authors"
            :items="membersList"
            :menu-props="{ closeOnContentClick: true }"
            hint="You can select multiple authors"
            persistent-hint
            placeholder="Authors"
            multiple
            @change="setDraftAuthors"
          >
            <template slot="selection" slot-scope="data">
              <div class="pl-2">
                <platform-avatar
                  :user="data.item"
                  :size="30"
                  no-follow
                  no-follow-name
                  link-to-profile-class="pl-2"
                />
              </div>
            </template>

            <template slot="item" slot-scope="data">
              <template>
                <div class="author-item" :class="{ 'selected-author-item': isAuthorSelected(data.item) }">
                  <platform-avatar
                    :user="data.item"
                    :size="30"
                    no-follow
                    no-follow-name
                    link-to-profile-class="pl-2"
                  />
                </div>
              </template>
            </template>
          </v-autocomplete>

          <internal-references-picker
            :show-selected="true"
            :current-research="research"
            :preselected="contentRef.references"
            @referenceAdded="addReference"
            @referenceRemoved="removeReference"
          />
        </v-card-text>

        <v-card-actions class="px-6">
          <v-row no-gutters>
            <v-col class="py-2" cols="12">
              <v-btn
                color="primary"
                :disabled="proposeContent.isLoading || !isCreatingProposalAvailable"
                :loading="proposeContent.isLoading"
                block
                @click="sendContentProposal()"
              >
                {{ !isCentralizedGroup ? 'Create Proposal' : 'Upload Material' }}
              </v-btn>
            </v-col>
            <v-col class="py-2" cols="12">
              <v-btn
                :disabled="proposeContent.sLoading"
                color="primary"
                block
                text
                @click="closeContentProposalDialog()"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- END Proposal dialog section -->
  </base-page-layout>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { bus } from '@/main';

  import { ResearchContentService } from '@deip/research-content-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchService } from '@deip/research-service';

  import { researchContentTypes } from '@/variables';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';

  const researchContentService = ResearchContentService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchContentDetails',
    components: { LayoutSidebar },
    data() {
      return {
        isSavingDraft: false,
        proposeContent: {
          title: '',
          type: null,
          authors: [],
          researchContentTypes,
          isOpen: false,
          isLoading: false
        }
      };
    },

    computed: {
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
        isCentralizedGroup: 'rcd/isCentralizedGroup',

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
        return this.userExperise.filter((exp) => this.research.disciplines.some((d) => d.id == exp.discipline_id));
      }
    },

    methods: {
      openContentProposalDialog() {
        const openDialog = (title) => {
          this.proposeContent.title = title;
          this.proposeContent.authors = this.membersList.filter((m) => this.contentRef.authors.some((a) => a === m.account.name));
          this.proposeContent.isOpen = true;
        };
        if (this.isDarContent) {
          bus.$emit('texture:getArticleTitle', openDialog);
        } else {
          openDialog(this.contentRef.title);
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
              .then(() => researchContentService.getContentRefById(this.contentRef._id));
          }
          return researchContentService.getContentRefById(this.contentRef._id);
        };

        saveDocument()
          .then((contentRef) => {
            const isProposal = !this.research.research_group.is_personal;
            researchContentService.createResearchContentViaOffchain(this.user.privKey, isProposal, {
              researchExternalId: this.research.external_id,
              researchGroup: this.research.research_group.external_id,
              type: parseInt(this.proposeContent.type),
              title: this.proposeContent.title || contentRef.title,
              content: contentRef.hash,
              permlink: contentRef.title.replace(/ /g, '-').replace(/_/g, '-').toLowerCase(),
              authors: this.proposeContent.authors.map((a) => a.account.name),
              references: [...this.contentRef.references],
              foreignReferences: [],
              extensions: []
            })
              .then(() => {
                this.$store.dispatch('layout/setSuccess', {
                  message: 'New material has been uploaded successfully'
                });
              }, (err) => {
                console.log(err);
                if (err.response && err.response.status === 409) {
                  alert('This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.');
                } else {
                  this.$store.dispatch('layout/setError', {
                    message: 'An error occurred while creating proposal, please try again later'
                  });
                }
              })
              .finally(() => {
                this.proposeContent.isOpen = false;
                this.proposeContent.isLoading = false;
                setTimeout(() => {
                  this.$router.push({
                    name: 'ResearchDetails',
                    params: {
                      research_group_permlink: encodeURIComponent(this.research.research_group.permlink),
                      research_permlink: encodeURIComponent(this.research.permlink)
                    }
                  });
                }, 1500);
              });
          });
      },

      saveDraft() {
        this.isSavingDraft = true;
        researchContentService.getContentRefById(this.contentRef._id)
          .then((draft) => {
            if (draft.status == 'in-progress') {
              bus.$emit('texture:saveDocument', () => {
                this.isSavingDraft = false;
                this.$store.dispatch('layout/setSuccess', { message: 'Document draft has been saved !' });
              });
            } else {
              this.isSavingDraft = false;
              this.$store.dispatch('layout/setError', { message: 'Document draft is locked for editing !' });
            }
          });
      },

      setDraftAuthors(authors) {
        if (!authors.length) return;
        bus.$emit('texture:setAuthors', {
          authors,
          members: this.membersList
        });
        this.$store.dispatch('rcd/setDraftAuthors', authors.map((a) => a.account.name));
      },

      isAuthorSelected(member) {
        return this.proposeContent.authors.some((a) => a.account.name === member.account.name);
      },

      addReference(reference) {
        bus.$emit('texture:addReference', { reference });
        const refs = this.contentRef.references.slice();
        refs.push(reference.external_id);
        this.$store.dispatch('rcd/setDraftReferences', refs);
      },

      removeReference(reference) {
        bus.$emit('texture:removeReference', { reference });
        const refs = this.contentRef.references.slice()
          .filter((r) => r != reference.external_id);
        this.$store.dispatch('rcd/setDraftReferences', refs);
      },
      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>

<style lang="less" scoped>
</style>
