<template>
  <div>
    <router-link
      class="a title"
      :to="{ name: 'ResearchDetails', params: {
        research_group_permlink: encodeURIComponent(research.research_group.permlink),
        research_permlink: encodeURIComponent(research.permlink)
      }}"
    >
      {{ research.title }}
    </router-link>

    <!-- ### START Draft Actions Section ### -->
    <v-sheet v-if="!isPublished && isResearchGroupMember">
      <div v-if="isProposed || isUnlockActionAvailable" class="sidebar-fullwidth">
        <v-divider class="my-6" />
      </div>
      <div v-if="isProposed" class="text-body-1">
        Draft is
        <router-link
          class="a orange--text"
          :to="{
            name: 'ResearchGroupDetails',
            params: { research_group_permlink: encodeURIComponent(research.research_group.permlink) },
            hash: '#proposals'
          }"
        >
          proposed
        </router-link>
        as research content and locked for editing
      </div>
      <div v-if="isUnlockActionAvailable" class="mt-6">
        <div class="text-body-1 pb-4">
          The proposal is expired. Unlock the material for a new proposal or removal
        </div>
        <v-btn color="orange" block @click="unlockDraft()">
          Unlock Draft
        </v-btn>
      </div>
    </v-sheet>
    <!-- ### END Draft Actions Section ### -->

    <!-- ### START Research Content ECI Section ### -->
    <v-sheet v-if="isPublished">
      <v-divider class="my-6" />
      <div class="text-h6">
        Expertise Contribution Index
      </div>
      <div
        v-for="eci of eciList"
        :key="eci.disciplineName"
        class="expertise px-1 my-1"
      >
        <v-row no-gutters justify="space-between">
          <v-col cols="auto" class="pa-2 blue--text text--accent-4">
            TOP
            <span>{{ getResearchContentEciPercentile(eci) }}</span>%
          </v-col>
          <v-col cols="auto" class="pa-2 grey--text">
            ECI {{ eci.value }}
          </v-col>
        </v-row>
        <v-divider class="expertise__divider" />
        <div class="pa-2">
          {{ eci.disciplineName }}
        </div>
      </div>
    </v-sheet>
    <!-- ### END Research Content ECI Section ### -->


    <!-- <v-divider class="my-6" />
    <div class="text-h6 display-inline-block">
      Expert Review:
    </div>
    <div class="text-subtitle-1 bold mb-6 display-inline-block ml-2">
      <span class="green--text text--darken-2">{{ positiveReviewsCount }}</span>
      <span> / </span>
      <span class="red--text text--darken-2">{{ negativeReviewsCount }}</span>
    </div> -->

    <v-dialog
      v-if="isPublished"
      v-model="requestExpertReviewDialog.isShown"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          block
          color="primary"
          dark
          v-on="on"
        >
          Request Review
        </v-btn>
      </template>
      <v-card class="pa-6">
        <v-card-title>
          <div class="text-h5">
            Request review from an Expert
          </div>
          <div class="right-top-angle">
            <v-btn icon class="pa-0 ma-0" @click="requestExpertReviewDialog.isShown = false">
              <v-icon color="black">
                close
              </v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <user-autocomplete-picker
            label="Find an expert to request a review"
            :users="experts"
            :is-disabled="requestExpertReviewDialog.isRequestingReview"
            :display-limit="8"
            @onSelectUser="selectExpertForReview"
          />
        </v-card-text>
        <v-card-actions class="px-6">
          <v-row>
            <v-col cols="12" class="py-2">
              <v-btn
                :loading="requestExpertReviewDialog.isRequestingReview"
                :disabled="isRequestingReviewDisabled"
                block
                color="primary"
                @click="requestReview()"
              >
                Request
              </v-btn>
            </v-col>
            <v-col cols="12" class="py-2">
              <v-btn
                color="primary"
                text
                block
                @click="requestExpertReviewDialog.isShown = false"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ### START Research Content Authors Section ### -->
    <v-divider class="my-6" />

    <div class="text-h6 mb-6">
      Authors
    </div>

    <div v-if="isPublished">
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
    </div>

    <div v-else>
      <div
        v-for="(member, index) in draftAuthorsList"
        :key="`author-${index}`"
        align-baseline
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
    </div>
    <!-- ### END Research Content Authors Section ### -->

    <!-- ### START Research TOC Section ### -->
    <div v-if="researchTableOfContent.length">
      <v-divider class="my-6" />

      <div class="text-h6 mb-6">
        Research table of content
      </div>

      <div v-for="(item, index) in researchTableOfContent" :key="index" :class="index === 0 ? '' : 'c-mt-1'">
        <div class="text-body-2 font-weight-bold">
          {{ index + 1 }}. {{ item.type }}
        </div>
        <div class="pl-2">
          <router-link
            target="_blank"
            class="a text-body-1"
            :to="{
              name: 'ResearchContentDetails',
              params: {
                research_group_permlink: encodeURIComponent(research.research_group.permlink),
                research_permlink: encodeURIComponent(research.permlink),
                content_permlink: encodeURIComponent(item.permlink)
              }
            }"
          >
            {{ item.title }}
          </router-link>
        </div>
      </div>

      <div v-if="isPublished" class="pt-2">
        <router-link
          class="a font-weight-regular display-flex"
          :to="{
            name: 'ResearchContentReferences',
            params: {
              research_group_permlink: encodeURIComponent(research.research_group.permlink),
              research_permlink: encodeURIComponent(research.permlink),
              content_permlink: encodeURIComponent(content.permlink)
            }}"
        >
          <v-icon small class="mr-1">
            device_hub
          </v-icon>
          References
        </router-link>
      </div>
    </div>
    <!-- ### END Research TOC Section ### -->

    <!-- ### START Research Content Blockchain Data Section ### -->
    <div v-if="isPublished" class="py-2">
      <v-divider class="my-6" />
      <v-btn
        block
        color="primary"
        :to="{
          name: 'ResearchContentMetadata',
          params: {
            research_group_permlink: encodeURIComponent(research.research_group.permlink),
            research_permlink: encodeURIComponent(research.permlink),
            content_permlink: encodeURIComponent(content.permlink)
          }
        }"
      >
        Blockchain Metadata
      </v-btn>
    </div>
    <!-- ### END Research Content Blockchain Data Section ### -->


    <!-- ### START Reward Info Section ### -->
    <div v-if="!isPublished" class="py-2">
      <div class="text-subtitle-1 font-weight-bold">
        Reviews
      </div>
      <div class="text-body-2 c-mt-2">
        <v-row no-gutters justify="space-between" class="text-body-2 py-1">
          <div>
            <v-icon small class="c-pr-2">
              rate_review
            </v-icon>
            Reward for review:
          </div>
          <div>{{ research.review_share }}</div>
        </v-row>
      </div>
    </div>
    <!-- ### END Reward Info Section ### -->
  </div>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { proposalTypesLabels, PROPOSAL_TYPES, researchContentTypes } from '@/variables';
  import { ResearchContentService } from '@deip/research-content-service';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

  const researchContentService = ResearchContentService.getInstance();
  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

  export default {
    name: 'ResearchContentDetailsSidebar',

    data() {
      return {
        requestExpertReviewDialog: {
          isShown: false,
          selectedExpert: null,
          isRequestingReview: false
        }
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userExperise: 'auth/userExperise',
        content: 'rcd/content',
        expertsList: 'rcd/expertsList',
        research: 'rcd/research',
        group: 'rcd/group',
        membersList: 'rcd/membersList',
        researchMembersList: 'rcd/researchMembersList',
        disciplinesList: 'rcd/disciplinesList',
        contentList: 'rcd/contentList',
        contentReviewsList: 'rcd/contentReviewsList',
        contentProposal: 'rcd/contentProposal',
        contentRef: 'rcd/contentRef',
        isResearchGroupMember: 'rcd/isResearchGroupMember',
        isCreatingReviewAvailable: 'rcd/isCreatingReviewAvailable',
        isInProgress: 'rcd/isInProgress',
        isProposed: 'rcd/isProposed',
        isPublished: 'rcd/isPublished',
        isCentralizedGroup: 'rcd/isCentralizedGroup',
        userHasResearchExpertise: 'rcd/userHasResearchExpertise'
      }),

      isUnlockActionAvailable() {
        return this.isResearchGroupMember && this.hasNoActiveProposal && this.isProposed;
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
        return this.content ? this.researchMembersList.filter((m) => this.content.authors.some((a) => a === m.account.name)) : [];
      },

      draftAuthorsList() {
        return this.isInProgress ? this.researchMembersList : this.researchMembersList.filter((m) => this.contentRef.authors.some((a) => a === m.account.name));
      },

      researchTableOfContent() {
        return this.contentList.map((content) => {
          const typeObj = researchContentTypes.find((c) => c.type === content.content_type);
          return {
            type: typeObj ? typeObj.text : 'Milestone',
            title: content.title,
            permlink: content.permlink
          };
        });
      },

      eciList() {
        return this.disciplinesList.map((discipline) => {
          const eciObj = this.content.eci_per_discipline.find((item) => item[0] === discipline.id);
          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0
          };
        });
      },

      experts() {
        const blackList = [
          'regacc', 'hermes', 'initdelegate', this.user.username,
          ...this.membersList.map((m) => m.account.name)
        ];
        const existingReviewsForContent = this.contentReviewsList.filter((r) => r.research_content_id === this.content.id);
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

      userHasExpertiseInDiscipline(discipline) {
        return this.userHasResearchExpertise.some((exp) => exp.discipline_id === discipline.id);
      },

      unlockDraft() {
        researchContentService.unlockContentDraft(this.contentRef._id)
          .then(() => {
            location.reload();
          }, (err) => {
            console.log(err);
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
        this.$emit('setDraftAuthors', this.researchMembersList.filter((m) => authors.some((a) => a === m.account.name)));
      },

      goAddReview() {
        this.$router.push({
          name: 'ResearchContentAddReview',
          params: this.$route.params
        });
      },

      requestReview() {
        this.requestExpertReviewDialog.isRequestingReview = true;
        return researchContentReviewsService.createReviewRequest({
          contentId: this.content.id,
          expert: this.requestExpertReviewDialog.selectedExpert.account.name
        })
          .then(() => {
            this.$notifier.showError('Request for the review has been sent successfully')
          })
          .catch((err) => {
            let errMsg = 'An error occurred while requesting the review. Please try again later';
            if (err.response && err.response.data) {
              errMsg = err.response.data;
            }
            this.$notifier.showError(errMsg)
          })
          .finally(() => {
            this.requestExpertReviewDialog.isRequestingReview = false;
            this.requestExpertReviewDialog.isShown = false;
          });
      },

      getResearchContentEciPercentile() {
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
