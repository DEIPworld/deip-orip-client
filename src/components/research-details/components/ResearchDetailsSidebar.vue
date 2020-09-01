<template>
  <div>
    <d-block widget>
      <template #title>
        <router-link
          class="research-group-link"
          :to="routerLink"
        >
          {{ group.name }}
        </router-link>
      </template>

      <div
        v-for="(member, i) in researchMembersList"
        :key="member.account.id"
        class="mb-4"
      >
        <platform-avatar
          :key="'member-' + i"
          :size="40"
          :user="member"
          link-to-profile
          link-to-profile-class="pl-4"
        />
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
          <span class="pl-2 medium text-none">{{ $t('researchDetails.sidebar.join') }}</span>
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
                {{ $t('researchDetails.sidebar.letter') }}
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
                outlined
                auto-grow
                name="Cover letter"
                :label="$t('researchDetails.sidebar.letterField')"
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
                    {{ $t('researchDetails.sidebar.send') }}
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
                    {{ $t('researchDetails.sidebar.cancel') }}
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
          {{ $t('researchDetails.sidebar.cancel',
                { date: new Date(currentJoinRequest.created).toDateString() })
          }}
        </div>
        <div v-if="isActiveInvite" class="mt-4">
          {{ $t('researchDetails.sidebar.acceptInv') }}
          <router-link
            :to="{ name: 'UserDetails', params: { account_name: user.username}}"
            style="text-decoration: none"
          >
            {{ $t('researchDetails.sidebar.yourProfile') }}
          </router-link>
          {{ $t('researchDetails.sidebar.joinResGroup') }}
        </div>
      </div>
    </d-block>

    <d-block
      widget
      separated
      :title="$t('researchDetails.sidebar.eciBlock')"
    >
      <eci-stats
        :research-id="research.external_id"
        :disciplines="research.disciplines"
      />
    </d-block>

    <d-block widget separated>
<!--      <pre>-->
<!--        {{ $where(researchRef.extendedAttributes, { attribute: { '!type': ['partners', 'roadmap'] } }) }}-->
<!--      </pre>-->

      <attributes-read
        v-for="(attribute, index) in $where(researchRef.extendedAttributes, { '!value': null, attribute: { '!type': ['partners', 'roadmap'] } })"
        :key="`${index}-attr`"
        :value="attribute.value.value"
        :attribute-id="attribute.attribute._id"
      />

    </d-block>

    <d-block v-if="isResearchGroupMember" widget separated>
      <div v-if="research.is_private" class="text-subtitle-1">
        <v-icon class="mr-2" small color="black">
          lock
        </v-icon>
        {{ $t('researchDetails.sidebar.private') }}
      </div>
      <div v-else class="text-subtitle-1">
        <v-icon class="mr-2" small color="black">
          mdi-earth
        </v-icon>
        {{ $t('researchDetails.sidebar.public') }}
      </div>
    </d-block>

    <d-block v-if="researchRef.partners.length" widget separated>
      <research-partners is-read-only :partners="researchRef.partners" />
    </d-block>

<!--    <d-block v-if="contentList.length" widget separated :title="$t('researchDetails.sidebar.expertBlock.title')">-->
<!--      <v-dialog-->
<!--        v-model="requestExpertReviewDialog.isShown"-->
<!--        persistent-->
<!--        max-width="600px"-->
<!--      >-->
<!--        <template v-slot:activator="{ on }">-->
<!--          <v-btn-->
<!--            block-->
<!--            color="primary"-->
<!--            dark-->
<!--            class="mt-4"-->
<!--            v-on="on"-->
<!--          >-->
<!--            {{ $t('researchDetails.sidebar.expertBlock.reqReview') }}-->
<!--          </v-btn>-->
<!--        </template>-->

