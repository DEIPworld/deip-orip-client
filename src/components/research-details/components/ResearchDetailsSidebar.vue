<template>
  <div>
    <v-sheet class="mb-6">
      <div class="text-h6">
        <router-link
          class="research-group-link"
          :to="{ name: 'ResearchGroupDetails', params: { research_group_permlink: encodeURIComponent(groupLink) } }"
        >
          {{ group.name }}
        </router-link>
      </div>
      <div
        v-for="(member, i) in researchMembersList"
        :key="member.account.id"
        class="mt-4"
      >
        <div>
          <platform-avatar
            :key="'member-' + i"
            :size="40"
            :user="member"
            link-to-profile
            link-to-profile-class="pl-4"
          />
        </div>
      </div>

      <div v-if="isJoinRequestSectionAvailable">
        <v-btn
          v-if="canJoinResearchGroup"
          outlined
          color="primary"
          class="px-4 ma-0 mt-4"
          @click="onJoinResearchGroupClick()"
        >
          <v-icon small>
            add
          </v-icon>
          <span class="pl-2 medium text-none">Join Research group</span>
        </v-btn>

        <v-dialog
          v-if="research"
          v-model="isJoinGroupDialogOpen"
          persistent
          transition="scale-transition"
          max-width="600px"
        >
          <v-card class="pa-6">
            <v-card-title>
              <div class="text-h5">
                Provide a cover letter to your Join Request
              </div>
              <div class="right-top-angle">
                <v-btn icon class="pa-0 ma-0" @click="isJoinGroupDialogOpen = false">
                  <v-icon color="black">
                    close
                  </v-icon>
                </v-btn>
              </div>
            </v-card-title>

            <v-card-text>
              <v-textarea
                v-model="coverLetter"
                :rows="2"
                filled
                auto-grow
                name="Cover letter"
                label="Cover letter"
              />
            </v-card-text>
            <v-card-actions class="px-6">
              <v-row>
                <v-col class="py-2" cols="12">
                  <v-btn
                    color="primary"
                    :disabled="!coverLetter || isSendingJoinGroupRequest"
                    :loading="isSendingJoinGroupRequest"
                    block
                    @click="sendJoinGroupRequest()"
                  >
                    Send
                  </v-btn>
                </v-col>
                <v-col class="py-2" cols="12">
                  <v-btn
                    :disabled="isSendingJoinGroupRequest"
                    color="primary"
                    text
                    block
                    @click="isJoinGroupDialogOpen = false"
                  >
                    Cancel
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <div
          v-if="isActiveJoinRequest"
          class="mt-4"
        >
          You have sent a join request on
          {{ new Date(currentJoinRequest.created).toDateString() }},
          please wait for approval
        </div>
        <div v-if="isActiveInvite" class="mt-4">
          Please accept invite on
          <router-link
            :to="{ name: 'UserDetails', params: { account_name: user.username}}"
            style="text-decoration: none"
          >
            your profile page
          </router-link>
          to join the research group
        </div>
      </div>
    </v-sheet>

    <v-divider class="my-6" />

    <v-sheet>
      <div class="text-h6">
        Expertise Contribution Index
      </div>

      <div
        v-for="eci of eciList"
        :key="eci.disciplineName"
        class="expertise px-1 my-1"
      >
        <v-row no-gutters justify="space-between">
          <v-col cols="auto" class="pa-2 blue--text text--accent-4 bold">
            TOP
            <span class="font-weight-bold">{{ getResearchEciPercentile(eci) }}</span>%
          </v-col>
          <v-col cols="auto" class="pa-2 grey--text">
            ECI {{ eci.value }}
          </v-col>
        </v-row>

        <v-divider />

        <div class="pa-2 ">
          {{ eci.disciplineName }}
        </div>
      </div>
    </v-sheet>

    <!-- <div class="my-6 mx-6">
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
            class="mt-4"
          />
    </div>-->

    <v-divider v-if="researchRef.tenantCategory && researchRef.tenantCategory.text" class="my-6" />

    <v-sheet v-if="researchRef.tenantCategory && researchRef.tenantCategory.text">
      <div class="display-flex">
        <v-avatar size="30" color="#0386b0" class="align-self-start mr-2">
          <span class="white--text font-weight-medium">C</span>
        </v-avatar>
        <div class="align-self-center">
          {{ researchRef.tenantCategory.text }}
        </div>
      </div>
    </v-sheet>

    <v-divider class="my-6" />


    <v-sheet>
      <div v-for="(item, i) in researchRef.tenantCriteriasReadingList" :key="`${i}-tenantCriteria`">
        <div v-if="item.type == 'stepper'" class="mb-2">
          <div class="display-flex">
            <v-avatar size="30" color="#0386b0" class="align-self-start mr-2">
              <span class="white--text font-weight-medium">{{ item.value.index + 1 }}</span>
            </v-avatar>
            <div class="text-h6 align-self-start font-weight-medium">
              {{ item.readinessLevelShortTitle }}
              <div class="caption font-weight-bold">
                {{ item.step.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </v-sheet>

    <v-sheet v-if="isResearchGroupMember">
      <v-divider class="my-6" />

      <div v-if="research.is_private" class="text-subtitle-1">
        <v-icon class="mr-2" small color="black">
          lock
        </v-icon>
        Private project
      </div>
      <div v-else class="text-subtitle-1">
        <v-icon class="mr-2" small color="black">
          mdi-earth
        </v-icon>
        Public project
      </div>
    </v-sheet>

    <v-sheet v-if="researchRef.partners.length">
      <v-divider class="my-6" />

      <research-partners is-read-only :partners="researchRef.partners" />
    </v-sheet>

    <v-divider class="my-6" />

    <v-sheet v-if="contentList.length">
      <div class="text-h6">
        Expert Review
      </div>

      <v-dialog
        v-model="requestExpertReviewDialog.isShown"
        persistent
        max-width="600px"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            block
            color="primary"
            dark
            class="mt-4"
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
            <v-select
              v-model="selectedContentId"
              class="mt-4"
              :menu-props="{maxWidth:500}"
              label="Select a content to request review"
              item-text="title"
              filled
              item-value="id"
              :disabled="isRequestingReview"
              :items="contentListToReview"
            />
            <user-autocomplete-picker
              label="Find an expert to request a review"
              :users="experts"
              :is-disabled="!isSelectedContentId"
              :display-limit="6"
              @onSelectUser="selectExpert"
            />
          </v-card-text>
          <v-card-actions class="px-6">
            <v-row>
              <v-col class="py-2" cols="12">
                <v-btn
                  :loading="isRequestingReview"
                  :disabled="isRequestingReviewDisabled"
                  block
                  color="primary"
                  @click="requestReview()"
                >
                  Request
                </v-btn>
              </v-col>
              <v-col class="py-2" cols="12">
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
    </v-sheet>
  </div>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { ReviewService } from '@deip/review-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import LayoutSidebar from '@/components/layout/components/LayoutSidebar';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();


  export default {
    name: 'ResearchDetailsSidebar',
    components: { LayoutSidebar },
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
        researchMembersList: 'rd/researchMembersList',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        research: 'rd/research',
        researchRef: 'rd/researchRef',
        reviewsList: 'rd/reviewsList',
        user: 'auth/user',
        userJoinRequests: 'auth/userJoinRequests',
        tenant: 'auth/tenant'
      }),
      isSelectedContentId() {
        return this.selectedContentId !== null;
      },
      contentListToReview() {
        const expert = this.selectedExpert;
        if (!expert) return this.contentList;
        const expertReviews = this.reviewsList.filter(
          (r) => r.author.account.name == expert.account.name
        );
        return this.contentList.filter(
          (content) => !expertReviews.some((r) => r.research_content_id == content.id)
        );
      },
      isRequestingReviewDisabled() {
        return !this.selectedExpert || this.selectedContentId == null;
      },
      canJoinResearchGroup() {
        if (this.research) {
          if (
            this.researchGroupMembersList.some(
              (m) => m.account.name === this.user.username
            )
          ) {
            return false;
          }
          if (
            this.userJoinRequests.some(
              (r) => r.groupId === this.research.research_group_id
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
            (r) => r.groupId == this.research.research_group_id
          )
          : undefined;
      },
      eciList() {
        return this.disciplinesList.map((discipline) => {
          const eciObj = this.research.eci_per_discipline.find(
            (item) => item[0] === discipline.id
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
          ...this.researchGroupMembersList.map((m) => m.account.name)
        ];
        const existingReviewsForContent = this.reviewsList.filter(
          (r) => r.research_content_id === this.selectedContentId
        );
        blackList.push(
          ...existingReviewsForContent.map((r) => r.author.account.name)
        );
        return this.expertsList.filter((e) => !blackList.includes(e.account.name));
      },
      isActiveInvite() {
        return this.groupInvitesList.some(
          (invite) => invite.account_name == this.user.username
        );
      },
      isActiveJoinRequest() {
        return (
          this.currentJoinRequest && this.currentJoinRequest.status === 'pending'
        );
      },
      isJoinRequestSectionAvailable() {
        return false;
        // return (
        //   this.isProfileAvailable
        //   && (this.canJoinResearchGroup
        //   || this.isActiveJoinRequest
        //   || this.isActiveInvite)
        //   && !this.group.is_personal
        // );
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
        const eciSum = this.eciList.reduce((acc, curr) => acc + curr.value, 0);
        const eciSign = eciSum >= 0 ? 1 : -1;
        const eciRatio = eciSign * Math.min(+`${eciSum * eciSign}`.substring(0, 2), 50);
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
            this.$notifier.showSuccess('Request for the review has been sent successfully')
            this.selectedExpert = null;
            this.selectedContentId = null;
          })
          .catch((err) => {
            let errMsg = 'An error occurred while requesting the review. Please try again later';
            if (err.response && err.response.data) {
              errMsg = err.response.data;
            }
            this.$notifier.showError(errMsg)
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
            this.$notifier.showSuccess('Join request has been sent successfully!')
          })
          .catch((err) => {
            this.$notifier.showError(`An error occurred while sending join request, please try again later!`)
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
