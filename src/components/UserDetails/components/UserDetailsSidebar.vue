<template>
  <v-card flat class=" full-height">
    <div v-if="isOwner && hasInvites">
      <div id="invites" class="text-h6 font-weight-bold pb-2">
        Invites: {{ invites.length }}
      </div>
      <div
        v-for="(invite, index) of invites"
        :key="'invite-' + index"
        class="py-2"
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
            outlined
            @click="openInviteDetailsDialog(invite, index)"
          >
            View
          </v-btn>
        </div>

        <v-divider v-if="index !== reviewRequests.length - 1" class="ma-2" />
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
    </div>
    <!-- ### END User Profile Invites Section ### -->

    <div v-if="isOwner && hasReviewRequests">
      <div id="review-requests" class="text-h6 font-weight-bold pb-2">
        Review Requests: {{ reviewRequests.length }}
      </div>
      <div
        v-for="(reviewRequest, index) of reviewRequests"
        :key="reviewRequest._id"
        class="py-2"
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
      <v-divider />
    </div>

    <!-- ### START User Profile Expertise Section ### -->
    <div class="mt-6">
      <div class="text-h6 bold">
        Expertise Contribution Index
      </div>


      <div
        v-for="(item, i) in expertise"
        :key="`eci-${i}`"
        class="expertise px-1 my-1 text-caption"
      >
        <router-link :to="goToExpertiseDetails(item.discipline_id)" style="text-decoration: none">

          <v-row no-gutters justify="space-between">
            <v-col cols="auto" class="pa-1 primary--text font-weight-bold">
<!--              TOP {{ getEciPercentile(item.amount, userInfo.account.name, item.discipline_id) }}%-->
              {{ item.discipline_name }}
            </v-col>
            <v-col cols="auto" class="pa-1 grey--text">
              ECI {{ item.amount | commaNumber }}
            </v-col>
          </v-row>

<!--          <v-divider />-->

