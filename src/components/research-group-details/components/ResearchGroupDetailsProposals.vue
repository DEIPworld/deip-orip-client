<template>
  <d-block>
    <template #title>
      <div class="text-h5">
        {{ $t('researchGroupDetails.proposalsTable.title') }}
        <v-badge offset-y="-8" offset-x="4" :content="filteredProposals.length || '0'" />
      </div>
    </template>
    <v-data-table
      :hide-default-footer="filteredProposals.length < 50"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
      :items-per-page="50"
      :headers="proposalsHeader"
      :items="filteredProposals"
      disable-sort
      show-expand
      :expanded.sync="expanded"
    >
      <template #item.proposal="{ item }">
        <research-group-details-proposals-item-proposal :item="item" />
      </template>

      <template #item.fail_reason="{ item }">
        <d-simple-tooltip v-if="item.fail_reason">
          <v-chip outlined color="error">
            <div class="text-caption">
              {{ $t('researchGroupDetails.proposalsTable.failure') }}
            </div>
          </v-chip>
          <template #tooltip>
            <div>
              <div>
                {{ $t('researchGroupDetails.proposalsTable.next') }}
                {{ moment(item.expiration_time).format('MM/DD/YYYY HH:mm') }}
              </div>
              <div>
                {{ $t('researchGroupDetails.proposalsTable.reason') }} {{ item.fail_reason }}
              </div>
            </div>
          </template>
        </d-simple-tooltip>
        <d-simple-tooltip v-else>
          <v-chip outlined>
            <div class="text-caption">
              {{ $t('researchGroupDetails.proposalsTable.pending') }}
            </div>
          </v-chip>
          <template #tooltip>
            <div>
              <div v-if="item.voted_accounts.length">
                {{ $t('researchGroupDetails.proposalsTable.approved') }}
                {{ item.voted_accounts.join(', ') }}
              </div>
              <div v-else>
                {{ $t('researchGroupDetails.proposalsTable.noApproval') }}
              </div>
            </div>
          </template>
        </d-simple-tooltip>
      </template>

      <template #item.creation_time="{ item }">
        {{ item.creation_time | dateFormat('DD MMM YYYY', true) }}
      </template>

      <template #item.expiration_time="{ item }">
        {{ item.expiration_time | dateFormat('DD MMM YYYY', true) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon
          small
          :disabled="isApprovingLoadingId === item.external_id || isApproved(item)"
          :loading="isApprovingLoadingId === item.external_id"
          @click="approve(item)"
        >
          <v-icon>done</v-icon>
        </v-btn>
      </template>

      <template #expanded-item="{ item }">
        <td />
        <td :colspan="proposalsHeader.length - 1">
          <research-group-details-proposals-item-expand :item="item" />
        </td>
      </template>
    </v-data-table>
  </d-block>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import DSimpleTooltip from '@/components/Deipify/DSimpleTooltip/DSimpleTooltip';
  import _ from 'lodash';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { ProposalsService } from '@deip/proposals-service';
  import { PROPOSAL_TYPES, researchContentTypes } from '@/variables';
  import ResearchGroupDetailsProposalsItemExpand from '@/components/research-group-details/components/ResearchGroupDetailsProposalsItemPartials/ResearchGroupDetailsProposalsItemExpand';
  import ResearchGroupDetailsProposalsItemProposal from '@/components/research-group-details/components/ResearchGroupDetailsProposalsItemPartials/ResearchGroupDetailsProposalsItemProposal';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import * as disciplineTreeService from '../../common/disciplines/DisciplineTreeService';

  const researchGroupService = ResearchGroupService.getInstance();
  const proposalsService = ProposalsService.getInstance();

  export default {
    name: 'ResearchGroupDetailsProposals',
    components: {
      DSimpleTooltip,
      DBlock,
      ResearchGroupDetailsProposalsItemExpand,
      ResearchGroupDetailsProposalsItemProposal
    },
    props: {},
    data() {
      return {
        expanded: [],
        isApprovingLoadingId: false,
        PROPOSAL_TYPES,
        proposalsHeader: [
          {
            text: this.$t('researchGroupDetails.proposalsTable.header.status'),
            value: 'fail_reason',
            align: 'center'
          },
          {
            text: this.$t('researchGroupDetails.proposalsTable.header.proposal'),
            value: 'proposal'
          },
          {
            text: this.$t('researchGroupDetails.proposalsTable.header.created'),
            value: 'creator'
          },
          {
            text: this.$t('researchGroupDetails.proposalsTable.header.signatures'),
            value: 'voted_accounts.length',
            align: 'right'
          },
          {
            text: this.$t('researchGroupDetails.proposalsTable.header.data'),
            value: 'creation_time',
            align: 'right'
          },
          {
            text: this.$t('researchGroupDetails.proposalsTable.header.expData'),
            value: 'expiration_time',
            align: 'right'
          },
          {
            text: '',
            value: 'actions'
          },
          {
            text: '',
            value: 'data-table-expand',
            align: 'start elevetion-0'
          }
        ]
      };
    },
    computed: {
      ...mapGetters({
        proposals: 'researchGroup/proposals',
        filter: 'researchGroup/proposalListFilter',
        pendingInvites: 'researchGroup/invites',
        group: 'researchGroup/group',
        groupShares: 'researchGroup/groupShares',
        currentUser: 'auth/user'
      }),
      filteredProposals() {
        return this.proposals.filter((proposal) => {
          if (proposal.action === PROPOSAL_TYPES.INVITE_MEMBER) {
            return !this.pendingInvites.some((invite) => invite._id === proposal.external_id);
          }
          return true;
        });
      }
    },
    methods: {
      ...mapActions({
        changeProposal: 'researchGroup/changeProposal',
        updateProposalFilter: 'researchGroup/updateProposalFilter'
      }),
      isApproved(proposal) {
        return _.includes(
          proposal.voted_accounts,
          this.currentUser.username
        );
      },
      approve(proposal) {
        let promise;
        this.isApprovingLoadingId = proposal.external_id;

        if (proposal.action === PROPOSAL_TYPES.INVITE_MEMBER) {
          promise = researchGroupService.approveResearchGroupInvite(this.currentUser.privKey, {
            inviteId: proposal.external_id,
            account: this.currentUser.username
          })
            .then(() => {
              this.$store.dispatch('researchGroup/loadGroupInvites', {
                researchGroupExternalId: this.group.external_id
              });
            });
        } else {
          promise = proposalsService.updateProposal({ privKey: this.currentUser.privKey, username: this.currentUser.username }, {
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
          this.isApprovingLoadingId = '';
          const copy = _.cloneDeep(proposal);
          copy.voted_accounts.push(this.currentUser.username);
          this.changeProposal({ old: this.proposal, new: copy });
          if (proposal.action === PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP) {
            Promise.all([this.$store.dispatch('auth/loadGroups')])
              .then(() => {
                const { permlink } = this.$store.getters['auth/userGroups'].find((item) => item.external_id === this.group.external_id);
                this.$router.push({
                  name: 'ResearchGroupDetails',
                  params: {
                    research_group_permlink: encodeURIComponent(permlink)
                  }
                });
              });
          } else {
            this.$store.dispatch('researchGroup/loadResearchGroup', { permlink: this.group.permlink });
          }
          this.$notifier.showSuccess(this.$t('researchGroupDetails.proposalsTable.success'));
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
    }
  };
</script>

<style lang="less">
  .id-col {
    width: 60px;
  }

  .proposal-activity {
    flex: 1 0 0;
  }

  .date {
    width: 90px;
    text-align: center;
    flex-shrink: 0;
  }

  .created-by {
    padding-left: 20px;
    width: 200px;
    flex-shrink: 0;
  }

  .voted {
    width: 90px;
    text-align: center;
    flex-shrink: 0;
  }

  .status {
    width: 70px;
    text-align: left;
    flex-shrink: 0;
  }

  .action-col {
    width: 100px;
    display: flex;
    justify-content: center;
  }

</style>
