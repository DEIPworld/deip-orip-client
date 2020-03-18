<template>
  <v-card class="pa-4 full-height">
    <div>
      <router-link class="a title"
                   :to="{ name: 'ResearchDetails', params: {
          research_group_permlink: encodeURIComponent(research.group_permlink),
          research_permlink: encodeURIComponent(research.permlink)
        }}"
      >{{ research.title }}
      </router-link>
    </div>

    <!-- ### START Draft Actions Section ### -->
    <div class="pt-4" v-if="!isPublished && isResearchGroupMember">
      <div v-if="isProposed || isUnlockActionAvailable" class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>
      <div v-if="isProposed" class="c-mt-3 c-mb-3">
        <div class="subheading orange--text text-align-center">
          Draft is
          <router-link class="a orange--text"
            :to="{
              name: 'ResearchGroupDetails',
              params: { research_group_permlink: encodeURIComponent(research.group_permlink) },
              hash: '#proposals'
            }"
          >proposed
          </router-link>
          as research content and locked for editing
        </div>
      </div>
      <div v-if="isUnlockActionAvailable" class="c-mt-3 c-mb-3">
        <div class="text-align-center">
          <v-btn color="orange" @click="unlockDraft()">Unlock Draft</v-btn>
        </div>
      </div>
    </div>
    <!-- ### END Draft Actions Section ### -->

    <!-- ### START Research Content ECI Section ### -->
    <div v-if="isPublished" class="py-4">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>
      <div class="subheading bold py-2">Expertise Contribution Index</div>

      <v-layout
        v-for="eci of eciList"
        column
        tag="div"
        :key="eci.disciplineName"
        justify-space-between
        class="expertise px-1 my-2"
      >
        <v-layout justify-space-between class="">
          <div class="blue--text text--accent-4 bold">TOP <span class="font-weight-bold">{{getResearchContentEciPercentile(eci)}}</span>%
          </div>
          <div class="grey--text">ECI {{ eci.value }}</div>
        </v-layout>
        <v-divider class="expertise__divider"/>
        <div class="expertise__disc-name pt-1">{{ eci.disciplineName }}</div>
      </v-layout>
    </div>
    <!-- ### END Research Content ECI Section ### -->
    <div class="sidebar-fullwidth">
      <v-divider></v-divider>
    </div>

    <v-dialog v-model="requestExpertReviewDialog.isShown" persistent max-width="600px">
      <template v-slot:activator="{ on }">
        <div class="mx-0">
          <div class="subheading bold py-3">Expert Review</div>
          <v-btn large block color="primary" dark v-on="on">Request Review</v-btn>
        </div>
      </template>
      <v-card class="pa-4">
        <v-card-title>
          <v-layout align-center>
            <v-flex grow class="headline">Request review from an Expert</v-flex>
            <v-flex shrink right-top-angle>
              <v-btn @click="requestExpertReviewDialog.isShown = false" icon class="pa-0 ma-0">
                <v-icon color="black">close</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-title>
        <v-card-text>
          <v-layout column>
            <user-autocomplete-picker
              label="Find an expert to request a review"
              :users="experts"
              :isDisabled="requestExpertReviewDialog.isRequestingReview"
              :displayLimit="8"
              @onSelectUser="selectExpertForReview"
            />
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-layout row wrap>
            <v-flex xs12 py-2>
              <v-btn
                @click="requestReview()"
                :loading="requestExpertReviewDialog.isRequestingReview"
                :disabled="isRequestingReviewDisabled"
                block
                color="primary"
              >Request
              </v-btn>
            </v-flex>
            <v-flex xs12 py-2>
              <v-btn
                @click="requestExpertReviewDialog.isShown = false"
                color="primary"
                flat
                block>Cancel
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ### START Research TOC Section ### -->
    <div class="py-4" v-if="researchTableOfContent.length">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>
      <div class="subheading bold pt-2">Research table of content</div>
      <div class="pt-1">
        <div v-for="(item, index) in researchTableOfContent" :key="index" :class="index === 0 ? '' : 'c-mt-1'">
          <div class="body-2">{{index + 1 }}. {{item.type}}</div>
          <div class="pl-2">
            <router-link target="_blank" class="a body-1"
              :to="{
                name: 'ResearchContentDetails',
                params: {
                  research_group_permlink: encodeURIComponent(research.group_permlink),
                  research_permlink: encodeURIComponent(research.permlink),
                  content_permlink: encodeURIComponent(item.permlink)
                }
              }"
            >{{ item.title }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="pt-4" v-if="isPublished">
        <router-link class="a"
          :to="{
            name: 'ResearchContentReferences',
            params: {
              research_group_permlink: encodeURIComponent(research.group_permlink),
              research_permlink: encodeURIComponent(research.permlink),
              content_permlink: encodeURIComponent(content.permlink)
            }}">
          <v-icon small>device_hub</v-icon>
          References
        </router-link>
      </div>
    </div>
    <!-- ### END Research TOC Section ### -->

    <!-- ### START Research Content Authors Section ### -->
    <div class="py-4">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>
      <div class="subheading bold py-3">Authors</div>

      <div v-if="isPublished">
        <v-layout row v-for="(author, index) in contentAuthorsList" :key="`author-${index}`"
                  :class="{'pb-1' : index == 0, 'py-1': index != 0}">
          <platform-avatar
            :user="author"
            :size="40"
            link-to-profile
            link-to-profile-class="pl-2"
          ></platform-avatar>
        </v-layout>
      </div>

      <div v-else>
        <v-layout row justify-space-between align-baseline v-for="(member, index) in draftAuthorsList"
                  :key="`author-${index}`" :class="{'pb-1' : index == 0, 'py-1': index != 0}">
          <div>
            <platform-avatar
              :user="member"
              :size="40"
              link-to-profile
              link-to-profile-class="pl-2"
            ></platform-avatar>
          </div>

          <div v-if="isInProgress" class="author-checkbox">
            <!-- v-checkbox depends on v-model binding which doesn't play well with Vuex.
                TODO: create a custom checkbox with the same styles as v-checkbox has -->
            <input id="checkbox"
                   type="checkbox"
                   :disabled="draftAuthorGuard(member)"
                   :checked="isDraftAuthor(member)"
                   v-on:input="setDraftAuthor($event, member)"/>
          </div>
        </v-layout>
      </div>
    </div>
    <!-- ### END Research Content Authors Section ### -->

    <!-- ### START Research Content Review Section ### -->
    <div v-if="isPublished" class="py-4">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>

      <div class="subheading bold c-mt-4">
        Reviews: <span class="green--text text--darken-2">{{positiveReviewsCount}}</span> / <span
        class="red--text text--darken-2">{{negativeReviewsCount}}</span>
      </div>

      <div class="c-pt-3">
        <div class="caption">
          <v-icon small class="c-pr-2">rate_review</v-icon>
          Reward for review: <span class="bold">{{convertToPercent(research.review_share_in_percent)}}%</span></div>
        <div class="caption" v-if="isContentRewardDistributionActive">
          <div>
            <v-icon small class="c-mr-2">av_timer</v-icon>
            Reward period active till
          </div>
          <div class="bold">
            <v-icon small class="c-mr-2">today</v-icon>
            {{contentRewardDistributionState.end.toDateString()}}
          </div>
        </div>
      </div>

      <div v-if="isCreatingReviewAvailable" class="c-mt-4">
        <v-btn @click="goAddReview()" dark round outline color="primary" class="full-width ma-0">
          <v-icon small>add</v-icon>
          <div class="legacy-col-grow add-review-label">
            Add a review
            <span class="caption grey--text">
                reward {{convertToPercent(research.review_share_in_percent)}}%
            </span>
          </div>
        </v-btn>
      </div>
    </div>
    <!-- ### END Research Content Review Section ### -->

    <!-- ### START Research Content Blockchain Data Section ### -->
    <div v-if="isPublished" class="py-4">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>

      <div class="pt-3">
        <router-link class="a title"
          :to="{
            name: 'ResearchContentMetadata',
            params: {
              research_group_permlink: encodeURIComponent(research.group_permlink),
              research_permlink: encodeURIComponent(research.permlink),
              content_permlink: encodeURIComponent(content.permlink)
            }
          }"
        >Blockchain Metadata
        </router-link>
      </div>
    </div>
    <!-- ### END Research Content Blockchain Data Section ### -->

    <!-- ### START Quorum Info Section ### -->
    <div v-if="!isPublished && !isCentralizedGroup" class="py-4">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>
      <div class="subheading bold pt-2">Quorum</div>

      <div class="body-2 pt-1">
        <div class="legacy-row-nowrap align-center body-2 c-pt-1 c-pb-1">
          <div class="legacy-col-10">{{createContentGroupQuorumValue.text}}:</div>
          <div class="legacy-col-2">{{convertToPercent(createContentGroupQuorumValue.value)}}%</div>
        </div>
      </div>
    </div>
    <!-- ### END Quorum Info Section ### -->

    <!-- ### START Reward Info Section ### -->
    <div v-if="!isPublished" class="py-4">
      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>
      <div class="subheading bold c-mt-4">Reviews</div>

      <div class="body-2 c-mt-2">
        <div class="legacy-row-nowrap align-center body-2 c-pt-1 c-pb-1">
          <div class="legacy-col-10">
            <v-icon small class="c-pr-2">rate_review</v-icon>
            Reward for review:
          </div>
          <div class="legacy-col-2">{{convertToPercent(research.review_share_in_percent)}}%</div>
        </div>
      </div>
    </div>
    <!-- ### END Reward Info Section ### -->
  </v-card>
