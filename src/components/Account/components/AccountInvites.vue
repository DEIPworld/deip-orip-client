<template>
  <div v-if="hasInvites">
    <div id="invites" class="text-h6 font-weight-medium">
      <v-badge
        color="warning"
        inline
        :content="$currentUser.invites.length"
      >
        {{ $t('userDetailRouting.sidebar.invites') }}
      </v-badge>
    </div>
    <v-divider class="my-2" />
    <v-carousel
      v-model="invitesSlider"
      hide-delimiters
      :show-arrows="false"
      light
      height="auto"
    >
      <v-carousel-item
        v-for="(invite, index) in $currentUser.invites"
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
          v-if="$currentUser.invites.length > 1"
          class="mr-4"
          @click="prevSlide('invitesSlider', invites)"
        >
          navigate_before
        </v-icon>
        <v-icon
          v-if="$currentUser.invites.length > 1"
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
        @click="openInviteDetailsDialog($currentUser.invites[invitesSlider])"
      >
        {{ $t('userDetailRouting.sidebar.viewBtn') }}
      </v-btn>
    </div>

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
  </div>
</template>

<script>
  import { ProposalsService } from '@deip/proposals-service';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  const proposalsService = ProposalsService.getInstance();

  export default {
    name: 'UserDetailsSidebar',

    components: {
      DBoxItem
    },

    data() {
      return {
        invitesSlider: 0,
        inviteDetailsDialog: {
          isShown: false,
          item: null,
          groupName: '',
          proccess: false
        }
      };
    },

    computed: {
      hasInvites() {
        return this.$currentUser.invites.length;
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

        proposalsService.acceptProposal({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          proposalId: proposalId,
          account: this.$currentUser.username
        })
          .then(() => {
            this.$store.dispatch('Invites/fetch', this.$currentUser.username);
            this.$store.dispatch('Users/get', this.$currentUser);
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

        proposalsService.declineProposal({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          proposalId: proposalId,
          account: this.$currentUser.username
        })
          .then(() => {
            this.$store.dispatch('Invites/fetch', this.$currentUser.username, { root: true });
            this.$notifier.showSuccess(this.$t('userDetailRouting.sidebar.inviteRejSucc'));
          }, (err) => {
            this.$notifier.showError(this.$t('userDetailRouting.sidebar.inviteRejFail'));
            console.error(err);
          })
          .finally(() => {
            this.closeInviteDetailsDialog();
          });
      }
    }
  };
</script>
