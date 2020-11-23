<template>
  <d-layout-section class="full-height">
    <d-layout-section-main>
      <v-skeleton-loader
        :loading="!$ready"
        min-height="232px"
        class="full-height"
        type="article"
        :types="{
          paragraph: 'text@2'
        }"
      >

        <d-stack class="fill-height">
          <template v-if="isDarContent">
            <v-row class="fill-height">
              <v-col v-if="isInProgress" cols="auto">
                <d-stack>
                  <d-simple-tooltip
                    v-if="isSavingDraftAvailable"
                    tooltip="Save Draft"
                  >
                    <v-btn
                      icon
                      color="primary"
                      :loading="isSavingDraft"
                      :disabled="isSavingDraft"
                      @click="saveDraft()"
                    >
                      <v-icon>save</v-icon>
                    </v-btn>
                  </d-simple-tooltip>
                  <d-simple-tooltip
                    v-if="isInProgress"
                    :tooltip="!isCentralizedGroup ? 'Create Proposal' : 'Upload Material'"
                  >
                    <v-btn
                      icon
                      color="primary"
                      @click="openContentProposalDialog()"
                    >
                      <v-icon>send</v-icon>
                    </v-btn>
                  </d-simple-tooltip>
                </d-stack>
              </v-col>
              <v-col>
                <research-content-details-dar
                  v-if="isDarContent"
                  :content-ref="contentRef"
                  :research-members="researchMembersList"
                />
              </v-col>
            </v-row>
          </template>

          <research-content-details-package v-if="isFilePackageContent" />

          <template v-if="isPublished && contentReviewsList.length">
            <reviews-list
              v-if="content && Object.keys(content).length"
              :content-id="content.external_id"
            />
          </template>

          <div v-if="isPublished && !isResearchGroupMember" class="pt-2 pb-12">
            <v-card class="py-6 px-12">
              <v-row id="reviews" class="py-2">
                <v-col class="shrink pr-12" align-self="center">
                  <img src="/assets/img/add-review.png">
                </v-col>
                <v-col class="grow pl-12" align-self="center">
                  <div class="pb-4">
                    <div v-if="!contentReviewsList.length" class="pb-1 text-subtitle-1 font-weight-bold">
                      There are no reviews for this material yet
                    </div>
                    <div v-if="userHasResearchExpertise && !userHasReview">
                      You will get <span class="text-body-2 font-weight-bold">approximately 3000 ECI reward in {{
                        userRelatedExpertise.map(exp => exp.discipline_name)
                          .join(', ')
                      }}</span>
                      for your contribution to this project
                    </div>
                    <div v-else-if="userHasResearchExpertise && userHasReview" class="pb-1 text-subtitle-1 half-bold">
                      You
                      have reviewed this material already
                    </div>
                    <div v-else-if="!userHasResearchExpertise">
                      Users with expertise in <span class="text-body-2">{{
                        research.disciplines.map(d => d.name)
                          .join(', ')
                      }}</span>
                      can review this project
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

        </d-stack>

        <!-- START Proposal dialog section -->
        <v-dialog
          v-if="research && $ready"
          v-model="proposeContent.isOpen"
          persistent
          transition="scale-transition"
          max-width="600px"
        >
          <v-card class="pa-6">
            <v-card-title>
              <div class="text-h5">
                Upload material for project
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
                outlined
                :rules="[rules.titleLength]"
                label="Title"
                :error-messages="isPermlinkVerifyed === false ? 'ContentDetails with the same name already exists' : ''"
              />

              <v-select
                v-model="proposeContent.type"
                :items="proposeContent.researchContentTypes"
                label="Content Type"
                outlined
                item-value="id"
              />

              <v-autocomplete
                v-model="proposeContent.authors"
                :items="researchMembersList"
                :menu-props="{ closeOnContentClick: true }"
                hint="You can select multiple authors"
                persistent-hint
                outlined
                placeholder="Authors"
                class="mb-3"
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
                :all-references-list="allReferencesList"
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
      </v-skeleton-loader>

      <!-- END Proposal dialog section -->
    </d-layout-section-main>

    <d-layout-section-sidebar>
      <v-skeleton-loader
        :loading="!$ready"
        min-height="232px"
        :class="{'mt-12': !$ready, 'ml-6': !$ready}"
        width="500"
        type="heading"
      >
        <research-content-details-sidebar @setDraftAuthors="setDraftAuthors" />
      </v-skeleton-loader>
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { bus } from '@/main';

  import { ResearchContentService } from '@deip/research-content-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchService } from '@deip/research-service';
  import { SearchService } from '@deip/search-service';

  import { researchContentTypes, maxTitleLength } from '@/variables';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';
  import ReviewsList from '@/features/Reviews/components/List/ReviewsList';
  import DStack from '@/components/Deipify/DStack/DStack';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';

  const searchService = SearchService.getInstance();
  const researchContentService = ResearchContentService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchContentDetails',
    components: {
      DSimpleTooltip,
      DStack,
      ReviewsList,
      DLayoutSectionSidebar,
      DLayoutSectionMain,
      DLayoutSection
    },

    props: {
      permData: { // temp solution
        type: Object,
        default: () => ({})
      }
    },

    data() {
      return {
        isSavingDraft: false,
        isPermlinkVerifyed: true,
        rules: {
          titleLength: (value) => value.length <= maxTitleLength || this.$t('defaultNaming.fieldRules.titleMax', { maxTitleLength })
        },
        allReferencesList: [],
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
        researchMembersList: 'rcd/researchMembersList',
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
        return this.proposeContent.title && this.proposeContent.title.length <= maxTitleLength && this.proposeContent.type && this.proposeContent.authors.length;
      },

      userRelatedExpertise() {
        return this.userExperise.filter((exp) => exp.amount > 0 && this.research.disciplines.some((d) => d.id == exp.discipline_id));
      }
    },

    created() {
      this.$store.dispatch('rcd/loadResearchContentDetails', {
        group_permlink: decodeURIComponent(this.permData.groupPermalink || this.$route.params.research_group_permlink),
        research_permlink: decodeURIComponent(this.permData.projectPermalink || this.$route.params.research_permlink),
        content_permlink: decodeURIComponent(this.permData.contentPermalink || this.$route.params.content_permlink),
        ref: this.$route.query.ref
      })
        .then(() => {
          this.$setReady();
        });
      searchService.getAllResearchContents()
        .then((contents) => {
          this.allReferencesList.push(...contents);
        });
    },

    methods: {
      openContentProposalDialog() {
        const openDialog = (title) => {
          this.proposeContent.title = title;
          this.proposeContent.authors = this.researchMembersList.filter((m) => this.contentRef.authors.some((a) => a === m.account.name));
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
        researchContentService.checkResearchContentExistenceByPermlink(this.research.external_id, this.proposeContent.title)
          .then((exists) => {
            this.isPermlinkVerifyed = !exists;
            if (this.isPermlinkVerifyed) {
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
                  researchContentService.createResearchContent(
                    {
                      privKey: this.user.privKey,
                      username: this.user.username
                    },
                    isProposal,
                    {
                      researchExternalId: this.research.external_id,
                      researchGroup: this.research.research_group.external_id,
                      type: parseInt(this.proposeContent.type),
                      title: this.proposeContent.title || contentRef.title,
                      content: contentRef.hash,
                      authors: this.proposeContent.authors.map((a) => a.account.name),
                      references: [...this.contentRef.references],
                      extensions: []
                    }
                  )
                    .then(() => {
                      this.$notifier.showSuccess('New material has been uploaded successfully');
                    }, (err) => {
                      console.error(err);
                      if (err.response && err.response.status === 409) {
                        alert('This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.');
                      } else {
                        this.$notifier.showError('An error occurred while creating proposal, please try again later');
                      }
                    })
                    .finally(() => {
                      this.proposeContent.isOpen = false;
                      this.proposeContent.isLoading = false;
                      setTimeout(() => {
                        this.$router.push({
                          name: 'project.details',
                          params: {
                            researchExternalId: this.research.external_id
                          }
                        });
                      }, 1500);
                    });
                });
            }
          })
          .catch((error) => {
            this.isPermlinkVerifyed = false;
          });
      },

      saveDraft() {
        this.isSavingDraft = true;
        researchContentService.getContentRefById(this.contentRef._id)
          .then((draft) => {
            if (draft.status == 'in-progress') {
              bus.$emit('texture:saveDocument', () => {
                this.isSavingDraft = false;
                this.$notifier.showSuccess('Document draft has been saved !');
              });
            } else {
              this.isSavingDraft = false;
              this.$notifier.showError('Document draft is locked for editing !');
            }
          });
      },

      setDraftAuthors(authors) {
        if (!authors.length) return;
        bus.$emit('texture:setAuthors', {
          authors,
          members: this.researchMembersList
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
