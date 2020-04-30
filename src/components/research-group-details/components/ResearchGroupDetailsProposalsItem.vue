<template>
  <div>
    <v-expansion-panel-header>
      <div class="display-flex align-center" @click.stop>
        <div class="id-col">
          <div class="font-weight-medium">
            {{ proposal.id }}
          </div>
        </div>
        <div class="proposal-activity">
          <!-- proposal title depending on type -->
          <div v-if="proposal.action === proposalTypes.START_RESEARCH" class="display-flex">
            <v-icon small color="primary" class="mr-2">
              add
            </v-icon>
            <div class="a">
              {{ proposal.data.title }}
            </div>
          </div>
          <div v-else-if="proposal.action === proposalTypes.INVITE_MEMBER" class="display-flex">
            <v-icon small color="primary" class="mr-2">
              person_add
            </v-icon>
            <div class="a">
              {{ proposal.data.name }}
            </div>
          </div>
          <div v-else-if="proposal.action === proposalTypes.EXCLUDE_MEMBER" class="display-flex">
            <v-icon small color="primary" class="mr-2">
              mdi-account-remove
            </v-icon>
            <div class="a">
              {{ proposal.data.name }}
            </div>
          </div>
          <div v-else-if="proposal.action === proposalTypes.SEND_FUNDS" class="display-flex">
            <v-icon small color="primary" class="mr-2">
              money_off
            </v-icon>
            <div class="a">
              Transfer tokens
            </div>
          </div>
          <div
            v-else-if="proposal.action === proposalTypes.START_RESEARCH_TOKEN_SALE"
            class="display-flex"
          >
            <v-icon small color="primary" class="mr-2">
              attach_money
            </v-icon>
            <div class="a">
              {{ convertToPercent(proposal.data.amount_for_sale) }}% fundraise
            </div>
          </div>
          <div v-else-if="proposal.action === proposalTypes.CHANGE_QUORUM" class="display-flex">
            <v-icon small color="primary" class="mr-2">
              mdi-percent
            </v-icon>
            <div class="a">
              Change of quorum
            </div>
          </div>
          <div
            v-else-if="proposal.action === proposalTypes.CHANGE_RESEARCH_GROUP_META_DATA_TYPE"
            class="display-flex"
          >
            <!-- <v-icon small color="primary" class="mr-2">mdi-percent</v-icon> -->
            <div class="a">
              Change Group meta
            </div>
          </div>
          <div
            v-else-if="proposal.action === proposalTypes.CHANGE_RESEARCH_META_DATA_TYPE"
            class="display-flex"
          >
            <!-- <v-icon small color="primary" class="mr-2">mdi-percent</v-icon> -->
            <div class="a">
              Change Research meta
            </div>
          </div>
          <div
            v-else-if="proposal.action === proposalTypes.CREATE_RESEARCH_MATERIAL"
            class="display-flex"
          >
            <v-icon small color="primary" class="mr-2">
              note_add
            </v-icon>
            <router-link
              class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(proposal.extension.research.group_permlink),
                  research_permlink: encodeURIComponent(proposal.extension.research.permlink)
                }
              }"
            >
              {{ proposal.extension.research.title }}
            </router-link>
          </div>
          <!-- proposal title depending on type -->
        </div>
        <div class="date">
          <div class="caption">
            {{ proposal.creation_time | dateFormat('D MMM YYYY', true) }}
          </div>
        </div>
        <div class="date">
          <div class="caption">
            {{ proposal.expiration_time | dateFormat('D MMM YYYY', true) }}
          </div>
        </div>
        <div class="created-by">
          <router-link
            :to="'/user-details/' + proposal.creator"
            class="a overflow-ellipsis"
          >
            {{ proposal.creator }}
          </router-link>
        </div>
        <div class="voted">
          <v-tooltip right>
            <template v-slot:activator="{ on }">
              <div
                v-on="on"
              >
                {{ approvedPercent }} of {{ convertToPercent(proposal.quorum_percent) }}%
              </div>
            </template>

            <span>
              Approved by
              <br>
              <b>{{ proposal.voted_accounts.join(', ') }}</b>
            </span>
          </v-tooltip>
        </div>
        <div class="action-col">
          <v-btn
            v-if="!proposal.is_completed"
            text
            small
            color="primary"
            class="ma-0"
            :disabled="isApprovingLoading || isApproved"
            :loading="isApprovingLoading"
            @click="approve()"
          >
            {{ !isApproved ? 'Approve' : 'Approved' }}
          </v-btn>
        </div>
      </div>
    </v-expansion-panel-header>

    <v-expansion-panel-content>
      <v-card flat>
        <v-card-text class="pa-0">
          <div class="description caption">
            <!-- proposal description depending on type -->
            <v-row v-if="proposal.action === proposalTypes.START_RESEARCH" no-gutters>
              <v-col cols="6">
                <div class="grey--text">
                  {{ proposal.creator }}
                </div>
                <div class="pt-2">
                  Reviewers' reward:
                  <span
                    class="font-weight-bold"
                  >{{ convertToPercent(proposal.data.review_share_in_percent) }}%</span>
                </div>
              </v-col>
              <v-col class="grey--text" cols="6" style="max-height: 70px">
                <v-row column>
                  <div v-for="(label, i) in getDisciplineNames()" :key="i">
                    {{ label }}
                  </div>
                </v-row>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === proposalTypes.INVITE_MEMBER" no-gutters>
              <v-col cols="6">
                Research group tokens:
                <span
                  class="font-weight-bold"
                >{{ convertToPercent(proposal.data.research_group_token_amount_in_percent) }}%</span>
              </v-col>
              <v-col
                class="grey--text break-word white-space-pre-line"
                cols="6"
              >
                {{ proposal.data.cover_letter }}
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === proposalTypes.SEND_FUNDS" no-gutters>
              <v-col cols="6">
                <div>
                  User:
                  <router-link
                    :to="{
                      name: 'UserDetails',
                      params: { account_name: proposal.data.recipient }
                    }"
                    class="a"
                  >
                    {{ proposal.extension.recipient | fullname }}
                  </router-link>
                </div>
                <div>
                  Amount:
                  <span class="font-weight-bold">{{ proposal.data.funds }}</span>
                </div>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === proposalTypes.START_RESEARCH_TOKEN_SALE" no-gutters>
              <v-col class="display-flex justify" cols="6">
                <div class="width-8">
                  <div>
                    Min:
                    <span
                      class="font-weight-bold float-right"
                    >{{ fromAssetsToFloat(proposal.data.soft_cap) }}</span>
                  </div>
                  <div>
                    Max:
                    <span
                      class="font-weight-bold float-right"
                    >{{ fromAssetsToFloat(proposal.data.hard_cap) }}</span>
                  </div>
                </div>
                <div class="width-11 mr-12">
                  <div>
                    Start Date:
                    <span
                      class="font-weight-bold float-right"
                    >{{ proposal.data.start_time | dateFormat('HH:mm DD MMM YYYY', true) }}</span>
                  </div>
                  <div>
                    End Date:
                    <span
                      class="font-weight-bold float-right"
                    >{{ proposal.data.end_time | dateFormat('HH:mm DD MMM YYYY', true) }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === proposalTypes.CHANGE_QUORUM" no-gutters>
              <v-col cols="6">
                <div>
                  Type:
                  <span
                    class="font-weight-bold"
                  >{{ proposalLabels[proposal.data.proposal_type] }}</span>
                </div>
                <div>
                  Proposed percent:
                  <span
                    class="font-weight-bold"
                  >{{ convertToPercent(proposal.data.quorum_percent) }}%</span>
                </div>
              </v-col>
            </v-row>

            <v-row
              v-else-if="proposal.action === proposalTypes.CHANGE_RESEARCH_GROUP_META_DATA_TYPE"
              no-gutters
            >
              <v-col cols="6">
                <div>
                  Type:
                  <span class="font-weight-bold">Change Group meta</span>
                </div>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === proposalTypes.CHANGE_RESEARCH_META_DATA_TYPE" no-gutters>
              <v-col cols="6">
                <div>
                  Type:
                  <span class="font-weight-bold">Change Research meta</span>
                </div>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === proposalTypes.CREATE_RESEARCH_MATERIAL" no-gutters>
              <v-col cols="6">
                <div class="grey--text">
                  {{ proposal.data.authors.join(' · ') }}
                </div>
                <span class="font-weight-bold">{{ getContentTypeStrById(proposal.data.type) }}:</span>
                <a
                  :href="getContentUrl(proposal)"
                  class="a"
                  target="_blank"
                >{{ proposal.data.title }}</a>
              </v-col>
            </v-row>
            <!-- proposal description depending on type -->
          </div>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </div>
</template>

<script>
// import deipRpc from '@deip/rpc-client';

  import { mapGetters, mapActions } from 'vuex';
  import _ from 'lodash';

  import { ResearchGroupService } from '@deip/research-group-service';
  import {
    proposalTypesLabels,
    PROPOSAL_TYPES,
    researchContentTypes
  } from '@/variables';
  import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService';

  const researchGroupService = ResearchGroupService.getInstance();

  export default {
    name: 'ResearchGroupDetailsProposalsItem',

    props: {
      proposal: { type: Object, required: true }
    },

    data() {
      return {
        proposalTypes: _.cloneDeep(PROPOSAL_TYPES),
        proposalLabels: _.cloneDeep(proposalTypesLabels),
        isApprovingLoading: false
      };
    },

    methods: {
      ...mapActions({
        changeProposal: 'researchGroup/changeProposal'
      }),
      approve() {
        this.isApprovingLoading = true;
        researchGroupService
          .approveProposal({
            groupId: this.group.id,
            requestId: this.proposal.id
          })
          .then(() => {
            this.isApprovingLoading = false;
            const copy = _.cloneDeep(this.proposal);
            copy.voted_accounts.push(this.currentUser.username);
            this.changeProposal({ old: this.proposal, new: copy });
            this.$store.dispatch('researchGroup/loadResearchGroup', {
              permlink: decodeURIComponent(this.group.permlink)
            });
          })
          .catch((err) => {
            alert(err.message);
          });
      },

      // for START_RESEARCH
      getDisciplineNames() {
        const nodes = disciplineTreeService.getNodesByIdList(
          this.proposal.data.disciplines
        );
        return nodes.map((node) => node.label);
      },

      // for CREATE_RESEARCH_MATERIAL
      getContentTypeStrById(id) {
        const contentType = _.find(researchContentTypes, (item) => item.id === id);
        return contentType.text;
      },
      getContentUrl(proposal) {
        return `/#/${encodeURIComponent(
          proposal.extension.research.group_permlink
        )}/research/${encodeURIComponent(
          proposal.extension.research.permlink
        )}/!draft?ref=${proposal.extension.draftContent._id}`;
      }
    },

    computed: {
      ...mapGetters({
        group: 'researchGroup/group',
        groupShares: 'researchGroup/groupShares',
        currentUser: 'auth/user'
      }),
      isApproved() {
        return _.includes(
          this.proposal.voted_accounts,
          this.currentUser.username
        );
      },
      approvedPercent() {
        return this.convertToPercent(
          this.proposal.voted_accounts.reduce((acc, accountName) => {
            const shares = _.find(this.groupShares, { owner: accountName });
            return shares ? acc + shares.amount : acc;
          }, 0)
        );
      }
    }
  };
</script>

<style lang="less" scoped>
.description {
  padding-left: 68px;
  padding-right: 8px;
}
</style>
