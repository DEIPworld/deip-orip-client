<template>
  <portal to="sidebarRight">

    <v-navigation-drawer
      permanent
      clipped
      app
      right
      class="pa-4"
    >
      <div v-if="isOwner && hasInvites">
        <div id="invites" class="text-h6 font-weight-bold pa-4">
          Invites: {{ invites.length }}
        </div>
        <v-divider />
        <div
          v-for="(invite, index) of invites"
          :key="'invite-' + index"
          class="pa-4"
        >
          <router-link
            class="a full-width break-word font-weight-medium"
            :to="{ name: 'ResearchGroupDetails', params: {
            research_group_permlink: encodeURIComponent(invite.group.permlink),
          }}"
          >
            {{ invite.group.name }}
          </router-link>
          <div class="py-2 caption font-weight-medium">
            invited you to join them with
          </div>
          <div class="text-right full-width">
            <v-btn
              small
              class="mx-0 py-0 my-2"
              color="primary"
              dark
              text
              @click="openInviteDetailsDialog(invite, index)"
            >
              View
            </v-btn>
          </div>
        </div>

        <v-dialog
          v-if="inviteDetailsDialog.item"
          v-model="inviteDetailsDialog.isShown"
          persistent
          max-width="600px"
        >
          <v-card class="pa-6">
            <v-card-title>
              <div class="text-h5">
                {{ inviteDetailsDialog.item.group.name }}
              </div>
              <div class="right-top-angle">
                <v-btn icon class="pa-0 ma-0" @click="closeInviteDetailsDialog()">
                  <v-icon color="black">
                    close
                  </v-icon>
                </v-btn>
              </div>
            </v-card-title>
            <v-card-text>
              <div class="text-subtitle-1 pt-6 font-weight-medium black--text">{{ inviteDetailsDialog.item.notes }}</div>
            </v-card-text>
            <v-card-actions class="flex-wrap px-6">
              <div class="w-100 py-2">
                <v-btn
                  color="primary"
                  block
                  :disabled="inviteDetailsDialog.isApprovingInvite || inviteDetailsDialog.isRejectingInvite"
                  :loading="inviteDetailsDialog.isApprovingInvite"
                  @click="approveInvite()"
                >
                  Accept
                </v-btn>
              </div>
              <div class="w-100 py-2">
                <v-btn
                  color="primary"
                  block
                  text
                  :disabled="inviteDetailsDialog.isApprovingInvite || inviteDetailsDialog.isRejectingInvite"
                  :loading="inviteDetailsDialog.isRejectingInvite"
                  @click="rejectInvite()"
                >
                  Reject
                </v-btn>
              </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider class="mb-6" />
      </div>
      <!-- ### END User Profile Invites Section ### -->

      <div v-if="isOwner && hasReviewRequests">
        <div id="review-requests" class="text-h6 font-weight-bold pa-4">
          Review Requests: {{ reviewRequests.length }}
        </div>
        <v-divider />
        <div
          v-for="(reviewRequest, index) of reviewRequests"
          :key="reviewRequest._id"
          class="pa-4"
        >
          <platform-avatar link-to-profile :user="reviewRequest.requestorProfile" />
          <div class="py-2 caption font-weight-medium">
            requests your review for "{{ reviewRequest.research.title }}"
            research
          </div>
          <!-- <router-link tag="div" class="a full-width break-word font-weight-medium caption"
              :to="{ name: 'ResearchContentDetails', params: {
                  research_group_permlink: encodeURIComponent(reviewRequest.research.research_group.permlink),
                  research_permlink: encodeURIComponent(reviewRequest.research.permlink),
                  content_permlink: encodeURIComponent(reviewRequest.content.permlink)
              }}"
              >{{reviewRequest.content.title}}
          </router-link> -->

          <div class="pt-2 full-width display-flex justify-space-between">
            <v-btn
              color="green"
              text
              small
              class="ma-0 py-0 px-2"
              :to="{ name: 'ResearchContentDetails', params: {
              research_group_permlink: encodeURIComponent(reviewRequest.research.research_group.permlink),
              research_permlink: encodeURIComponent(reviewRequest.research.permlink),
              content_permlink: encodeURIComponent(reviewRequest.content.permlink)
            }}"
            >
              Proceed
            </v-btn>

            <v-btn
              color="red"
              text
              small
              class="ma-0 py-0 px-2"
              :loading="reviewRequest.isDenying"
              @click="denyReviewRequest(reviewRequest._id)"
            >
              Reject
            </v-btn>
          </div>
          <v-divider v-if="index !== reviewRequests.length - 1" class="ma-2" />
        </div>
        <v-divider class="mb-6" />
      </div>


      <!-- ### START User Profile Expertise Section ### -->

      <eci-metrics-widget
        :account-name="userInfo.account.name"
        :expertise-data="expertise"
        enable-stats
        :enable-history="false"
      />

      <user-claim-expertise-dialog
        :is-shown="isClaimExpertiseDialogShown"
        @close="closeClaimExpertiseDialog"
      />
      <!-- </v-card> -->
    </v-navigation-drawer>
  </portal>

</template>

