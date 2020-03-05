<template>
  <v-card class="pa-4 full-height">
    <v-layout column>
      <div v-if="isJoinRequestsSectionAvailable" class="">
        <div class="title font-weight-bold pb-2" id="invites">Join requests: {{pendingJoinRequests.length}}</div>

        <v-layout
          column
          class="py-2"
          v-for="(join, index) in pendingJoinRequests"
          :key="'join-request-' + index">

          <v-layout column align-baseline>
            <platform-avatar :user="join.user" link-to-profile :size="40"></platform-avatar>
            <div class="py-2 caption font-weight-medium">
              wants to join your group
            </div>
            <div class="text-xs-right full-width">
              <v-btn small class="mx-0 py-0 my-2" color="primary" dark outline @click="openJoinRequestDetails(join)">
                View
              </v-btn>
            </div>
          </v-layout>
          <v-divider class="ma-2" v-if="index !== pendingJoinRequests.length - 1" />
        </v-layout>
      </div>

      <handle-join-request-dialog
        v-if="selectedJoinRequest"
        :is-open="options.isHandleRequestDialogOpen"
        :join-request="selectedJoinRequest"
        :group-id="group.id"
        @onClose="closeHandleJoinRequestDialog"
      ></handle-join-request-dialog>


      <!-- ### START Research Group Details Section ### -->
      <div class="py-4">
        <div class="title font-weight-bold">Group expertise tokens</div>

        <div class="pt-3">
          <div v-for="(item, i) in groupExpertise" :key="i">
            <span class="font-weight-medium">{{ item.disciplineName }}</span>
            <span class="right">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-fullwidth">
        <v-divider></v-divider>
      </div>

      <!-- ### END Research Group Details Section ### -->

      <div v-if="isResearchGroupMember">
        <div class="py-4">
          <div class="title font-weight-bold">
            <router-link
              class="a"
              :to="{
                            name: 'ResearchGroupWallet',
                            params: { research_group_permlink: this.group.permlink }
                        }"
            >Group Wallet
            </router-link>
          </div>

          <div class="py-4">
            <!-- <div class="legacy-row-nowrap legacy-align-items-center c-pb-4">
                <div style="height: 30px; width: 30px;">
                    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="20" fill="black"/>
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.91431 0H6.15204V1.9375H7.271V0H9.50873V2.01611C10.6616 2.15356 11.725 2.47119 12.6993 2.96875C14.0454 3.64844 15.0944 4.61328 15.8462 5.86328C16.6067 7.10547 16.9913 8.5 17 10.0469V10.832C17 12.3945 16.6285 13.7969 15.8855 15.0391C15.1512 16.2734 14.111 17.2422 12.7648 17.9453C11.767 18.4641 10.6817 18.7915 9.50873 18.9275V21H7.271V19H6.15204V21H3.91431V19H0V1.9375H3.91431V0ZM4 5.11328V15.8359H8.2019C9.52185 15.8359 10.5358 15.418 11.2439 14.582C11.9519 13.7383 12.306 12.4883 12.306 10.832V10.0938C12.306 8.44531 11.9519 7.20312 11.2439 6.36719C10.5358 5.53125 9.50439 5.11328 8.14948 5.11328H4Z" transform="translate(13 9)" fill="#F0F1F4"/>
                    </svg>
                </div>

                <div class="c-pl-4 font-weight-medium">DEIP Tokens</div>
                <div class="legacy-col-grow text-align-right">{{ deipTokenBalance }}</div>
            </div> -->

            <v-btn class="ma-0"
                   color="primary" block
                   @click="$store.dispatch('researchGroup/changeOptions', { key: 'isTransferTokensDialogOpen', value: true })"
            >Transfer
            </v-btn>
          </div>
        </div>

        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
      </div>

      <div v-if="!group.is_personal" class="">
        <div class="py-4">
          <quorum-size-sidebar-section></quorum-size-sidebar-section>
        </div>

        <div class="sidebar-fullwidth">
          <v-divider></v-divider>
        </div>
      </div>


      <transfer-group-deip-tokens-dialog
        :is-open="options.isTransferTokensDialogOpen"
        @onClose="$store.dispatch('researchGroup/changeOptions', { key: 'isTransferTokensDialogOpen', value: false })"
      ></transfer-group-deip-tokens-dialog>

    </v-layout>
  </v-card>

</template>

<script>
  import { mapGetters } from 'vuex';
  import _ from 'lodash';
  import deipRpc from '@deip/deip-oa-rpc-client';

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

      deipTokenBalance() {
        return this.fromAssetsToFloat(this.group.balance);
      },

      isResearchGroupMember() {
        return this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false
      },

      groupExpertise() {
        return _.chain(this.members)
          .map('expertise')
          .flatten()
          .groupBy('discipline_id')
          .mapValues(item => {
            return {
              value: item.reduce((acc, val) => acc + val.amount, 0),
              disciplineName: item[0].discipline_name
            }
          })
          .values()
          .value();
      },

      isJoinRequestsSectionAvailable() {
        let hasPendingJoinRequests = this.pendingJoinRequests && this.pendingJoinRequests.length;

        let isResearchGroupMember = this.group != null
          ? this.$store.getters['auth/userIsResearchGroupMember'](this.group.id)
          : false

        return hasPendingJoinRequests && isResearchGroupMember;
      }
    },

    methods: {
      openJoinRequestDetails(item) {
        this.$store.dispatch('researchGroup/changeOptions', { key: 'isHandleRequestDialogOpen', value: true });
        this.selectedJoinRequest = item;
      },
      closeHandleJoinRequestDialog() {
        this.$store.dispatch('researchGroup/changeOptions', { key: 'isHandleRequestDialogOpen', value: false });
        this.selectedJoinRequest = undefined;
      },
    }
  };
</script>

<style lang="less" scoped>
  .join-request-title-info {
    padding-left: 10px;
    padding-top: 3px;
  }
</style>
