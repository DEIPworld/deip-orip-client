<template>
  <div>
    <v-expansion-panel-header>
      <div class="display-flex align-center" @click.stop>
        <div class="id-col">
          <div class="text-caption">
            {{ proposal.external_id | shortHash }}
          </div>
        </div>

        <div class="proposal-activity">
          <!-- proposal title depending on type -->
          <div v-if="proposal.action === PROPOSAL_TYPES.CREATE_RESEARCH" class="display-flex">
            <v-icon small color="primary" class="mx-2">
              note_add
            </v-icon>
            <div class="a">
              {{ proposal.payload.title }}
            </div>
          </div>
          <div v-else-if="proposal.action === PROPOSAL_TYPES.INVITE_MEMBER" class="display-flex">
            <v-icon small color="primary" class="mx-2">
              person_add
            </v-icon>
            <div class="text-body-2">
              <router-link
                class="a"
                :to="{ name: 'UserDetails', params: { account_name: proposal.extension.invitee.account.name } }"
              >
                {{ proposal.extension.invitee | fullname }}
              </router-link>
            </div>
          </div>
          <div v-else-if="proposal.action === PROPOSAL_TYPES.EXCLUDE_MEMBER" class="display-flex">
            <v-icon small color="primary" class="mx-2">
              mdi-account-remove
            </v-icon>
            <div class="text-body-2">
              <router-link
                class="a"
                :to="{ name: 'UserDetails', params: { account_name: proposal.extension.member.account.name } }"
              >
                {{ proposal.extension.member | fullname }}
              </router-link>
            </div>
          </div>
          <div v-else-if="proposal.action === PROPOSAL_TYPES.TRANSFER" class="display-flex">
            <v-icon small color="primary" class="mx-2">
              money_off
            </v-icon>
            <div class="a">
              Transfer tokens
            </div>
          </div>
          <div
            v-else-if="proposal.action === PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE"
            class="display-flex"
          >
            <v-icon small color="primary" class="mx-2">
              attach_money
            </v-icon>
            <div class="text-body-2">
              {{ proposal.payload.share }} fundraise
            </div>
          </div>

          <div
            v-else-if="proposal.action === PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP"
            class="display-flex"
          >
            <v-icon small color="primary" class="mx-2">
              settings_applications
            </v-icon>
            <div class="text-body-2">
              Update group meta
            </div>
          </div>
          <div
            v-else-if="proposal.action === PROPOSAL_TYPES.UPDATE_RESEARCH"
            class="display-flex"
          >
            <v-icon small color="primary" class="mx-2">
              edit_attributes
            </v-icon>
            <div class="text-body-2">
              Update research meta
            </div>
          </div>
          <div
            v-else-if="proposal.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL"
            class="display-flex"
          >
            <v-icon small color="primary" class="mx-2">
              post_add
            </v-icon>
            <router-link
              class="a"
              :to="{
                name: 'ResearchDetails',
                params: {
                  research_group_permlink: encodeURIComponent(proposal.extension.research.research_group.permlink),
                  research_permlink: encodeURIComponent(proposal.extension.research.permlink)
                }
              }"
            >
              {{ proposal.payload.title }}
            </router-link>
          </div>
          <!-- proposal title depending on type -->
        </div>

        <div class="date">
          <div class="text-caption">
            {{ proposal.creation_time | dateFormat('D MMM YYYY', true) }}
          </div>
        </div>
        <div class="date">
          <div class="text-caption">
            {{ proposal.expiration_time | dateFormat('D MMM YYYY', true) }}
          </div>
        </div>
        <div class="created-by">
          <a href="#" class="a overflow-ellipsis">
            {{ proposal.creator | shortHash }}
          </a>
        </div>
        <div class="status">
          <v-tooltip v-if="proposal.fail_reason" bottom>
            <template v-slot:activator="{ on }">
              <v-chip color="error" v-on="on">
                <div class="text-caption">
                  Failure
                </div>
              </v-chip>
            </template>
            <div>
              <div>Next attempt: {{ moment(proposal.expiration_time).format('MM/DD/YYYY HH:mm') }}</div>
              <div>Reason: {{ proposal.fail_reason }}</div>
            </div>
          </v-tooltip>

          <v-tooltip v-else bottom>
            <template v-slot:activator="{ on }">
              <v-chip v-on="on">
                <div class="text-caption">
                  Pending
                </div>
              </v-chip>
            </template>
            <div>
              <div v-if="proposal.voted_accounts.length">
                Approved by: {{ proposal.voted_accounts.join(', ') }}
              </div>
              <div v-else>
                No approvals yet
              </div>
            </div>
          </v-tooltip>
        </div>
        <div class="voted">
          <div>{{ proposal.voted_accounts.length }}</div>
        </div>
        <div class="action-col">
          <v-btn
            text
            small
            color="primary"
            class="ma-0"
            :disabled="isApprovingLoading || isApproved"
            :loading="isApprovingLoading"
            @click="approve(proposal)"
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
            <v-row v-if="proposal.action === PROPOSAL_TYPES.CREATE_RESEARCH" no-gutters>
              <v-col cols="6">
                <div class="grey--text">
                  {{ proposal.creator }}
                </div>
                <div class="pt-2">
                  Reviewers' reward:
                  <span class="font-weight-bold">{{ proposal.payload.review_share }}</span>
                </div>
              </v-col>
              <v-col class="grey--text" cols="6" style="max-height: 70px">
                <v-row>
                  <span v-for="(label, i) in getDisciplineNames()" :key="i" class="pr-1">{{ label }}</span>
                </v-row>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === PROPOSAL_TYPES.INVITE_MEMBER" no-gutters>
              <v-col cols="2">
                <platform-avatar
                  :user="proposal.extension.invitee"
                  :size="20"
                  link-to-profile
                  link-to-profile-class="px-1"
                />
              </v-col>
              <v-col
                class="text-left grey--text break-word white-space-pre-line"
                cols="10"
              >
                is being invited to the group
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === PROPOSAL_TYPES.EXCLUDE_MEMBER" no-gutters>
              <v-col cols="2">
                <platform-avatar
                  :user="proposal.extension.member"
                  :size="20"
                  link-to-profile
                  link-to-profile-class="px-1"
                />
              </v-col>
              <v-col
                class="text-left grey--text break-word white-space-pre-line"
                cols="10"
              >
                to left the group
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === PROPOSAL_TYPES.TRANSFER" no-gutters>
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

            <v-row v-else-if="proposal.action === PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE" no-gutters>
              <v-col class="display-flex justify" cols="4">
                <span class="font-weight-bold">Research:</span>
                <router-link
                  :to="{
                    name: 'ResearchDetails',
                    params: {
                      research_group_permlink: encodeURIComponent(proposal.extension.research.research_group.permlink),
                      research_permlink: encodeURIComponent(proposal.extension.research.permlink)
                    }
                  }"
                  class="a px-2"
                >
                  {{ proposal.extension.research.title }}
                </router-link>
              </v-col>
              <v-col class="display-flex justify" cols="8">
                <div class="mr-4">
                  <div>
                    Min:
                    <span class="px-4 font-weight-bold float-right">{{ proposal.payload.soft_cap }}</span>
                  </div>
                  <div>
                    Max:
                    <span class="px-4 font-weight-bold float-right">{{ proposal.payload.hard_cap }}</span>
                  </div>
                </div>
                <div class="">
                  <div>
                    Start Date:
                    <span class="px-4 font-weight-bold float-right">{{ proposal.payload.start_time | dateFormat('HH:mm DD MMM YYYY', true) }}</span>
                  </div>
                  <div>
                    End Date:
                    <span class="px-4 font-weight-bold float-right">{{ proposal.payload.end_time | dateFormat('HH:mm DD MMM YYYY', true) }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row
              v-else-if="proposal.action === PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP"
              no-gutters
            >
              <v-col cols="6">
                <div>
                  Type:
                  <span class="font-weight-bold">Update group meta</span>
                </div>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === PROPOSAL_TYPES.UPDATE_RESEARCH" no-gutters>
              <v-col cols="6">
                <div>
                  Type:
                  <span class="font-weight-bold">Update research meta</span>
                </div>
              </v-col>
            </v-row>

            <v-row v-else-if="proposal.action === PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL" no-gutters>
              <v-col cols="8">
                <div>
                  <span class="font-weight-bold">Authors:</span>
                  <span class="grey--text">
                    {{ proposal.payload.authors.join(' · ') }}
                  </span>
                </div>
                <div>
                  <span class="font-weight-bold">{{ getContentTypeStrById(proposal.payload.type) }}:</span>
                  <router-link
                    :to="{
                      name: 'ResearchContentDetails',
                      params: {
                        research_group_permlink: encodeURIComponent(proposal.extension.research.research_group.permlink),
                        research_permlink: encodeURIComponent(proposal.extension.research.permlink),
                        content_permlink: encodeURIComponent('!draft')
                      },
                      query: {
                        ref: proposal.payload.external_id
                      }
                    }"
                    class="a px-2"
                    target="_blank"
                  >
                    {{ proposal.payload.title }}
                  </router-link>

                  <span class="font-weight-bold">Research:</span>
                  <router-link
                    :to="{
                      name: 'ResearchDetails',
                      params: {
                        research_group_permlink: encodeURIComponent(proposal.extension.research.research_group.permlink),
                        research_permlink: encodeURIComponent(proposal.extension.research.permlink)
                      }
                    }"
                    class="a px-2"
                  >
                    {{ proposal.extension.research.title }}
                  </router-link>
                </div>
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
  import { mapGetters, mapActions } from 'vuex';
  import _ from 'lodash';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ProposalsService } from '@deip/proposals-service';
  import { PROPOSAL_TYPES, researchContentTypes } from '@/variables';
  import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService';

  const researchGroupService = ResearchGroupService.getInstance();
  const proposalsService = ProposalsService.getInstance();

  export default {
    name: 'ResearchGroupDetailsProposalsItem',

    props: {
      proposal: { type: Object, required: true }
    },

    data() {
      return {
        PROPOSAL_TYPES,
        isApprovingLoading: false
      };
    },

    methods: {
      ...mapActions({
        changeProposal: 'researchGroup/changeProposal',
      }),

      approve(proposal) {
        let promise;
        this.isApprovingLoading = true;

        if (proposal.action === PROPOSAL_TYPES.INVITE_MEMBER) {
          promise = researchGroupService.approveResearchGroupInviteViaOffChain(this.currentUser.privKey, {
            inviteId: proposal.external_id,
            account: this.currentUser.username
          })
          .then(() => {
            this.$store.dispatch('researchGroup/loadGroupInvites', {
              researchGroupExternalId: this.group.external_id
            });
          });

        } else {
          promise = proposalsService.updateProposal(this.currentUser.privKey, {
            externalId: proposal.external_id,
            activeApprovalsToAdd: [this.currentUser.username],
            activeApprovalsToRemove: [],
            ownerApprovalsToAdd: [],
            ownerApprovalsToRemove: [],
            keyApprovalsToAdd: [],
            keyApprovalsToRemove: [],
            extensions: []
          });
        }

          promise.then(() => {
            this.isApprovingLoading = false;
            const copy = _.cloneDeep(this.proposal);
            copy.voted_accounts.push(this.currentUser.username);
            this.changeProposal({ old: this.proposal, new: copy });
            this.$store.dispatch('researchGroup/loadResearchGroup', { permlink: this.group.permlink });
            this.$notifier.showSuccess('You have voted for the proposal successfully!')
          })
          .catch((err) => {
            alert(err.message);
          });
      },

      // for CREATE_RESEARCH
      getDisciplineNames() {
        const nodes = disciplineTreeService.getNodesByIdList(this.proposal.payload.disciplines);
        return nodes.map((node) => node.label);
      },

      // for CREATE_RESEARCH_MATERIAL
      getContentTypeStrById(id) {
        const type = researchContentTypes.find((type) => type.id == id);
        return type.text;
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