<!--        <v-card class="pa-6">-->
<!--          <v-card-title>-->
<!--            <div class="text-h5">-->
<!--              {{ $t('researchDetails.sidebar.expertBlock.reqReviewExpert') }}-->
<!--            </div>-->
<!--            <div class="right-top-angle">-->
<!--              <v-btn icon class="pa-0 ma-0" @click="requestExpertReviewDialog.isShown = false">-->
<!--                <v-icon color="black">-->
<!--                  close-->
<!--                </v-icon>-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </v-card-title>-->
<!--          <v-card-text>-->
<!--            <v-select-->
<!--              v-model="selectedContentId"-->
<!--              class="mt-4"-->
<!--              :menu-props="{maxWidth:500}"-->
<!--              :label="$t('researchDetails.sidebar.expertBlock.contentField')"-->
<!--              item-text="title"-->
<!--              outlined-->
<!--              item-value="id"-->
<!--              :disabled="isRequestingReview"-->
<!--              :items="contentListToReview"-->
<!--            />-->
<!--            <user-autocomplete-picker-->
<!--              :label="$t('researchDetails.sidebar.expertBlock.expertField')"-->
<!--              :users="experts"-->
<!--              :is-disabled="!isSelectedContentId"-->
<!--              :display-limit="6"-->
<!--              @onSelectUser="selectExpert"-->
<!--            />-->
<!--          </v-card-text>-->
<!--          <v-card-actions class="px-6">-->
<!--            <v-row>-->
<!--              <v-col class="py-2" cols="12">-->
<!--                <v-btn-->
<!--                  :loading="isRequestingReview"-->
<!--                  :disabled="isRequestingReviewDisabled"-->
<!--                  block-->
<!--                  color="primary"-->
<!--                  @click="requestReview()"-->
<!--                >-->
<!--                  {{ $t('researchDetails.sidebar.expertBlock.request') }}-->
<!--                </v-btn>-->
<!--              </v-col>-->
<!--              <v-col class="py-2" cols="12">-->
<!--                <v-btn-->
<!--                  color="primary"-->
<!--                  text-->
<!--                  block-->
<!--                  @click="requestExpertReviewDialog.isShown = false"-->
<!--                >-->
<!--                  {{ $t('researchDetails.sidebar.expertBlock.cancel') }}-->
<!--                </v-btn>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-card-actions>-->
<!--        </v-card>-->
<!--      </v-dialog>-->
<!--    </d-block>-->
  </div>
</template>

<script>
  import deipRpc from '@deip/rpc-client';
  import { mapGetters } from 'vuex';

  import { ReviewService } from '@deip/review-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ResearchContentReviewsService } from '@deip/research-content-reviews-service';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import EciStats from '@/components/EciMetrics/EciStats/EciStats';
  import AttributesRead from '@/components/Attributes/AttributesRead';

  const researchContentReviewsService = ResearchContentReviewsService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'ResearchDetailsSidebar',

    components: {
      AttributesRead,
      EciStats,
      DBlock
    },

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
        experts: 'research/experts',
        groupInvitesList: 'rd/groupInvitesList',
        researchMembersList: 'rd/researchMembersList',
        researchGroupMembersList: 'rd/researchGroupMembersList',
        research: 'rd/research',
        researchRef: 'rd/researchRef',
        reviewsList: 'rd/reviewsList',
        user: 'auth/user',
        userJoinRequests: 'auth/userJoinRequests',
        tenant: 'auth/tenant',
        researchEciStatsRecords: 'rd/researchEciStatsRecords'
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
            discipline_name: discipline.name,
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
        return this.experts.filter((e) => !blackList.includes(e.account.name));
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
      },
      routerLink() {
        const route = {};

        if (this.group.is_personal) {
          if (this.user.username === this.research.members[0]) {
            route.path = '/account';
          } else {
            route.name = 'UserDetails';
            route.params = { account_name: this.research.members[0] };
          }
        } else {
          route.name = 'ResearchGroupDetails';
          route.params = { research_group_permlink: encodeURIComponent(this.groupLink) };
        }

        return route;
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
            this.$notifier.showSuccess(this.$t('researchDetails.sidebar.successReqReview'));
            this.selectedExpert = null;
            this.selectedContentId = null;
          })
          .catch((err) => {
            let errMsg = this.$t('researchDetails.sidebar.errReqReview');
            if (err.response && err.response.data) {
              errMsg = err.response.data;
            }
            this.$notifier.showError(errMsg);
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
            this.$notifier.showSuccess(this.$t('researchDetails.sidebar.successJoinReq'));
          })
          .catch((err) => {
            this.$notifier.showError(this.$t('researchDetails.sidebar.errJoinReq'));
            console.error(err);
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
