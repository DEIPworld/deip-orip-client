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

        <d-stack gap="32">

          <d-stack gap="4">
            <div class="text-overline text--secondary">
              project
            </div>
            <div>
              <router-link
                :to="{ name: 'project.details', params: { projectExternalId: research.external_id } }"
                class="link text--primary text-decoration-none"
              >
                {{ research.title }}
                <v-icon>
                  mdi-arrow-top-right-thin-circle-outline
                </v-icon>
              </router-link>
            </div>
          </d-stack>

          <template v-if="isDarContent">
            <content-dar :dar-id="contentRef._id" readonly />
          </template>

          <template v-if="isFilePackageContent">
            <d-stack gap="4">
              <div class="text-overline text--secondary">
                Subject
              </div>
              <div class="text-h3">
                <span class="font-weight-regular">
                  {{ getResearchContentType(content.content_type).text }}:
                  {{ content.title }}
                </span>
              </div>
            </d-stack>
            <research-content-details-package />
          </template>


          <reviews-list
            v-if="content && content.external_id"
            :project-id="content.research_external_id"
            :content-id="content.external_id"
            :disabled-creating="!isCreatingReviewAvailable || isResearchGroupMember"
            :discipline-id="research.disciplines.map(({external_id}) => external_id)"
            :exclude-users="research.members"
          >
            <template #create-messages>
              <template v-if="!contentReviewsList.length">
                <div class="mb-2">No reviews yet.</div>
                <div v-if="!userHasResearchExpertise || isReseachGroupMember">
                  To add review you need expertise in
                  {{ research.disciplines.map(d => d.name).join(', ') }}
                  and have no relations to this project or project’s group.
                </div>
                <div v-if="userHasResearchExpertise && !userHasReview && !isReseachGroupMember">
                  You will get approximately 3000 ECI reward in
                  {{ userRelatedExpertise.map(exp => exp.discipline_name).join(', ') }}
                  for your contribution to this project
                </div>
              </template>

              <div v-else-if="userHasResearchExpertise && !userHasReview && !isReseachGroupMember">
                You will get approximately 3000 ECI reward in
                {{ userRelatedExpertise.map(exp => exp.discipline_name).join(', ') }}
                for your contribution to this project
              </div>

              <div v-else-if="userHasResearchExpertise && userHasReview">
                You have reviewed this material already
              </div>

              <div v-else-if="!userHasResearchExpertise || isReseachGroupMember">
                To add review you need expertise in
                {{ research.disciplines.map(d => d.name).join(', ') }}
                and have no relations to this project or project’s group.
              </div>
            </template>
          </reviews-list>

        </d-stack>

      </v-skeleton-loader>

    </d-layout-section-main>

    <d-layout-section-sidebar>
      <v-skeleton-loader
        :loading="!$ready"
        min-height="232px"
        :class="{'mt-12': !$ready, 'ml-6': !$ready}"
        width="500"
        type="heading"
      >
        <research-content-details-sidebar />
        <!--        <research-content-details-sidebar @setDraftAuthors="setDraftAuthors" />-->
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
  import DLayout from '@/components/Deipify/DLayout/DLayout';
  import ReferencesSelector from '@/features/References/components/Selector/ReferencesSelector';
  import ContentDar from '@/features/Contents/components/Dar/ContentDar';

  const searchService = SearchService.getInstance();
  const researchContentService = ResearchContentService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchContentDetails',
    components: {
      ContentDar,
      ReferencesSelector,
      DLayout,
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
        return this.userExperise.filter(
          (exp) => exp.amount > 0 && this.research.disciplines.some(
            (d) => d.id == exp.discipline_id
          )
        );
      },
      isReseachGroupMember() {
        return this.$store.getters['auth/userIsResearchGroupMemberExId'](this.research.research_group.external_id);
      },
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
      // openContentProposalDialog() {
      //   const openDialog = (title) => {
      //     this.proposeContent.title = title;
      //     this.proposeContent.authors = this.researchMembersList.filter((m) => this.contentRef.authors.some((a) => a === m.account.name));
      //     this.proposeContent.isOpen = true;
      //   };
      //   if (this.isDarContent) {
      //     bus.$emit('texture:getArticleTitle', openDialog);
      //   } else {
      //     openDialog(this.contentRef.title);
      //   }
      // },
      //
      // closeContentProposalDialog() {
      //   this.proposeContent.isOpen = false;
      // },

      // sendContentProposal() {
      //   researchContentService.checkResearchContentExistenceByPermlink(this.research.external_id, this.proposeContent.title)
      //     .then((exists) => {
      //       this.isPermlinkVerifyed = !exists;
      //
      //       if (this.isPermlinkVerifyed) {
      //         this.proposeContent.isLoading = true;
      //
      //         const saveDocument = () => {
      //           if (this.isDarContent) {
      //             return new Promise((resolve, reject) => {
      //               bus.$emit('texture:saveDocument', resolve);
      //             })
      //               .then(() => researchContentService.getContentRefById(this.contentRef._id));
      //           }
      //           return researchContentService.getContentRefById(this.contentRef._id);
      //         };
      //
      //         saveDocument()
      //           .then((contentRef) => {
      //             const isProposal = !this.research.research_group.is_personal;
      //             researchContentService.createResearchContent(
      //               {
      //                 privKey: this.user.privKey,
      //                 username: this.user.username
      //               },
      //               isProposal,
      //               {
      //                 researchExternalId: this.research.external_id,
      //                 researchGroup: this.research.research_group.external_id,
      //                 type: parseInt(this.proposeContent.type),
      //                 title: this.proposeContent.title || contentRef.title,
      //                 content: contentRef.hash,
      //                 authors: this.proposeContent.authors.map((a) => a.account.name),
      //                 references: [...this.contentRef.references],
      //                 extensions: []
      //               }
      //             )
      //               .then(() => {
      //                 this.$notifier.showSuccess('New material has been uploaded successfully');
      //               }, (err) => {
      //                 console.error(err);
      //                 if (err.response && err.response.status === 409) {
      //                   alert('This file was already uploaded. Please vote for existing proposal or propose file again if its existing proposal has expired.');
      //                 } else {
      //                   this.$notifier.showError('An error occurred while creating proposal, please try again later');
      //                 }
      //               })
      //               .finally(() => {
      //                 this.proposeContent.isOpen = false;
      //                 this.proposeContent.isLoading = false;
      //                 setTimeout(() => {
      //                   this.$router.push({
      //                     name: 'project.details',
      //                     params: {
      //                       researchExternalId: this.research.external_id
      //                     }
      //                   });
      //                 }, 1500);
      //               });
      //           });
      //       }
      //     })
      //     .catch((error) => {
      //       this.isPermlinkVerifyed = false;
      //     });
      // },

      // saveDraft() {
      //   this.isSavingDraft = true;
      //   researchContentService.getContentRefById(this.contentRef._id)
      //     .then((draft) => {
      //       if (draft.status == 'in-progress') {
      //         bus.$emit('texture:saveDocument', () => {
      //           this.isSavingDraft = false;
      //           this.$notifier.showSuccess('Document draft has been saved !');
      //         });
      //       } else {
      //         this.isSavingDraft = false;
      //         this.$notifier.showError('Document draft is locked for editing !');
      //       }
      //     });
      // },

      // setDraftAuthors(authors) {
      //   if (!authors.length) return;
      //   bus.$emit('texture:setAuthors', {
      //     authors,
      //     members: this.researchMembersList
      //   });
      //   this.$store.dispatch('rcd/setDraftAuthors', authors.map((a) => a.account.name));
      // },

      // isAuthorSelected(member) {
      //   return this.proposeContent.authors.some((a) => a.account.name === member.account.name);
      // },

      // addReference(reference) {
      //   bus.$emit('texture:addReference', { reference });
      //   const refs = this.contentRef.references.slice();
      //   refs.push(reference.external_id);
      //   this.$store.dispatch('rcd/setDraftReferences', refs);
      // },

      // removeReference(reference) {
      //   bus.$emit('texture:removeReference', { reference });
      //   const refs = this.contentRef.references.slice()
      //     .filter((r) => r != reference.external_id);
      //   this.$store.dispatch('rcd/setDraftReferences', refs);
      // },

      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>
