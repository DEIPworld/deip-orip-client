<template>
  <v-layout>
    <v-flex>
      <v-layout column class="mt-4 pa-4">
        <div class="rd-sidebar-block-title">
          <router-link
            class="research-group-link"
            :to="{ name: 'ResearchGroupDetails', params: {  research_group_permlink: encodeURIComponent(groupLink) } }"
          >{{group.name}}
          </router-link>
        </div>
        <v-layout
          v-for="(member, i) in researchMembersList"
          :key="member.account.id"
          class="mt-3"
          justify-space-between
          align-center
        >
          <div>
            <platform-avatar
              :size="40"
              :key="'member-' + i"
              :user="member"
              link-to-profile
              link-to-profile-class="pl-3"
            ></platform-avatar>
          </div>
          <!-- <div class="grey--text">{{convertToPercent(member.rgt.amount)}}%</div> -->
        </v-layout>
        <div v-if="isJoinRequestSectionAvailable">
          <v-btn
            v-if="canJoinResearchGroup"
            outline
            round
            color="primary"
            class="px-3 ma-0 mt-3"
            @click="onJoinResearchGroupClick()"
          >
            <v-icon small>add</v-icon>
            <span class="pl-2 medium text-none">Join Research group</span>
          </v-btn>
          <v-dialog
            v-if="research"
            v-model="isJoinGroupDialogOpen"
            persistent
            transition="scale-transition"
            max-width="600px"
          >
            <v-card class="pa-4">
              <v-card-title>
                <v-layout row align-center align-baseline>
                  <v-flex grow class="headline">Provide a cover letter to your Join Request</v-flex>
                  <v-flex shrink align-self-center right-top-angle>
                    <v-btn @click="isJoinGroupDialogOpen = false" icon class="pa-0 ma-0">
                      <v-icon color="black">close</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-title>

              <v-card-text>
                <v-textarea
                  v-model="coverLetter"
                  :rows="2"
                  auto-grow
                  name="Cover letter"
                  label="Cover letter"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-layout row wrap>
                  <v-flex xs12 py-2>
                    <v-btn
                      color="primary"
                      :disabled="!coverLetter || isSendingJoinGroupRequest"
                      :loading="isSendingJoinGroupRequest"
                      @click="sendJoinGroupRequest()"
                      block
                    >Send
                    </v-btn>
                  </v-flex>
                  <v-flex xs12 py-2>
                    <v-btn
                      @click="isJoinGroupDialogOpen = false"
                      :disabled="isSendingJoinGroupRequest"
                      color="primary"
                      flat
                      block
                    >Cancel
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <div
            v-if="isActiveJoinRequest"
            class="mt-3"
          >You have sent a join request on {{new Date(currentJoinRequest.created).toDateString()}}, please wait for
            approval
          </div>
          <div v-if="isActiveInvite" class="mt-3">
            Please accept invite on
            <router-link
              :to="{ name: 'UserDetails', params: { account_name: user.username}}"
              style="text-decoration: none"
            >your profile page
            </router-link>
            to join the research group
          </div>
        </div>
      </v-layout>

      <!-- <v-layout column px-4>
        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
        <div class="py-4">
          <div class="rd-sidebar-block-title pb-2">Expertise Contribution Index</div>
          <v-layout
            v-for="eci of eciList"
            column
            tag="div"
            :key="eci.disciplineName"
            justify-space-between
            class="expertise px-1 my-1"
          >
            <v-layout justify-space-between>
              <div class="blue--text text--accent-4 bold">
                TOP
                <span class="font-weight-bold">{{getResearchEciPercentile(eci)}}</span>%
              </div>
              <div class="grey--text">ECI {{ eci.value }}</div>
            </v-layout>
            <v-divider class="expertise__divider" />
            <div class="expertise__disc-name pt-1">{{ eci.disciplineName }}</div>
          </v-layout>
        </div>
      </v-layout> -->

      <!-- <v-layout column class="my-4 mx-4">
            <div class="rd-sidebar-block-title pb-2">Score</div>
            <v-tooltip top>
              <div class="mt-2" slot="activator">{{researchScorePercent}}%</div>
              <span class="bold">
                This score is calculated of Expertise<br/>
                contribution index and development stage<br/>
                of the project
              </span>
            </v-tooltip>
            <top-research-label
              v-if="research.isTop"
              :number="100"
              color-class="green--text"
              class="mt-3"
            />
      </v-layout>-->

      <v-layout column px-4>
        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
        <div class="py-4">
          <technology-readiness-level isReadOnly :currentTrlStep="researchRef.trl"></technology-readiness-level>
        </div>
      </v-layout>

      <v-layout v-if="isResearchGroupMember" column px-4>
        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
        <div class="py-4">
          <div class="subheading" v-if="research.is_private">
            <v-icon class="mr-2" small color="black">lock</v-icon>Private project
          </div>
          <div class="subheading" v-else>
            <v-icon class="mr-2" small color="black">mdi-earth</v-icon>Public project
          </div>
        </div>
      </v-layout>

      <v-layout column px-4 v-if="researchRef.partners.length">
        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
        <div class="py-4">
          <research-partners isReadOnly :partners="researchRef.partners"></research-partners>
        </div>
      </v-layout>

      <!-- <v-dialog
        v-if="contentList.length"
        v-model="requestExpertReviewDialog.isShown"
        persistent
        max-width="600px"
      >
        <template v-slot:activator="{ on }">
          <div class="sidebar-fullwidth px-4">
            <v-divider></v-divider>
          </div>
          <div class="pa-4">
            <div class="rd-sidebar-block-title">Expert Review</div>
            <v-btn large block color="primary" dark v-on="on" class="mt-3">Request Review</v-btn>
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
              <v-select
                class="mt-3"
                label="Select a content to request review"
                item-text="title"
                item-value="id"
                :disabled="isRequestingReview"
                :items="contentListToReview"
                v-model="selectedContentId"
              />
              <user-autocomplete-picker
                label="Find an expert to request a review"
                :users="experts"
                :isDisabled="!isSelectedContentId"
                :displayLimit="6"
                @onSelectUser="selectExpert"
              />
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex xs12 py-2>
                <v-btn
                  @click="requestReview()"
                  :loading="isRequestingReview"
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
                  block
                >Cancel
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-dialog> -->

    </v-flex>
  </v-layout>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { ReviewService } from '@deip/review-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();


  export default {
    name: 'ResearchDetailsSidebar',

    data() {
      return {
        tokenizationConfirmDialog: {
          isShown: false,
          isConfirming: false
        },
        requestExpertReviewDialog: { isShown: false },
        groupLink: this.$route.params.research_group_permlink,
        isJoinGroupDialogOpen: false,
        coverLetter: '',
        isSendingJoinGroupRequest: false,
        isResearchTokenization: false,
        selectedExpert: null,
        selectedContentId: null,
        isRequestingReview: false
      };
    },
    computed: {
      ...mapGetters({
        contentList: 'rd/contentList',
        group: 'rd/group',
        disciplinesList: 'rd/disciplinesList',
        expertsList: 'rd/expertsList',
        groupInvitesList: 'rd/groupInvitesList',
        researchReferencesList: 'rd/researchReferencesList',
        researchMembersList: 'rd/researchMembersList',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        research: 'rd/research',
        researchRef: 'rd/researchRef',
        reviewsList: 'rd/reviewsList',
        user: 'auth/user',
        userJoinRequests: 'auth/userJoinRequests'
      }),
      isSelectedContentId() {
        return this.selectedContentId !== null;
      },
      contentListToReview() {
        let expert = this.selectedExpert;
        if (!expert) return this.contentList;
        let expertReviews = this.reviewsList.filter(
          r => r.author.account.name == expert.account.name
        );
        return this.contentList.filter(
          content => !expertReviews.some(r => r.research_content_id == content.id)
        );
      },
      isRequestingReviewDisabled() {
        return !this.selectedExpert || this.selectedContentId == null;
      },
      canJoinResearchGroup() {
        if (this.research) {
          if (
            this.researchGroupMembersList.some(
              m => m.account.name === this.user.username
            )
          ) {
            return false;
          }
          if (
            this.userJoinRequests.some(
              r => r.groupId === this.research.research_group_id
            )
          ) {
            return false;
          }

          return !this.isActiveInvite;
        }
        return false;
      },
      currentJoinRequest() {
        return this.research
          ? this.userJoinRequests.find(
            r => r.groupId == this.research.research_group_id
          )
          : undefined;
      },
      eciList() {
        return this.disciplinesList.map(discipline => {
          const eciObj = this.research.eci_per_discipline.find(
            item => item[0] === discipline.id
          );

          return {
            disciplineName: discipline.name,
            value: eciObj ? eciObj[1] : 0
          };
        });
      },
      experts() {
        const blackList = [
          'regacc',
          'hermes',
          'initdelegate',
          this.user.username,
          ...this.researchGroupMembersList.map(m => m.account.name)
        ];
        const existingReviewsForContent = this.reviewsList.filter(
          r => r.research_content_id === this.selectedContentId
        );
        blackList.push(
          ...existingReviewsForContent.map(r => r.author.account.name)
        );
        return this.expertsList.filter(e => !blackList.includes(e.account.name));
      },
      isActiveInvite() {
        return this.groupInvitesList.some(
          invite => invite.account_name == this.user.username
        );
      },
      isActiveJoinRequest() {
        return (
          this.currentJoinRequest && this.currentJoinRequest.status === 'pending'
        );
      },
      isJoinRequestSectionAvailable() {
        return (
          this.isProfileAvailable &&
          (this.canJoinResearchGroup ||
            this.isActiveJoinRequest ||
            this.isActiveInvite) &&
          !this.group.is_personal
        );
      },
      isProfileAvailable() {
        return !!this.user.profile;
      },
      isResearchGroupMember() {
        return this.research
          ? this.$store.getters['auth/userIsResearchGroupMember'](
            this.research.research_group_id
          )
          : false;
      },
      researchScorePercent() {
        let eciSum = this.eciList.reduce((acc, curr) => acc + curr.value, 0);
        const eciSign = eciSum >= 0 ? 1 : -1;
        const eciRatio =
          eciSign * Math.min(+`${eciSum * eciSign}`.substring(0, 2), 50);
        const contentRatio = Math.min(this.contentList.length + 1, 50);
        return Math.max(eciRatio + contentRatio, 0);
      }
    },
    methods: {
      selectExpert(expert) {
        this.selectedExpert = expert;
      },
      getResearchEciPercentile(eci) {
        return 10;
      },
      onJoinResearchGroupClick() {
        this.isJoinGroupDialogOpen = true;
        this.coverLetter = '';
      },
      onTokenizeResearchClick() {
        this.tokenizationConfirmDialog.isShown = true;
        this.tokenizationConfirmDialog.isConfirming = false;
      },
      requestReview() {
        this.isRequestingReview = true;
        return researchContentReviewsService.createReviewRequest({
            contentId: this.selectedContentId,
            expert: this.selectedExpert.account.name
          })
          .then(() => {
            this.$store.dispatch('layout/setSuccess', {
              message: 'Request for the review has been sent successfully'
            });
            this.selectedExpert = null;
            this.selectedContentId = null;
          })
          .catch(err => {
            let errMsg =
              'An error occurred while requesting the review. Please try again later';
            if (err.response && err.response.data) {
              errMsg = err.response.data;
            }
            this.$store.dispatch('layout/setError', {
              message: errMsg
            });
          })
          .finally(() => {
            this.isRequestingReview = false;
            this.requestExpertReviewDialog.isShown = false;
          });
      },
      sendJoinGroupRequest() {
        this.isSendingJoinGroupRequest = true;

        researchGroupService
          .createJoinRequest({
            username: this.user.username,
            groupId: this.research.research_group_id,
            coverLetter: this.coverLetter
          })
          .then(() => {
            this.$store.dispatch('auth/loadJoinRequests');
            this.$store.dispatch('layout/setSuccess', {
              message: 'Join request has been sent successfully!'
            });
          })
          .catch(err => {
            this.$store.dispatch('layout/setError', {
              message:
                'An error occurred while sending join request, please try again later!'
            });
            console.log(err);
          })
          .finally(() => {
            this.isSendingJoinGroupRequest = false;
            this.isJoinGroupDialogOpen = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  .expertise {
    background: #ebf5fe;
    border: 1px solid #8fc3f7;
    box-sizing: border-box;
    border-radius: 2px;
    font-family: Muli;

    &__disc-name {
      font-weight: 600;
    }

    &__divider {
      border-color: #8fc3f7;
    }
  }

  .research-group-link {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .rd-sidebar-block-title {
    font-family: Roboto;
    font-weight: bold;
    font-size: 18px;
    line-height: 21px;
    color: #000000;
  }
</style>
