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
              {{ $t('projectContentDetails.project') }}
            </div>
            <div>
              <router-link
                :to="{ name: 'project.details', params: { projectId: project._id } }"
                class="link text--primary text-decoration-none"
              >
                {{ project.title }}
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
                {{ $t('projectContentDetails.subject') }}
              </div>
              <div class="text-h3">
                <span class="font-weight-regular">
                  {{ getProjectContentType(content.contentType).text }}:
                  {{ content.title }}
                </span>
              </div>
            </d-stack>
            <project-content-details-package />
          </template>


          <reviews-list
            v-if="content && content._id"
            :project-id="content.project__id"
            :content-id="content._id"
            :disable-create-route="!isCreatingReviewAvailable || isTeamMember"
            :domain-id="project.domains.map(({_id}) => _id)"
            :exclude-users="project.members"
          >
            <template #create-messages>
              <template v-if="!contentReviewsList.length">
                <div class="mb-2">
                  {{ $t('reviews.noReviews') }}
                </div>
                <div v-if="!userHasProjectExpertise || isTeamMember">
                  {{
                    $hasModule(DEIP_MODULE.APP_ECI)
                      ? $t('reviews.needExpertiseAndNotMembers', { domains: project.domains.map(d => d.name).join(', ') })
                      : $t('reviews.needNotMembers')
                  }}
                </div>
                <div v-if="userHasProjectExpertise && !userHasReview && !isTeamMember">
                  {{                
                    $hasModule(DEIP_MODULE.APP_ECI)
                      ? $t('reviews.eciForContribution', { domains: userRelatedExpertise.map(exp => exp.domainName).join(', ') })
                      : ''
                  }}
                </div>
              </template>

              <div v-else-if="userHasProjectExpertise && !userHasReview && !isTeamMember">
                {{ 
                  $hasModule(DEIP_MODULE.APP_ECI)
                    ? $t('reviews.eciForContribution', { countEci: 3000, domains: userRelatedExpertise.map(exp => exp.domainName).join(', ') })
                    : ''
                }}
              </div>

              <div v-else-if="userHasProjectExpertise && userHasReview">
                {{ $t('reviews.reviewedAlready') }}
              </div>

              <div v-else-if="!userHasProjectExpertise || isTeamMember">
                {{
                  $hasModule(DEIP_MODULE.APP_ECI)
                    ? $t('reviews.needExpertiseAndNotMembers', { domains: project.domains.map(d => d.name).join(', ') })
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
        <project-content-details-sidebar />
      </v-skeleton-loader>
    </d-layout-section-sidebar>
  </d-layout-section>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { bus } from '@/main';

  import { ProjectContentService } from '@deip/project-content-service';

  import { projectContentTypes, maxTitleLength } from '@/variables';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import DLayoutSectionSidebar from '@/components/Deipify/DLayout/DLayoutSectionSidebar';
  import ReviewsList from '@/features/Reviews/components/List/ReviewsList';
  import DStack from '@/components/Deipify/DStack/DStack';
  import ContentDar from '@/features/Contents/components/Dar/ContentDar';

  const projectContentService = ProjectContentService.getInstance();

  export default {
    name: 'ProjectContentDetails',
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
        proposeContent: {
          title: '',
          type: null,
          authors: [],
          projectContentTypes,
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
        project: 'rcd/project',
        membersList: 'rcd/membersList',
        projectMembersList: 'rcd/projectMembersList',
        contentReviewsList: 'rcd/contentReviewsList',
        contentRef: 'rcd/contentRef',
        isInProgress: 'rcd/isInProgress',
        isFilePackageContent: 'rcd/isFilePackageContent',
        isDarContent: 'rcd/isDarContent',
        isPublished: 'rcd/isPublished',
        isCentralizedGroup: 'rcd/isCentralizedGroup',

        isCreatingReviewAvailable: 'rcd/isCreatingReviewAvailable',
        userHasProjectExpertise: 'rcd/userHasProjectExpertise',
        userHasReview: 'rcd/userHasReview',
        isSavingDraftAvailable: 'rcd/isSavingDraftAvailable'
      }),

      isCreatingProposalAvailable(state, getters, rootState, rootGetters) {
        return this.proposeContent.title && this.proposeContent.title.length <= maxTitleLength && this.proposeContent.type && this.proposeContent.authors.length;
      },

      userRelatedExpertise() {
        return this.userExperise.filter(
          (exp) => exp.amount > 0 && this.project.domains.some(
            (d) => d.id == exp.domainId
          )
        );
      },
      isTeamMember() {
        return this.$store.getters['auth/userIsTeamMemberExId'](this.project.teamId);
      },
    },

    created() {
      this.$store.dispatch('rcd/loadProjectContentDetails', {
        projectId: this.permData.projectId || this.$route.params.projectId,
        contentId: this.permData.contentId || this.$route.params.contentId,
        ref: this.$route.query.ref,
        isReferencesPage: false
      })
        .then(() => {
          this.$setReady();
        });
    },

    methods: {
      getProjectContentType(type) {
        return projectContentService.getProjectContentType(type);
      }
    }
  };
</script>
