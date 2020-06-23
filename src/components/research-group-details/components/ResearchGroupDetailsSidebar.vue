<template>
  <div>
    <div v-if="isJoinRequestsSectionAvailable" class="">
      <div id="invites" class="text-h6 font-weight-bold pb-2">
        Join requests: {{ pendingJoinRequests.length }}
      </div>

      <v-row
        v-for="(join, index) in pendingJoinRequests"
        :key="'join-request-' + index"
        class="py-2 flex-column"
        no-gutters
      >
        <v-row no-gutters class="flex-column">
          <platform-avatar :user="join.user" link-to-profile :size="40" />
          <div class="py-2 caption font-weight-medium">
            wants to join your group
          </div>
          <div class="text-right full-width">
            <v-btn
              :disabled="!defaultAssetBalance"
              small
              class="mx-0 py-0 my-2"
              color="primary"
              outlined
              @click="openJoinRequestDetails(join)"
            >
              View
            </v-btn>
          </div>
        </v-row>
        <v-divider v-if="index !== pendingJoinRequests.length - 1" class="ma-2" />
      </v-row>
    </div>

    <handle-join-request-dialog
      v-if="selectedJoinRequest"
      :is-open="options.isHandleRequestDialogOpen"
      :join-request="selectedJoinRequest"
      :group-id="group.id"
      @onClose="closeHandleJoinRequestDialog"
    />

    <!-- ### START Research Group Details Section ### -->
    <div class="py-6">
      <div class="text-h6 font-weight-bold">
        Group expertise tokens
      </div>

      <div class="pt-4">
        <div v-for="(item, i) in groupExpertise" :key="i">
          <span class="font-weight-medium">{{ item.disciplineName }}</span>
          <span class="float-right">{{ item.value }}</span>
        </div>
      </div>
    </div>
    <!-- ### END Research Group Details Section ### -->

    <div v-if="isResearchGroupMember">
      <div class="py-6">
        <div class="text-h6 font-weight-bold">
          <router-link
            class="a"
            :to="{
              name: 'ResearchGroupWallet',
              params: { research_group_permlink: group.permlink }
            }"
          >
            Group Wallet
          </router-link>
        </div>

        <div class="py-6">
          <v-btn
            class="ma-0"
            :disabled="!defaultAssetBalance"
            color="primary"
            block
            @click="$store.dispatch('researchGroup/changeOptions', { key: 'isTransferTokensDialogOpen', value: true })"
          >
            Transfer
          </v-btn>
        </div>
      </div>
    </div>

    <quorum-size-sidebar-section v-if="group.is_dao" />

    <transfer-group-deip-tokens-dialog
      :is-open="options.isTransferTokensDialogOpen"
      @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isTransferTokensDialogOpen', value: false })"
    />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';

  export default {
    name: 'ResearchGroupDetailsSidebar',
    data() {
      return {
        isApprovingJoinRequest: false,
        isDenyingJoinRequest: false,

        selectedJoinRequest: undefined,
        isHandleRequestDialogOpen: true
      };
    },

    computed: {
      ...mapGetters({
        user: 'auth/user',
        userPersonalGroup: 'auth/userPersonalGroup',
        group: 'researchGroup/group',
        members: 'researchGroup/members',
        options: 'researchGroup/options',
        pendingJoinRequests: 'researchGroup/pendingJoinRequests'
      }),

      defaultAssetBalance() {
        const amount = this.group.balances[this.$env.ASSET_UNIT];
        return amount;
      },

      isResearchGroupMember() {
        return this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false;
      },

      groupExpertise() {
        return _.chain(this.members)
          .map('expertise')
          .flatten()
          .groupBy('discipline_id')
          .mapValues((item) => ({
            value: item.reduce((acc, val) => acc + val.amount, 0),
            disciplineName: item[0].discipline_name
          }))
          .values()
          .value();
      },

      isJoinRequestsSectionAvailable() {
        const hasPendingJoinRequests = this.pendingJoinRequests && this.pendingJoinRequests.length;

        const isResearchGroupMember = this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false;

        return hasPendingJoinRequests && isResearchGroupMember;
      }
    },

    methods: {
      openJoinRequestDetails(item) {
        this.$store.dispatch('researchGroup/changeOptions', {
          key: 'isHandleRequestDialogOpen',
          value: true
        });
        this.selectedJoinRequest = item;
      },
      closeHandleJoinRequestDialog() {
        this.$store.dispatch('researchGroup/changeOptions', {
          key: 'isHandleRequestDialogOpen',
          value: false
        });
        this.selectedJoinRequest = undefined;
      }
    }
  };
</script>

<style lang="less" scoped>
  .join-request-title-info {
    padding-left: 10px;
    padding-top: 3px;
  }
</style>
