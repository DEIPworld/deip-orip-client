<template>
  <div>
    <d-block-widget v-if="isOwner && hasInvites">
      <!-- <v-card outlined> -->
      <div id="invites" class="text-h6 font-weight-medium">
        <v-badge
          color="warning"
          inline
          :content="invites.length"
        >
          {{ $t('userDetailRouting.sidebar.invites') }}
        </v-badge>
      </div>
      <v-divider class="mt-n2" />
      <v-carousel
        v-model="invitesSlider"
        hide-delimiters
        :show-arrows="false"
        light
        height="auto"
      >
        <v-carousel-item
          v-for="(invite, index) in invites"
          :key="'invite-request-' + index"
        >
          <d-box-item
            :avatar="invite.group.external_id | researchGroupLogoSrc(64, 64)"
            :size="40"
          >
            <router-link
              class="a full-width break-word font-weight-medium"
              :to="{ name: 'teamDetails', params: {
                teamId: invite.group.external_id,
              }}"
            >
              <v-clamp
                autoresize
                :max-lines="1"
                class="text-body-2 font-weight-medium"
              >
                {{ invite.group.name }}
              </v-clamp>
            </router-link>
            <div class="text-caption text--secondary">
              {{ $t('userDetailRouting.sidebar.invitedYou') }}
            </div>
          </d-box-item>
        </v-carousel-item>
      </v-carousel>
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-icon
            v-if="invites.length > 1"
            class="mr-4"
            @click="prevSlide('invitesSlider', invites)"
          >
            navigate_before
          </v-icon>
          <v-icon
            v-if="invites.length > 1"
            @click="nextSlide('invitesSlider', invites)"
          >
            navigate_next
          </v-icon>
        </div>
        <v-btn
          text
          small
          class="ml-1"
          color="primary"
          @click="openInviteDetailsDialog(invites[invitesSlider])"
        >
          {{ $t('userDetailRouting.sidebar.viewBtn') }}
        </v-btn>
      </div>
      <!-- </v-card> -->

      <vex-dialog
        v-model="inviteDetailsDialog.isShown"
        :loading="inviteDetailsDialog.proccess"
        :disabled="inviteDetailsDialog.proccess"
        :button-true-text="$t('userDetailRouting.sidebar.acceptBtn')"
        :button-false-text="$t('userDetailRouting.sidebar.rejectBtn')"
        :title="inviteDetailsDialog.groupName"
        @click:confirm="approveInvite"
        @click:cancel="rejectInvite"
      >
        {{ inviteDetailsDialog.groupName }} {{ $t('userDetailRouting.sidebar.invitedYou') }}
      </vex-dialog>
    </d-block-widget>

    <d-block-widget v-if="isOwner && hasReviewRequests">
      <div id="review-requests" class="text-h6 font-weight-medium">
        <v-badge
          color="warning"
          inline
          :content="reviewRequests.length"
        >
          {{ $t('userDetailRouting.sidebar.reviewReq') }}
        </v-badge>
      </div>
      <v-divider class="mt-n2" />
      <v-carousel
        v-model="reviewsSlider"
        hide-delimiters
        :show-arrows="false"
        light
        height="auto"
      >
        <v-carousel-item
          v-for="(reviewRequest, index) of reviewRequests"
          :key="`review-request-${index}`"
        >
          <d-box-item
            :avatar="reviewRequest.requestorProfile.profile | avatarSrc(64, 64)"
            :size="40"
            class="align-end"
          >
            <router-link
              class="a full-width break-word font-weight-medium"
              :to="{ name: 'UserDetails', params: { account_name: reviewRequest.requestorProfile.account.name } }"
            >
              <v-clamp
                autoresize
                :max-lines="1"
                class="text-body-2 font-weight-medium"
              >
                {{ reviewRequest.requestorProfile | accountFullname }}
              </v-clamp>
            </router-link>
            <div class="text-caption text--secondary">
              {{ $t('userDetailRouting.sidebar.reqYouReview',
                    { title: reviewRequest.research.title }) }}
            </div>
          </d-box-item>
        </v-carousel-item>
      </v-carousel>
      <div class="d-flex justify-space-between align-center">
        <div>
          <v-icon
            v-if="reviewRequests.length > 1"
            class="mr-4"
            @click="prevSlide('reviewsSlider', reviewRequests)"
          >
            navigate_before
          </v-icon>
          <v-icon
            v-if="reviewRequests.length > 1"
            @click="nextSlide('reviewsSlider', reviewRequests)"
          >
            navigate_next
          </v-icon>
        </div>
        <v-btn
          text
          small
          class="ml-1"
          color="primary"
          @click="goToReview(reviewRequests[reviewsSlider])"
        >
          {{ $t('userDetailRouting.sidebar.viewBtn') }}
        </v-btn>
      </div>
    </d-block-widget>

    <!--  TODO: need user disciplines  -->
    <d-block-widget
      v-if="$hasModule(DEIP_MODULE.APP_ECI)"
      :title="$t('userDetailRouting.sidebar.eci')"
    >
      <eci-stats
        :account-name="userInfo.account.name"
        :disciplines="expertise.map((e) => ({ name: e.discipline_name, external_id: e.discipline_external_id }))"
        :separated="!!(isOwner && (hasInvites || hasReviewRequests))"
      />
    </d-block-widget>

  </div>
