<template>
  <v-card class="pa-4 full-height">
    <v-layout column>
      <div v-if="isOwner && hasInvites">
        <div class="title font-weight-bold pb-2" id="invites">Invites: {{invites.length}}</div>
        <v-layout
          column
          class="py-2"
          v-for="(invite, index) of invites"
          :key="'invite-' + index">

          <v-layout column align-baseline>
            <router-link tag="div" class="a full-width break-word font-weight-medium caption"
                         :to="{ name: 'ResearchGroupDetails', params: {
                            research_group_permlink: encodeURIComponent(invite.group.permlink),
                        }}"
            >{{invite.group.name}}
            </router-link>
            <div class="py-2 caption font-weight-medium">
              invites you to join them with
              <span class="grey--text font-weight-bold">{{convertToPercent(invite.research_group_token_amount)}}%</span>
              of group weight
            </div>
            <div class="text-xs-right full-width">
              <v-btn small class="mx-0 py-0 my-2" color="primary" dark outline
                     @click="openInviteDetailsDialog(invite, index)">View
              </v-btn>
            </div>

          </v-layout>
          <v-divider class="ma-2" v-if="index !== reviewRequests.length - 1" />
        </v-layout>

        <v-dialog v-if="inviteDetailsDialog.item" v-model="inviteDetailsDialog.isShown" persistent max-width="600px">
          <v-card class="pa-4">
            <v-card-title>
              <v-layout row align-center align-baseline>
                <v-flex grow class="headline">
                  {{inviteDetailsDialog.item.group.name}}
                </v-flex>
                <v-flex shrink align-self-center right-top-angle>
                  <v-btn @click="closeInviteDetailsDialog()" icon class="pa-0 ma-0">
                    <v-icon color="black">close</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-card-text>
              <div>{{inviteDetailsDialog.item.cover_letter}}</div>
              <div class="subheading pt-4 font-weight-medium">Group weight: <span class="grey--text">{{convertToPercent(inviteDetailsDialog.item.research_group_token_amount)}}%</span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-layout row wrap>
                <v-flex xs12 py-2>
                  <v-btn
                    color="primary"
                    block
                    @click="approveInvite()"
                    :disabled="inviteDetailsDialog.isApprovingInvite || inviteDetailsDialog.isRejectingInvite"
                    :loading="inviteDetailsDialog.isApprovingInvite"
                  >Accept
                  </v-btn>
                </v-flex>
                <v-flex xs12 py-2>
                  <v-btn
                    color="primary"
                    block
                    flat
                    @click="rejectInvite()"
                    :disabled="inviteDetailsDialog.isApprovingInvite || inviteDetailsDialog.isRejectingInvite"
                    :loading="inviteDetailsDialog.isRejectingInvite"
                  >Reject
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <!-- ### END User Profile Invites Section ### -->

      <div v-if="isOwner && hasReviewRequests">
        <div class="title font-weight-bold pb-2" id="review-requests">Review Requests: {{reviewRequests.length}}</div>
        <v-layout
          column
          class="py-2"
          v-for="(reviewRequest, index) of reviewRequests"
          :key="reviewRequest._id"
        >
          <v-layout column align-baseline>
            <platform-avatar link-to-profile :user="reviewRequest.requestorProfile"></platform-avatar>
            <div class="py-2 caption font-weight-medium">requests your review for "{{reviewRequest.research.title}}"
              research
            </div>
            <!-- <router-link tag="div" class="a full-width break-word font-weight-medium caption"
                :to="{ name: 'ResearchContentDetails', params: {
                    research_group_permlink: encodeURIComponent(reviewRequest.research.group_permlink),
                    research_permlink: encodeURIComponent(reviewRequest.research.permlink),
                    content_permlink: encodeURIComponent(reviewRequest.content.permlink)
                }}"
                >{{reviewRequest.content.title}}
            </router-link> -->

            <v-layout row justify-space-between class="pt-2 full-width">
              <v-btn
                color="green"
                flat
                small
                class="ma-0 py-0 px-2"
                :to="{ name: 'ResearchContentDetails', params: {
                        research_group_permlink: encodeURIComponent(reviewRequest.research.group_permlink),
                        research_permlink: encodeURIComponent(reviewRequest.research.permlink),
                        content_permlink: encodeURIComponent(reviewRequest.content.permlink)
                    }}"
              >Proceed
              </v-btn>

              <v-btn
                color="red"
                flat
                small
                class="ma-0 py-0 px-2"
                @click="denyReviewRequest(reviewRequest._id)"
                :loading="reviewRequest.isDenying"
              >Reject
              </v-btn>
            </v-layout>
          </v-layout>
          <v-divider class="ma-2" v-if="index !== reviewRequests.length - 1" />
        </v-layout>
        <v-divider></v-divider>
      </div>

      <!-- ### START User Profile Expertise Section ### -->
      <div class="mt-4">
        <div class="title bold">Expertise Contribution Index</div>
        <div class="py-2">
            <v-layout tag="div" column v-for="(item, i) in expertise" :key="`eci-${i}`" class="expertise px-1 my-2">
              <router-link :to="{ name: 'UserExpertiseDetails', account_name: userInfo.account.name, query: { discipline_id: item.discipline_id }}" style="text-decoration: none">
                <v-layout justify-space-between>
                  <div class="blue--text text--accent-4 bold">TOP <span class="font-weight-bold">{{getEciPercentile(item.amount, userInfo.account.name, item.discipline_id)}}</span>%</div>
                  <div class="grey--text">ECI {{ item.amount }}</div>
                </v-layout>
                <v-divider class="expertise__divider" />
                <div class="expertise__disc-name pt-1">{{ item.discipline_name }}</div>
              </router-link>
            </v-layout>
          <div v-if="!expertise.length" class="body-1">
            <div v-if="isOwner">
              You have no Expertise Tokens yet. Use <span class="a" @click="openClaimExpertiseDialog()">Claim</span> process to apply for Expertise Tokens
            </div>
            <div v-if="!isOwner"><span class="body-2">{{userInfo | fullname}}</span> has no Expertise Tokens yet</div>
          </div>
          <div v-if="expertise.length && isOwner" class="body-1 full-width c-mt-4">
            <v-btn @click="openClaimExpertiseDialog()" block outline small color="primary" class="ma-0">
              Claim new Discipline
            </v-btn>
          </div>
        </div>
      </div>
      <!-- ### END User Profile Expertise Section ### -->

      <!-- ### START User Profile Contacts Section ### -->
      <div class="mt-3" v-if="isProfileAvailable && (isContactsInfoSpecified || isOwner)">
        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
        <div class="subheading font-weight-bold mt-3">
          <v-layout row>
            <v-flex xs11 mt-1>Contacts info</v-flex>
          </v-layout>
        </div>
        <div class="pt-2 pb-4">
          <div v-if="userInfo.profile">
            <div>
              <span v-if="isOwner && !userInfo.profile.email" class="owner-hint">
                  <v-icon size="18" class="mr-2">mail</v-icon>
                  Add your email here
              </span>
              <span v-else>
                <v-icon v-if="userInfo.profile.email" size="18" class="mr-2">mail</v-icon>
                {{userInfo.profile.email || '-'}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- ### END User Profile Contacts Section ### -->


      <!-- ### START User Profile Info Section ### -->
      <div class="mt-3" v-if="isProfileAvailable && (isPersonalInfoSpecified || isOwner)">
        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
        <div class="subheading font-weight-bold mt-3">
          <v-layout row>
            <v-flex xs11 mt-1>Personal info</v-flex>
          </v-layout>
        </div>

        <div class="pt-3 pb-4">
          <div v-if="userInfo.profile">
            <div>
              <v-layout row v-if="isOwner && !userInfo.profile.firstName">
                <v-flex xs4 font-weight-medium>First Name</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left owner-hint>add first name</v-flex>
              </v-layout>
              <v-layout row v-else>
                <v-flex xs4 font-weight-medium>First Name</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left>{{userInfo.profile.firstName || '-'}}</v-flex>
              </v-layout>

              <v-layout row v-if="isOwner && !userInfo.profile.lastName">
                <v-flex xs4 font-weight-medium>Last Name</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left owner-hint>add last name</v-flex>
              </v-layout>
              <v-layout row v-else>
                <v-flex xs4 font-weight-medium>Last Name</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left>{{userInfo.profile.lastName || '-'}}</v-flex>
              </v-layout>

              <v-layout row v-if="isOwner && !userInfo.profile.birthday">
                <v-flex xs4 font-weight-medium>Birthday</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left owner-hint>add birthday</v-flex>
              </v-layout>
              <v-layout row v-else>
                <v-flex xs4 font-weight-medium>Birthday</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left>{{ userInfo.profile.birthday ? new
                  Date(userInfo.profile.birthday).toDateString() : '-'}}
                </v-flex>
              </v-layout>

              <v-layout row mt-3 v-if="userInfo.profile.created">
                <v-flex xs4 font-weight-medium>Registered</v-flex>
                <v-flex xs1></v-flex>
                <v-flex xs7 text-align-left>{{new Date(userInfo.profile.created).toDateString()}}</v-flex>
              </v-layout>
            </div>
          </div>
        </div>
      </div>
      <!-- ### END User Profile Info Section ### -->

      <user-claim-expertise-dialog
        :is-shown="isClaimExpertiseDialogShown"
        @close="closeClaimExpertiseDialog"
      ></user-claim-expertise-dialog>
    </v-layout>
  </v-card>
</template>

<script>
  // import moment from 'moment';
  // import deipRpc from '@deip/rpc-client';

  import { mapGetters } from 'vuex';
  import * as bankCardsService from './../../../utils/bankCard'

  import { UserService } from '@deip/user-service';

  const userService = UserService.getInstance();

  export default {
    name: 'UserDetailsSidebar',
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
        return this.currentUser && this.currentUser.username === this.$route.params.account_name
      },
      isContactsInfoSpecified() {
        return this.userInfo && this.userInfo.profile && this.userInfo.profile.email;
      },
      isPersonalInfoSpecified() {
        return this.userInfo && this.userInfo.profile &&
          (this.userInfo.profile.firstName || this.userInfo.profile.lastName || this.userInfo.profile.birthday);
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
        let invite = this.inviteDetailsDialog.item;
        this.inviteDetailsDialog.isApprovingInvite = true;
        userService.approveInvite(
          invite.id,
          this.currentUser.username
        ).then(() => {
          this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
          this.$store.dispatch('auth/loadGroups');
          this.$store.dispatch('userDetails/loadGroups', { username: this.currentUser.username })
          this.$store.dispatch('layout/setSuccess', {
            message: `"Invite has been approved successfully !"`
          });

        }, (err) => {
          this.$store.dispatch('layout/setError', {
            message: `An error occurred while accepting invite, please try again later`
          });
          console.log(err);
        }).finally(() => {
          this.closeInviteDetailsDialog();
        })
      },

      rejectInvite() {
        let invite = this.inviteDetailsDialog.item;
        this.inviteDetailsDialog.isRejectingInvite = true;
        userService.rejectInvite(
          invite.id,
          this.currentUser.username
        ).then(() => {
          this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
          this.$store.dispatch('layout/setSuccess', {
            message: `"Invite has been rejected successfully !"`
          });

        }, (err) => {
          this.$store.dispatch('layout/setError', {
            message: `An error occurred while rejecting invite, please try again later`
          });
          console.log(err);
        }).finally(() => {
          this.closeInviteDetailsDialog();
        })
      },

      openClaimExpertiseDialog() {
        this.$store.dispatch('userDetails/openExpertiseTokensClaimDialog')
      },

      closeClaimExpertiseDialog() {
        this.$store.dispatch('userDetails/closeExpertiseTokensClaimDialog')
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
    },
    created() {
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