<script>
  // import moment from 'moment';
  // import deipRpc from '@deip/rpc-client';

  import { mapGetters } from 'vuex';
  import { UserService } from '@deip/user-service';
  import { ProposalsService } from '@deip/proposals-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ExpertiseContributionsService } from '@deip/expertise-contributions-service';

  import * as bankCardsService from '../../../utils/bankCard';
  import UserClaimExpertiseDialog from '@/components/UserDetails/components/UserClaimExpertiseDialog';
  import EciMetricsWidget from '@/components/EciMetrics/EciMetricsWidget';

  const expertiseContributionsService = ExpertiseContributionsService.getInstance();
  const userService = UserService.getInstance();
  const proposalsService = ProposalsService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'UserDetailsSidebar',

    components: { EciMetricsWidget, UserClaimExpertiseDialog },

    data() {
      return {
        inviteDetailsDialog: {
          isShown: false,
          item: null,
          isApprovingInvite: false,
          isRejectingInvite: false,
          index: null
        }
      };
    },

    computed: {
      ...mapGetters({
        currentUser: 'auth/user',
        userInfo: 'userDetails/userInfo',
        expertise: 'userDetails/expertise',
        eciStatsByDiscipline: 'userDetails/eciStatsByDiscipline',
        invites: 'userDetails/invites',
        reviewRequests: 'userDetails/reviewRequests',
        isClaimExpertiseDialogShown: 'userDetails/isClaimExpertiseDialogShown'
      }),
      isOwner() {
        return this.currentUser && this.currentUser.account.name === this.userInfo.account.name;
      },
      isContactsInfoSpecified() {
        return this.userInfo && this.userInfo.profile && this.userInfo.profile.email;
      },
      isPersonalInfoSpecified() {
        return this.userInfo && this.userInfo.profile
          && (this.userInfo.profile.firstName || this.userInfo.profile.lastName || this.userInfo.profile.birthdate);
      },
      isAdditionalInfoSpecified() {
        return this.userInfo && this.userInfo.profile
          && (this.userInfo.profile.category || this.userInfo.profile.occupation || this.userInfo.profile.webPages.length);
      },
      isProfileAvailable() {
        return this.userInfo.profile != null;
      },
      hasInvites() {
        return this.invites.length;
      },
      hasReviewRequests() {
        return this.reviewRequests.length;
      }
    },

    methods: {
      openInviteDetailsDialog(invite, index) {
        this.inviteDetailsDialog.isShown = true;
        this.inviteDetailsDialog.item = invite;
        this.inviteDetailsDialog.index = index;
      },

      closeInviteDetailsDialog(invite, index) {
        this.inviteDetailsDialog.isShown = false;
        this.inviteDetailsDialog.item = null;
        this.inviteDetailsDialog.isApprovingInvite = false;
        this.inviteDetailsDialog.isRejectingInvite = false;
      },

      approveInvite() {
        const invite = this.inviteDetailsDialog.item;
        const proposalId = invite._id;
        this.inviteDetailsDialog.isApprovingInvite = true;

        researchGroupService.approveResearchGroupInviteViaOffChain(this.currentUser.privKey, {
          inviteId: proposalId,
          account: this.currentUser.username
        })
          .then(() => {
            this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
            this.$store.dispatch('auth/loadGroups');
            this.$store.dispatch('userDetails/loadGroups', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"Invite has been approved successfully !"`);
          }, (err) => {
            this.$notifier.showError(`An error occurred while accepting invite, please try again later`);
            console.error(err);
          })
          .finally(() => {
            this.closeInviteDetailsDialog();
          });
      },

      rejectInvite() {
        const invite = this.inviteDetailsDialog.item;
        const proposalId = invite._id;
        this.inviteDetailsDialog.isRejectingInvite = true;

        researchGroupService.rejectResearchGroupInviteViaOffChain(this.currentUser.privKey, {
          inviteId: proposalId,
          account: this.currentUser.username
        })
          .then(() => {
            this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
            this.$notifier.showSuccess(`"Invite has been rejected successfully !"`);
          }, (err) => {
            this.$notifier.showError(`An error occurred while rejecting invite, please try again later`);
            console.error(err);
          })
          .finally(() => {
            this.closeInviteDetailsDialog();
          });
      },

      openClaimExpertiseDialog() {
        this.$store.dispatch('userDetails/openExpertiseTokensClaimDialog');
      },

      closeClaimExpertiseDialog() {
        this.$store.dispatch('userDetails/closeExpertiseTokensClaimDialog');
      },

      clearLocalStorageItems() {
        bankCardsService.removeInvestorBankCard(this.currentUser.username);
      },

      denyReviewRequest(reviewRequestId) {
        return this.$store.dispatch('userDetails/denyReviewRequest', { reviewRequestId });
      },

      getEciPercentile() {
        return 10;
      }
    }
  };
</script>

<style lang="less" scoped>
  .corner-edit {
    position: absolute;
    top: 18px;
    right: 10px;
  }

  .owner-hint {
    font-style: italic;
  }

  .invite-item {
    border-bottom: 1px solid rgb(224, 224, 224)
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
