<template>
  <v-layout row wrap>
    <v-flex xl11 lg11 md11 sm11 xs11 offset-xl1-right offset-lg1-right offset-md1-right offset-sm1-right offset-xs1-right>
      <div class="title bold py-5">Access Requests</div>
      <div v-if="unlockRequests.length">
        <v-expansion-panel class="elevation-0" v-model="panelIndex">
          <v-expansion-panel-content v-for="(item, i) in unlockRequests" :key="`access-request-${i}`">
            <template slot="header">
              <div v-on:click.stop>
                <v-layout row  align-center v-if="i !== panelIndex">
                  <v-flex xs5>
                    <router-link
                      class="a bold"
                      :to="{
                        name: 'ResearchContentDetails',
                        params: {
                          research_group_permlink: encodeURIComponent(item.metadata.research.group_permlink),
                          research_permlink: encodeURIComponent(item.metadata.research.permlink),
                          content_permlink: encodeURIComponent(item.metadata.content.permlink)
                        }
                      }"
                    >{{item.metadata.content.title}}</router-link>
                  </v-flex>
                  <v-flex offset-xs1 xs5>
                    <platform-avatar 
                      :user="{ profile: item.metadata.userProfile, account: { name: item.metadata.userProfile._id} }"
                      :size="20"
                      link-to-profile
                      link-to-profile-class="px-1"
                    ></platform-avatar>
                  </v-flex>
                  <v-flex xs2>{{item.created_at | dateFormat('D MMM YYYY', true)}}</v-flex>
                </v-layout>
              </div>
            </template>
            <v-card>
              <v-card-text>
                <v-layout row align-center class="info-line my-4">
                  <v-flex xs3>Requested material</v-flex>
                  <v-flex xs9 class="pl-2">
                    <router-link
                      class="a bold"
                      :to="{
                        name: 'ResearchContentDetails',
                        params: {
                          research_group_permlink: encodeURIComponent(item.metadata.research.group_permlink),
                          research_permlink: encodeURIComponent(item.metadata.research.permlink),
                          content_permlink: encodeURIComponent(item.metadata.content.permlink)
                        }
                      }"
                    >{{item.metadata.content.title}}</router-link>
                  </v-flex>
                </v-layout>
                <v-layout row align-center class="info-line my-4">
                  <v-flex xs3>From the project</v-flex>
                  <v-flex xs9 class="pl-2">
                    <router-link
                      class="a bold"
                      :to="{
                        name: 'ResearchDetails',
                        params: {
                          research_group_permlink: encodeURIComponent(item.metadata.research.group_permlink),
                          research_permlink: encodeURIComponent(item.metadata.research.permlink),
                        }
                      }"
                    >{{item.metadata.research.title}}</router-link>
                  </v-flex>
                </v-layout>
                <v-layout row align-center class="info-line my-4">
                  <v-flex xs3>Requested by</v-flex>
                  <v-flex xs9 class="pl-2">
                    <platform-avatar 
                      :user="{ profile: item.metadata.userProfile, account: { name: item.metadata.userProfile._id} }"
                      :size="20"
                      link-to-profile
                      link-to-profile-class="px-1"
                    ><span class="primary--text bold">({{item.metadata.userAgency.name}})</span>
                    </platform-avatar>
                    <span class="ml-2">{{item.created_at | dateFormat('D MMM YYYY', true)}}</span>
                  </v-flex>
                </v-layout>
                <v-layout row align-center class="info-line my-4" v-if="isProjectManager">
                  <v-flex xs3>Approved by</v-flex>
                  <v-flex xs9 class="pl-2">
                    <platform-avatar 
                      :user="{ profile: item.metadata.piProfile, account: { name: item.metadata.piProfile._id} }"
                      :size="20"
                      link-to-profile
                      link-to-profile-class="px-1"
                    ><span class="primary--text bold">({{item.metadata.piAgency.name}})</span>
                    </platform-avatar>
                    <span class="ml-2">{{item.piApproval.date | dateFormat('D MMM YYYY', true)}}</span>
                  </v-flex>
                </v-layout>
                <v-layout row align-center wrap class="info-line my-4">
                  <v-flex xs3>Cover letter</v-flex>
                  <v-flex xs12 class="pt-4 black--text">{{item.coverLetter}}</v-flex>
                </v-layout>
                <v-layout row justify-end>
                  <v-btn small color="white" @click="onDenyClick(item)">
                    <v-icon>close</v-icon>
                  </v-btn>
                  <v-btn dark small color="green accent-4" @click="onApproveClick(item)">
                    <v-icon>lock_open</v-icon>
                  </v-btn>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </div>
      <div v-else>You don't have any access request yet.</div>
      <confirm-action-dialog
        :meta="accessActionDialog"
        :title="``"
        :text="accessActionDialog.text"
        @confirmed="accessActionDialog.onConfirmed"
        @canceled="accessActionDialog.isShown = false"
      ></confirm-action-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import contentAccessRequestsService from "@/services/http/contentAccessRequests";