<!--          <div class="pa-1 black&#45;&#45;text">-->
<!--            {{ item.discipline_name }}-->
<!--          </div>-->

        </router-link>
      </div>

      <div v-if="!expertise.length" class="text-body-1">
        <div v-if="isOwner">
          You have no Expertise Tokens yet. Use <span class="a" @click="openClaimExpertiseDialog()">Claim</span>
          process to apply for Expertise Tokens
        </div>
        <div v-if="!isOwner">
          <span class="text-body-2">{{ userInfo | fullname }}</span> has no Expertise Tokens yet
        </div>
      </div>

      <div v-if="expertise.length && isOwner" class="text-body-1 full-width c-mt-4">
        <v-btn
          block
          outlined
          color="primary"
          class="ma-0"
          @click="openClaimExpertiseDialog()"
        >
          Claim new Discipline
        </v-btn>
      </div>

    </div>
    <!-- ### END User Profile Expertise Section ### -->

    <!-- ### START User Profile Contacts Section ### -->
    <div v-if="isProfileAvailable && (isContactsInfoSpecified || isOwner)" class="mt-4">
      <div class="sidebar-fullwidth">
        <v-divider />
      </div>
      <div class="text-subtitle-1 font-weight-bold mt-4">
        <div class="mt-1">
          Contacts info
        </div>
      </div>
      <div class="pt-2 pb-6">
        <div v-if="userInfo.profile">
          <div>
            <span v-if="isOwner && !userInfo.profile.email" class="owner-hint">
              <v-icon size="18" class="mr-2">mail</v-icon>
              Add your email here
            </span>
            <span v-else>
              <v-icon v-if="userInfo.profile.email" size="18" class="mr-2">mail</v-icon>
              {{ userInfo.profile.email || '-' }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <!-- ### END User Profile Contacts Section ### -->


    <!-- ### START User Profile Info Section ### -->
    <div v-if="isProfileAvailable && (isPersonalInfoSpecified || isOwner)" class="mt-4">
      <div class="sidebar-fullwidth">
        <v-divider />
      </div>
      <div class="text-subtitle-1 font-weight-bold mt-4">
        <div class="mt-1">
          Personal information
        </div>
      </div>

      <div class="pt-4 pb-6">
        <div v-if="userInfo.profile">
          <div>
            <v-row v-if="isOwner && !userInfo.profile.firstName" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                First Name
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left owner-hint">
                add first name
              </v-col>
            </v-row>
            <v-row v-else no-gutters>
              <v-col cols="4" class="font-weight-medium">
                First Name
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                {{ userInfo.profile.firstName || '-' }}
              </v-col>
            </v-row>

            <v-row v-if="isOwner && !userInfo.profile.lastName" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Last Name
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left owner-hint">
                add last name
              </v-col>
            </v-row>
            <v-row v-else no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Last Name
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                {{ userInfo.profile.lastName || '-' }}
              </v-col>
            </v-row>

            <!-- <v-row v-if="isOwner && !userInfo.profile.birthdate" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Birthdate
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left owner-hint">
                add birthdate
              </v-col>
            </v-row>
            <v-row v-else no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Birthdate
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                {{ userInfo.profile.birthdate ? new
                Date(userInfo.profile.birthdate).toDateString() : '-' }}
              </v-col>
            </v-row> -->

            <v-row v-if="userInfo.profile.created_at" class="mt-4" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Registered
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                {{ new Date(userInfo.profile.created_at).toDateString() }}
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
    <!-- ### END User Profile Info Section ### -->

    <!-- ### START User Profile Additional Info Section ### -->
    <div v-if="isProfileAvailable && (isAdditionalInfoSpecified || isOwner)" class="mt-4">
      <div class="sidebar-fullwidth">
        <v-divider />
      </div>
      <div class="text-subtitle-1 font-weight-bold mt-4">
        <div class="mt-1">
          Additional information
        </div>
      </div>

      <div class="pt-4 pb-6">
        <div v-if="userInfo.profile">
          <div>
            <v-row v-if="isOwner && !userInfo.profile.category" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Category
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left owner-hint">
                add category
              </v-col>
            </v-row>
            <v-row v-else no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Category
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                {{ userInfo.profile.category || '-' }}
              </v-col>
            </v-row>

            <v-row v-if="isOwner && !userInfo.profile.occupation" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Occupation
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left owner-hint">
                add occupation
              </v-col>
            </v-row>
            <v-row v-else no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Occupation
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                {{ userInfo.profile.occupation || '-' }}
              </v-col>
            </v-row>

            <v-row v-if="isOwner && !userInfo.profile.webPages.length" no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Web site
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left owner-hint">
                add web site
              </v-col>
            </v-row>
            <v-row v-else no-gutters>
              <v-col cols="4" class="font-weight-medium">
                Web site
              </v-col>
              <v-col cols="7" offset="1" class="text-align-left">
                <div v-for="(item, i) in userInfo.profile.webPages" :key="`${i}-webPage`">
                  {{ item.link || '-' }}
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
    <!-- ### END User Profile Additional Info Section ### -->

    <user-claim-expertise-dialog
      :is-shown="isClaimExpertiseDialogShown"
      @close="closeClaimExpertiseDialog"
    />
  </v-card>
</template>

<script>
  // import moment from 'moment';
  // import deipRpc from '@deip/rpc-client';

  import { mapGetters } from 'vuex';
  import { UserService } from '@deip/user-service';
  import { ProposalsService } from '@deip/proposals-service';
  import { ResearchGroupService } from '@deip/research-group-service';

  import * as bankCardsService from '../../../utils/bankCard';
  import UserClaimExpertiseDialog from '@/components/UserDetails/components/UserClaimExpertiseDialog';

  const userService = UserService.getInstance();
  const proposalsService = ProposalsService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'UserDetailsSidebar',

    components: { UserClaimExpertiseDialog },

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

    created() {},

    methods: {

      goToExpertiseDetails(id) {
        return this.$route.path.includes('/account')
          ? {
            name: 'account.expertiseDetails',
            query: {
              discipline_id: id
            }
          }
          : {
            name: 'UserExpertiseDetails',
            params: {
              account_name: this.userInfo.account.name
            },
            query: {
              discipline_id: id
            }
          };
      },

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
            console.log(err);
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
            console.log(err);
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
