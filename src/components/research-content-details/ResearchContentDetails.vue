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
              {{ $t('researchContentDetails.project') }}
            </div>
            <div>
              <router-link
                :to="{ name: 'project.details', params: { projectId: research.external_id } }"
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
                {{ $t('researchContentDetails.subject') }}
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
            :disable-create-route="!isCreatingReviewAvailable || isResearchGroupMember"
            :discipline-id="research.disciplines.map(({external_id}) => external_id)"
            :exclude-users="research.members"
          >
            <template #create-messages>
              <template v-if="!contentReviewsList.length">
                <div class="mb-2">
                  {{ $t('reviews.noReviews') }}
                </div>
                <div v-if="!userHasResearchExpertise || isReseachGroupMember">
                  {{
                    $hasModule(DEIP_MODULE.APP_ECI)
                      ? $t('reviews.needExpertiseAndNotMembers', { disciplines: research.disciplines.map(d => d.name).join(', ') })
                      : $t('reviews.needNotMembers')
                  }}
                </div>
                <div v-if="userHasResearchExpertise && !userHasReview && !isReseachGroupMember">
                  {{                
                    $hasModule(DEIP_MODULE.APP_ECI)
                      ? $t('reviews.eciForContribution', { countEci: 3000, disciplines: userRelatedExpertise.map(exp => exp.discipline_name).join(', ') })
                      : ''
                  }}
                </div>
              </template>

              <div v-else-if="userHasResearchExpertise && !userHasReview && !isReseachGroupMember">
                {{ 
                  $hasModule(DEIP_MODULE.APP_ECI)
                    ? $t('reviews.eciForContribution', { countEci: 3000, disciplines: userRelatedExpertise.map(exp => exp.discipline_name).join(', ') })
                    : ''
                }}
              </div>

              <div v-else-if="userHasResearchExpertise && userHasReview">
                {{ $t('reviews.reviewedAlready') }}
              </div>

              <div v-else-if="!userHasResearchExpertise || isReseachGroupMember">
                {{
                  $hasModule(DEIP_MODULE.APP_ECI)
                    ? $t('reviews.needExpertiseAndNotMembers', { disciplines: research.disciplines.map(d => d.name).join(', ') })
                    : $t('reviews.needNotMembers')
                }}
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
      </v-skeleton-loader>
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { bus } from '@/main';

  import { ResearchService } from '@deip/research-service';
  import { SearchService } from '@deip/search-service';

  import { researchContentTypes, maxTitleLength } from '@/variables';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';
  import ReviewsList from '@/features/Reviews/components/List/ReviewsList';
  import DStack from '@/components/Deipify/DStack/DStack';
  import ContentDar from '@/features/Contents/components/Dar/ContentDar';

  const searchService = SearchService.getInstance();
  const researchService = ResearchService.getInstance();

  export default {
    name: 'ResearchContentDetails',
    components: {
      ContentDar,
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
        projectId: this.permData.projectId || this.$route.params.projectId,
        contentId: this.permData.contentId || this.$route.params.contentId,
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
      getResearchContentType(type) {
        return researchService.getResearchContentType(type);
      }
    }
  };
</script>