export default {
  name: "AccessRequestsSectionGskDemo",
  props: {
  },

  computed: {
    ...mapGetters({
      user: "auth/user",
      tenant: "auth/tenant",
      isManager: 'auth/isManager',
      isResearcher: 'auth/isResearcher',
      isPrincipalInvestigator: 'auth/isPrincipalInvestigator',
      isProjectManager: 'auth/isProjectManager',
      unlockRequests: 'dashboard_gsk_demo/unlockRequests',
    })
  },

  methods: {
    onApproveClick(request) {
      this.accessActionDialog.text = 'Are you sure you want to approve this request?';
      this.accessActionDialog.isShown = true;
      this.accessActionDialog.isConfirming = false;
      this.accessActionDialog.onConfirmed = () => {
        this.accessActionDialog.isConfirming = true;
        return contentAccessRequestsService.approveResearchContentAccessRequest(request._id)
          .then(() => {
            this.accessActionDialog.isConfirming = false;
            this.accessActionDialog.isShown = false;
            this.$store.dispatch('dashboard_gsk_demo/loadUnlockRequests', {});
            this.$store.dispatch('dashboard_gsk_demo/loadActivityLogsEntries', { observingResearchGroupsIds: this.tenant.observingResearchGroupsIds });
            this.$store.dispatch('layout/setSuccess', { message: "Access request for research material was approved successfully" });
          })
          .catch((err) => {
            console.error(err);
          });
      };
    },

    onDenyClick(request) {
      this.accessActionDialog.text = 'Are you sure you want to deny this request?';
      this.accessActionDialog.isShown = true;
      this.accessActionDialog.isConfirming = false;
      this.accessActionDialog.onConfirmed = () => {
        this.accessActionDialog.isConfirming = true;
        return contentAccessRequestsService.denyResearchContentAccessRequest(request._id)
          .then(() => {
            this.accessActionDialog.isConfirming = false;
            this.accessActionDialog.isShown = false;
            this.$store.dispatch('dashboard_gsk_demo/loadUnlockRequests', {});
            this.$store.dispatch('dashboard_gsk_demo/loadActivityLogsEntries', { observingResearchGroupsIds: this.tenant.observingResearchGroupsIds });
            this.$store.dispatch('layout/setSuccess', { message: "Access request for research material was denied successfully" });
          })
          .catch((err) => {
            console.error(err);
          });
      };
    },
  },

  data() {
    return {
      accessActionDialog: {
        isShown: false,
        isConfirming: false,
        text: '',
        onConfirmed: () => {},
      },
      panelIndex: -1,
    }
  }
};
</script>

<style lang="less" scoped>
  .info-line {
    font-family: Roboto;
    font-size: 14px;
    line-height: 16px;
    color: #9E9E9E;
  }
</style>