</template>

<script>
  import deipRpc from '@deip/deip-oa-rpc-client';
  import { mapGetters } from 'vuex';
  import { proposalTypesLabels, PROPOSAL_TYPES, researchContentTypes } from '@/variables';

  import { ResearchContentService } from '@deip/research-content-service';
  import { ReviewService } from '@deip/review-service';

  const researchContentService = ResearchContentService.getInstance();
  const reviewService = ReviewService.getInstance();

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
        disciplinesList: 'rcd/disciplinesList',
        contentList: 'rcd/contentList',
        contentReviewsList: 'rcd/contentReviewsList',
        contentWeightByDiscipline: 'rcd/contentWeightByDiscipline',
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
        return this.contentReviewsList.filter(r => r.is_positive).length;
      },

      negativeReviewsCount() {
        return this.contentReviewsList.filter(r => !r.is_positive).length;
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
        return this.content ? this.membersList.filter(m => this.content.authors.some(a => a === m.account.name)) : [];
      },

      draftAuthorsList() {
        return this.isInProgress ? this.membersList : this.membersList.filter(m => this.contentRef.authors.some(a => a === m.account.name))
      },

      researchTableOfContent() {
        return this.contentList.map(content => {
          let typeObj = researchContentTypes.find(c => c.type === content.content_type);
          return {
            type: typeObj ? typeObj.text : 'Milestone',
            title: content.title,
            permlink: content.permlink
          }
        })
      },

      createContentGroupQuorumValue() {
        return this.group ? {
          text: proposalTypesLabels[PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL],
          value: this.group.proposal_quorums[PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL - 1][1]
        } : undefined;
      },

      eciList() {
        return this.disciplinesList.map(discipline => {
          const eciObj = this.content.eci_per_discipline.find(item => item[0] === discipline.id);
          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0
          }
        });
      },

      experts() {
        const blackList = [
          'regacc', 'hermes', 'initdelegate', this.user.username,
          ...this.membersList.map(m => m.account.name)
        ];
        const existingReviewsForContent = this.contentReviewsList.filter(r => r.research_content_id === this.content.id);
        blackList.push(...existingReviewsForContent.map(r => r.author.account.name));
        return this.expertsList.filter(e => !blackList.includes(e.account.name));
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
        return this.userHasResearchExpertise.some(exp => exp.discipline_id === discipline.id);
      },

      unlockDraft() {
        researchContentService.unlockContentDraft(this.contentRef._id)
          .then(() => {
            location.reload()
          }, (err) => {
            console.log(err)
          });
      },

      isDraftAuthor(member) {
        return this.contentRef.authors.some(a => a === member.account.name);
      },

      draftAuthorGuard(member) {
        return this.contentRef.authors.length == 1 && this.isDraftAuthor(member)
      },

      setDraftAuthor(event, member) {
        event.preventDefault();
        event.stopPropagation();
        const checked = event.target.checked;
        const authors = checked
          ? [...this.contentRef.authors, member.account.name]
          : this.contentRef.authors.filter(a => a !== member.account.name);
        this.$emit('setDraftAuthors', this.membersList.filter(m => authors.some(a => a === m.account.name)));
      },

      goAddReview() {
        this.$router.push({name: 'ResearchContentAddReview', params: this.$route.params });
      },

      requestReview() {
        this.requestExpertReviewDialog.isRequestingReview = true;
        return reviewService.createReviewRequest({
            contentId: this.content.id,
            expert: this.requestExpertReviewDialog.selectedExpert.account.name
          })
          .then(() => {
            this.$store.dispatch('layout/setSuccess', { message: 'Request for the review has been sent successfully'});
          })
          .catch((err) => {
            let errMsg = 'An error occurred while requesting the review. Please try again later';
            if (err.response && err.response.data) {
              errMsg = err.response.data;
            }
            this.$store.dispatch('layout/setError', {
              message: errMsg
            });
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
