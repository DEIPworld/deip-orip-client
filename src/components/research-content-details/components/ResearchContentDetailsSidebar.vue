<template>
  <div>
    <d-block-widget v-if="!isPublished && isResearchGroupMember && (isProposed || isUnlockActionAvailable)">
      <div v-if="isProposed" class="text-body-1">
        Draft is
        <router-link
          class="link orange--text"
          :to="{
            name: 'ResearchGroupDetails',
            params: {
              research_group_permlink: encodeURIComponent(research.research_group.permlink)
            },
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
    </d-block-widget>

    <d-block-widget
      v-if="$route.params.content_permlink !== '!draft'"
      title="Expertise Contribution Index"
    >
      <eci-stats
        :content-id="content.external_id"
        :disciplines="disciplinesList"
      />
    </d-block-widget>

    <d-block-widget title="Authors">
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

    <d-block-widget v-if="researchTableOfContent.length" title="Project table of content">
      <ol class="text-body-2">
        <li
          v-for="(item, index) in researchTableOfContent"
          :key="index"
          :class="{'pb-2': index + 1 < researchTableOfContent.length}"
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
                contentExternalId: item.externalId,
                researchExternalId: research.external_id,
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
    </d-block-widget>

    <d-block-widget v-if="isPublished">
      <v-btn
        block
        small
        text
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
    </d-block-widget>
  </div>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';
  import { proposalTypesLabels, PROPOSAL_TYPES, researchContentTypes } from '@/variables';
  import { ResearchContentService } from '@deip/research-content-service';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import EciStats from '@/components/EciMetrics/EciStats/EciStats';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import ReviewRequest from '@/features/Reviews/components/Request/ReviewRequest';

  const researchContentService = ResearchContentService.getInstance();
  const researchContentReviewsService = ResearchContentReviewsService.getInstance();

  export default {
    name: 'ResearchContentDetailsSidebar',

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
        userHasResearchExpertise: 'rcd/userHasResearchExpertise',
        researchContentEciStatsRecords: 'rcd/researchContentEciStatsRecords'
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
        return this.contentList.reduce((arr, content) => {
          const typeObj = researchContentTypes.find((c) => c.type === content.content_type);
          return !content.isDraft ? [...arr, {
            type: typeObj ? typeObj.text : 'Milestone',
            title: content.title,
            permlink: content.permlink,
            externalId: content.external_id
          }] : arr;
        }, []);
      },

      // eciList() {
      //   return this.disciplinesList.map((discipline) => {
      //     const eciObj = this.content.eci_per_discipline.find((item) => item[0] === discipline.id);
      //     return {
      //       discipline_name: discipline.name,
      //       value: eciObj ? eciObj[1] : 0
      //     };
      //   });
      // },

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
        return this.userExperise.some((exp) => exp.discipline_id === discipline.id && exp.amount > 0);
      },

      unlockDraft() {
        researchContentService.unlockContentDraft(this.contentRef._id)
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
        this.$emit('setDraftAuthors', this.researchMembersList.filter((m) => authors.some((a) => a === m.account.name)));
      },

      goAddReview() {
        this.$router.push({
          name: 'ReviewCreate',
          params: this.$route.params
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