</template>

<script>

  import { mapGetters } from 'vuex';
  import { ProposalsService } from '@deip/proposals-service';
  import DBlockWidget from '@/components/Deipify/DBlock/DBlockWidget';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  import EciStats from '@/components/EciMetrics/EciStats/EciStats';
  import * as bankCardsService from '../../../utils/bankCard';

  const proposalsService = ProposalsService.getInstance();

  export default {
    name: 'UserDetailsSidebar',

    components: {
      EciStats,
      DBoxItem,
      DBlockWidget
    },

    data() {
      return {
        invitesSlider: 0,
        reviewsSlider: 0,
        inviteDetailsDialog: {
          isShown: false,
          item: null,
          groupName: '',
          proccess: false
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
        reviewRequests: 'userDetails/reviewRequests'
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
      nextSlide(slider, sliderItems) {
        this[slider] === sliderItems.length - 1 ? this[slider] = 0 : this[slider]++;
      },
      prevSlide(slider, sliderItems) {
        this[slider] === 0 ? this[slider] = sliderItems.length - 1 : this[slider]--;
      },
      openInviteDetailsDialog(invite) {
        this.inviteDetailsDialog.item = invite;
        this.inviteDetailsDialog.groupName = invite.group.name;
        this.inviteDetailsDialog.isShown = true;
      },

      goToReview(review) {
        this.$router.push(
          {
            name: 'project.content.details',
            params: {
              projectId: review.research.external_id,
              contentId: review.content.external_id
            }
          }
        );
      },

      closeInviteDetailsDialog() {
        this.inviteDetailsDialog.item = null;
        this.inviteDetailsDialog.groupName = '';
        this.inviteDetailsDialog.proccess = false;
        this.inviteDetailsDialog.isShown = false;
      },

      approveInvite() {
        const invite = this.inviteDetailsDialog.item;
        const proposalId = invite._id;
        this.inviteDetailsDialog.proccess = true;

        proposalsService.updateProposal({
          privKey: this.currentUser.privKey,
          username: this.currentUser.username
        }, {
          externalId: proposalId,
          activeApprovalsToAdd: [this.currentUser.username],
          activeApprovalsToRemove: [],
          ownerApprovalsToAdd: [],
          ownerApprovalsToRemove: [],
          keyApprovalsToAdd: [],
          keyApprovalsToRemove: [],
          extensions: []
        })
          .then(() => {
            this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
            this.$store.dispatch('auth/loadGroups');
            this.$store.dispatch('userDetails/loadGroups', { username: this.currentUser.username });
            this.$notifier.showSuccess(this.$t('userDetailRouting.sidebar.inviteApprSucc'));
          }, (err) => {
            this.$notifier.showError(this.$t('userDetailRouting.sidebar.inviteApprFail'));
            console.error(err);
          })
          .finally(() => {
            this.closeInviteDetailsDialog();
          });
      },

      rejectInvite() {
        const invite = this.inviteDetailsDialog.item;
        const proposalId = invite._id;
        this.inviteDetailsDialog.proccess = true;

        proposalsService.deleteProposal({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          externalId: proposalId,
          account: this.$currentUser.username,
          authority: 2, // active auth
          extensions: []
        })
          .then(() => {
            this.$store.dispatch('userDetails/loadUserInvites', { username: this.currentUser.username });
            this.$notifier.showSuccess(this.$t('userDetailRouting.sidebar.inviteRejSucc'));
          }, (err) => {
            this.$notifier.showError(this.$t('userDetailRouting.sidebar.inviteRejFail'));
            console.error(err);
          })
          .finally(() => {
            this.closeInviteDetailsDialog();
          });
      },

      clearLocalStorageItems() {
        bankCardsService.removeInvestorBankCard(this.currentUser.username);
      },

      denyReviewRequest(reviewRequestId) {
        return this.$store.dispatch('userDetails/denyReviewRequest', { reviewRequestId });
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
</style>
