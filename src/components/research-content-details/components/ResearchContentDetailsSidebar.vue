<template>
  <div>
    <d-block-widget v-if="!isPublished && isTeamMember && (isProposed || isUnlockActionAvailable)">
      <div v-if="isProposed" class="text-body-1">
        {{ $t('projectContentDetails.sidebar.draft') }}
        <router-link
          class="link orange--text"
          :to="{
            name: 'team.details',
            params: {
              teamId: project.teamId
            },
            hash: '#proposals'
          }"
        >
          {{ $t('projectContentDetails.sidebar.proposed') }}
        </router-link>
        {{ $t('projectContentDetails.sidebar.locked') }}
      </div>
      <div v-if="isUnlockActionAvailable" class="mt-6">
        <div class="text-body-1 pb-4">
          {{ $t('projectContentDetails.sidebar.expiredProposal') }}
        </div>
        <v-btn color="orange" block @click="unlockDraft()">
          {{ $t('projectContentDetails.sidebar.unlockDraftBtn') }}
        </v-btn>
      </div>
    </d-block-widget>

    <d-block-widget
      v-if="$hasModule(DEIP_MODULE.APP_ECI) && $route.params.contentId !== '!draft'"
      :title="$t('projectContentDetails.sidebar.eci')"
    >
      <eci-stats
        :content-id="content._id"
        :domains="domainsList"
      />
    </d-block-widget>

    <d-block-widget :title="$t('projectContentDetails.sidebar.authors')">
      <template v-if="isPublished">
        <div
          v-for="(author, index) in contentAuthorsList"
          :key="`author-${index}`"
          :class="{'pb-1' : index == 0, 'py-1': index != 0}"
        >
          <platform-avatar
            :user="author"
            :size="40"
            link-to-profile
            link-to-profile-class="pl-2"
          />
        </div>
      </template>
      <template v-else>
        <div
          v-for="(member, index) in draftAuthorsList"
          :key="`author-${index}`"
          :class="{'pb-1' : index == 0, 'py-1': index != 0}"
        >
          <platform-avatar
            :user="member"
            :size="40"
            link-to-profile
            link-to-profile-class="pl-2"
            class="display-inline-block mr-2"
          />

          <div v-if="isInProgress" class="author-checkbox display-inline-block">
            <!-- v-checkbox depends on v-model binding which doesn't play well with Vuex.
                TODO: create a custom checkbox with the same styles as v-checkbox has -->
            <input
              id="checkbox"
              type="checkbox"
              :disabled="draftAuthorGuard(member)"
              :checked="isDraftAuthor(member)"
              @input="setDraftAuthor($event, member)"
            >
          </div>
        </div>
      </template>
    </d-block-widget>

    <d-block-widget
      v-if="projectTableOfContent.length"
      :title="$t('projectContentDetails.sidebar.contentTable')"
    >
      <ol class="text-body-2">
        <li
          v-for="(item, index) in projectTableOfContent"
          :key="index"
          :class="{'pb-2': index + 1 < projectTableOfContent.length}"
        >
          <div class="font-weight-bold">
            {{ item.type }}
          </div>
          <router-link
            target="_blank"
            class="a text-body-2"
            :to="{
              name: 'project.content.details',
              params: {
                contentId: item._id,
                projectId: project._id,
              }
            }"
          >
            {{ item.title }}
          </router-link>
        </li>
      </ol>

      <div v-if="isPublished" class="pt-3 text-body-2">
        <router-link
          class="a font-weight-regular display-flex"
          :to="{
            name: 'ProjectContentReferences',
            params: {
              projectId: project._id,
              contentId: content._id
            }}"
        >
          <v-icon small class="mr-1">
            device_hub
          </v-icon>
          {{ $t('projectContentDetails.sidebar.references') }}
        </router-link>
      </div>
    </d-block-widget>

    <!-- <d-block-widget v-if="isPublished">
      <v-btn
        block
        small
        text
        color="primary"
        :to="{
          name: 'ProjectContentMetadata',
          params: {
            projectId: encodeURIComponent(project._id),
            contentId: encodeURIComponent(content._id)
          }
        }"
      >
        {{ $t('projectContentDetails.sidebar.bchMetadata') }}
      </v-btn>
    </d-block-widget> -->
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { proposalTypesLabels, PROPOSAL_TYPES, projectContentTypes, PROJECT_CONTENT_STATUS } from '@/variables';
  import { ProjectContentService } from '@deip/project-content-service';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import EciStats from '@/components/EciMetrics/EciStats/EciStats';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import ReviewRequest from '@/features/Reviews/components/Request/ReviewRequest';

  const projectContentService = ProjectContentService.getInstance();

  export default {
    name: 'ProjectContentDetailsSidebar',

    components: {
      ReviewRequest,
      DBlockWidget,
      EciStats,
    },

    data() {
      return {
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        content: 'rcd/content',
        expertsList: 'rcd/expertsList',
        project: 'rcd/project',
        group: 'rcd/group',
        membersList: 'rcd/membersList',
        projectMembersList: 'rcd/projectMembersList',
        domainsList: 'rcd/domainsList',
        contentList: 'rcd/contentList',
        contentReviewsList: 'rcd/contentReviewsList',
        contentProposal: 'rcd/contentProposal',
        contentRef: 'rcd/contentRef',
        isTeamMember: 'rcd/isTeamMember',
        isCreatingReviewAvailable: 'rcd/isCreatingReviewAvailable',
        isInProgress: 'rcd/isInProgress',
        isProposed: 'rcd/isProposed',
        isPublished: 'rcd/isPublished',
        isCentralizedGroup: 'rcd/isCentralizedGroup',
        ProjectExpertise: 'rcd/ProjectExpertise',
        projectContentEciStatsRecords: 'rcd/projectContentEciStatsRecords'
      }),

      isUnlockActionAvailable() {
        return this.isTeamMember && this.hasNoActiveProposal && this.isProposed;
      },

      hasNoActiveProposal() {
        const proposal = this.contentProposal;
        if (proposal) {
          const isExpired = !(proposal.is_completed || (new Date(`${proposal.expiration_time}Z`).getTime() > new Date().getTime()));
          return isExpired;
        }
        return true;
      },

      positiveReviewsCount() {
        return this.contentReviewsList.filter((r) => r.is_positive).length;
      },

      negativeReviewsCount() {
        return this.contentReviewsList.filter((r) => !r.is_positive).length;
      },

      contentRewardDistributionState() {
        return this.content ? {
          state: this.content.activity_state,
          start: new Date(`${this.content.activity_window_start}Z`),
          end: new Date(`${this.content.activity_window_end}Z`)
        } : null;
      },

      isContentRewardDistributionActive() {
        return this.contentRewardDistributionState && this.contentRewardDistributionState.state === 'active';
      },

      contentAuthorsList() {
        return this.content ? this.projectMembersList.filter((m) => this.content.authors.some((a) => a === m.account.name)) : [];
      },

      draftAuthorsList() {
        return this.isInProgress ? this.projectMembersList : this.projectMembersList.filter((m) => this.contentRef.authors.some((a) => a === m.account.name));
      },

      projectTableOfContent() {
        return this.contentList.reduce((arr, content) => {
          const typeObj = projectContentTypes.find((c) => c.type === content.contentType);
          return !content.isDraft ? [...arr, {
            type: typeObj ? typeObj.text : 'Milestone',
            title: content.title,
            _id: content._id
          }] : arr;
        }, []);
      },

      // eciList() {
      //   return this.domainsList.map((domain) => {
      //     const eciObj = this.content.eci_per_domain.find((item) => item[0] === domain.id);
      //     return {
      //       domainName: domain.name,
      //       value: eciObj ? eciObj[1] : 0
      //     };
      //   });
      // },

      experts() {
        const blackList = [
          ...this.SYSTEM_USERS, this.user.username,
          ...this.membersList.map((m) => m.account.name)
        ];
        const existingReviewsForContent = this.contentReviewsList.filter((r) => r.projectContentId === this.content.id);
        blackList.push(...existingReviewsForContent.map((r) => r.author.account.name));
        return this.expertsList.filter((e) => !blackList.includes(e.account.name));
      },

      isRequestingReviewDisabled() {
        return !this.requestExpertReviewDialog.selectedExpert;
      }
    },

    methods: {

      selectExpertForReview(expert) {
        this.requestExpertReviewDialog.selectedExpert = expert;
      },

      userHasExpertiseInDomain(domain) {
        return this.userExperise.some((exp) => exp.domainId === domain.id && exp.amount > 0);
      },

      unlockDraft() {
        projectContentService.unlockDraft({ ...this.contentRef, status: PROJECT_CONTENT_STATUS.IN_PROGRESS })
          .then(() => {
            location.reload();
          }, (err) => {
            console.error(err);
          });
      },

      isDraftAuthor(member) {
        return this.contentRef.authors.some((a) => a === member.account.name);
      },

      draftAuthorGuard(member) {
        return this.contentRef.authors.length == 1 && this.isDraftAuthor(member);
      },

      setDraftAuthor(event, member) {
        event.preventDefault();
        event.stopPropagation();
        const { checked } = event.target;
        const authors = checked
          ? [...this.contentRef.authors, member.account.name]
          : this.contentRef.authors.filter((a) => a !== member.account.name);
        this.$emit('setDraftAuthors', this.projectMembersList.filter((m) => authors.some((a) => a === m.account.name)));
      },

      goAddReview() {
        this.$router.push({
          name: 'ReviewCreate',
          params: this.$route.params
        });
      },

      getProjectContentEciPercentile() {
        return 10;
      }

    }
  };
</script>

<style lang="less" scoped>
  .eci-item {
    border: 1px solid #e4e4e4;
    border-radius: 3px;
  }

  .eci-label {
    color: #818181;
  }

  .selected-author-item {
    background-color: #e0e0e0;
    width: 100%;
    height: 100%;
  }

  .add-review-label {
    text-transform: none;
  }

  .author-checkbox {
    max-height: 30px !important;
  }

  .expertise {
    background: #EBF5FE;
    border: 1px solid #8FC3F7;
    box-sizing: border-box;
    border-radius: 2px;
    font-family: Muli;

    &__disc-name {
      font-weight: 600;
    }

    &__divider {
      border-color: #8FC3F7;
    }
  }
</style>
