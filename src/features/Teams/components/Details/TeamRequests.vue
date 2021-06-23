<template>
  <v-sheet v-if="$ready && (team.invites.length || team.pendingJoinRequests.length)" width="410">
    <v-card outlined>
      <v-tabs
        v-model="invitesTabs"
        grow
        color="dark"
        light
        :hide-slider="!team.invites.length || !team.pendingJoinRequests.length"
      >
        <v-tab
          v-if="team.pendingJoinRequests.length"
          :class="{ 'v-ripple__container': !team.invites.length }"
          light
        >
          <div class="mr-auto d-flex">
            <span class="text-h6 text-none">
              {{ $t('researchGroupDetails.groupReqs.joinReqs') }}
            </span>
            <v-badge
              color="warning"
              inline
              :content="team.pendingJoinRequests.length"
            />
          </div>
        </v-tab>
        <v-tab
          v-if="team.invites.length"
          class="align-right"
          :class="{ 'v-ripple__container': !team.pendingJoinRequests.length }"
          dark
        >
          <div class="mr-auto d-flex">
            <span class="text-h6 text-none">
              {{ $t('researchGroupDetails.groupReqs.invites') }}
            </span>
            <v-badge
              color="warning"
              inline
              :content="team.invites.length"
            />
          </div>
        </v-tab>
      </v-tabs>
      <v-divider />

      <v-tabs-items v-model="invitesTabs">
        <v-tab-item v-if="team.pendingJoinRequests.length">
          <div class="py-4 px-6 d-flex align-center">
            <v-icon
              v-if="team.pendingJoinRequests.length > 1"
              @click="prevSlide('joinRequestsSlider', team.pendingJoinRequests)"
            >
              navigate_before
            </v-icon>
            <v-carousel
              v-model="joinRequestsSlider"
              hide-delimiters
              :show-arrows="false"
              light
              height="auto"
            >
              <v-carousel-item
                v-for="(join, index) in team.pendingJoinRequests"
                :key="'join-request-' + index"
              >
                <d-box-item
                  :avatar="join.user.profile | avatarSrc(80, 80, false)"
                  :size="40"
                >
                  <v-clamp
                    autoresize
                    :max-lines="1"
                    class="text-body-2 font-weight-medium"
                  >
                    {{ join.user | fullname }}
                  </v-clamp>
                  <div class="text-caption text--secondary">
                    {{ $t('researchGroupDetails.groupReqs.wantJoin') }}
                  </div>
                </d-box-item>
              </v-carousel-item>
            </v-carousel>
            <v-icon
              v-if="team.pendingJoinRequests.length > 1"
              @click="nextSlide('joinRequestsSlider', team.pendingJoinRequests)"
            >
              navigate_next
            </v-icon>
            <v-btn
              text
              small
              class="ml-1"
              color="primary"
              @click="openJoinRequestDetails(team.pendingJoinRequests[joinRequestsSlider])"
            >
              {{ $t('researchGroupDetails.groupReqs.view') }}
            </v-btn>
          </div>
        </v-tab-item>
        <v-tab-item v-if="team.invites.length">
          <div class="py-4 px-6 d-flex align-center">
            <v-btn
              v-if="team.invites.length > 1"
              small
              icon
              @click="prevSlide('invitesSlider', team.invites)"
            >
              <v-icon>
                navigate_before
              </v-icon>
            </v-btn>

            <v-carousel
              v-model="invitesSlider"
              hide-delimiters
              :show-arrows="false"
              light
              height="auto"
              class="mx-2"
            >
              <v-carousel-item
                v-for="(invite, index) in team.invites"
                :key="'invite-request-' + index"
              >
                <d-box-item
                  :avatar="invite.user.profile | avatarSrc(80, 80, false)"
                  :size="40"
                >
                  <v-clamp
                    autoresize
                    :max-lines="1"
                    class="text-body-2 font-weight-medium"
                  >
                    {{ invite.user | fullname }}
                  </v-clamp>
                  <v-clamp
                    :max-lines="1"
                    class="text-caption text--secondary"
                  >
                    {{ invite.user | employmentOrEducation }}
                  </v-clamp>
                </d-box-item>
              </v-carousel-item>
            </v-carousel>

            <v-btn
              v-if="team.invites.length > 1"
              small
              icon
              @click="nextSlide('invitesSlider', team.invites)"
            >
              <v-icon>
                navigate_next
              </v-icon>
            </v-btn>
            <v-btn
              text
              small
              class="ml-1"
              color="primary"
              :to="{ name: 'UserDetails', params: { account_name: team.invites[invitesSlider].user.account.name } }"
            >
              {{ $t('researchGroupDetails.groupReqs.view') }}
            </v-btn>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <vex-dialog
      v-if="selectedJoinRequest"
      v-model="isOpenDialog"
      :title="$t('researchGroupDetails.joinRequestDialog.join')"
      max-width="600px"
      :true-disabled="isApprovingDisabled || isApprovingLoading"
      :false-disabled="isDenyingLoading || isApprovingLoading"
      :button-false-text="$t('researchGroupDetails.joinRequestDialog.reject')"
      :button-true-text="$t('researchGroupDetails.joinRequestDialog.submitBtn')"
      :loading="isApprovingLoading || isDenyingLoading"
      @click:confirm="sendProposal"
      @click:cancel="denyJoinRequest"
    >
      <div>
        <platform-avatar
          :user="selectedJoinRequest.user"
          :size="80"
          link-to-profile
          link-to-profile-class="pl-6 title"
        />
      </div>
      <div class="py-6 text-subtitle-1 black--text">
        {{ selectedJoinRequest.coverLetter }}
      </div>

      <v-text-field
        v-model="tokensAmount"
        v-mask="'##'"
        :label="$t('researchGroupDetails.joinRequestDialog.tokensLabel')"
        outlined
        suffix="%"
      />
    </vex-dialog>
  </v-sheet>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  export default {
    name: 'TeamRequests',
    components: {
      DBoxItem
    },

    data() {
      return {
        invitesTabs: null,
        selectedJoinRequest: undefined,
        invitesSlider: 0,
        joinRequestsSlider: 0,
        isOpenDialog: false,
        tokensAmount: undefined,
        coverLetter: '',

        isApprovingLoading: false,
        isDenyingLoading: false
      };
    },
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      }),
      isApprovingDisabled() {
        return _.isEmpty(this.tokensAmount) || !_.isNumber(parseInt(this.tokensAmount));
      }
    },
    created() {
      Promise.all([
        this.$store.dispatch('Team/loadJoinRequests', this.team.externalId),
        this.$store.dispatch('Team/loadGroupInvites', this.team.externalId)
      ])
        .then(() => this.$setReady());
    },
    methods: {
      nextSlide(sliderCounterName, items) {
        this[sliderCounterName] === items.length - 1 ? this[sliderCounterName] = 0 : this[sliderCounterName]++;
      },
      prevSlide(sliderCounterName, items) {
        this[sliderCounterName] === 0 ? this[sliderCounterName] = items.length - 1 : this[sliderCounterName]--;
      },
      openJoinRequestDetails(item) {
        this.isOpenDialog = true;
        this.selectedJoinRequest = item;
      },
      closeHandleJoinRequestDialog() {
        this.isOpenDialog = false;
        this.selectedJoinRequest = undefined;
      },
      sendProposal() {
        const amount = parseInt(this.tokensAmount) * this.DEIP_1_PERCENT;
        this.isApprovingLoading = true;
        this.closeHandleJoinRequestDialog();
        this.isApprovingLoading = false;
        // researchGroupService.createInviteProposal({
        //   groupId: this.team.externalId,
        //   invitee: this.joinRequest.username,
        //   rgtAmount: amount,
        //   coverLetter: this.coverLetter,
        //   isHead: false
        // })
        //   .then(() => {
        //     this.$store.dispatch('Team/loadJoinRequests', this.team.externalId);
        //     this.$store.dispatch('TransactionsList/loadTransactions', this.team.externalId);
        //     this.$notifier.showSuccess(this.$t('researchGroupDetails.joinRequestDialog.successSend', { username: this.joinRequest.username }));
        //   }, (err) => {
        //     this.$notifier.showError(this.$t('researchGroupDetails.joinRequestDialog.errSend'));
        //     console.error(err);
        //   })
        //   .finally(() => {
        //     this.isApprovingLoading = false;
        //     this.closeHandleJoinRequestDialog();
        //   });
      },

      denyJoinRequest() {
        const self = this;
        const update = {
          ...self.joinRequest,
          status: 'denied'
        };
        self.isDenyingLoading = true;
        setTimeout(() => self.closeHandleJoinRequestDialog(), 500);
        self.isDenyingLoading = false;

        // researchGroupService.updateJoinRequest({ request: update })
        //   .then((updatedRequest) => {
        //           self.$store.dispatch('Team/loadJoinRequests', this.team.externalId);
        //           this.$notifier.showSuccess(this.$t('researchGroupDetails.joinRequestDialog.successDeny', { username: self.joinRequest.username }));

        //           setTimeout(() => self.closeHandleJoinRequestDialog(), 500);
        //         },
        //         (err) => {
        //           this.$notifier.showError();
        //           console.error(err);
        //         })
        //   .finally(() => {
        //     self.isDenyingLoading = false;
        //   });
      }
    }
  };
</script>
