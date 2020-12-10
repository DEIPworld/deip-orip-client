<template>
  <div>
    <v-data-table
      v-custom="'expanded__row-border-0'"
      hide-default-header
      :headers="tableHeader"
      :items="dataTable"
      :expanded.sync="expanded"
      show-expand
      item-key="proposal.external_id"
      sort-by="updated_at"
      class="text--primary"
      sort-desc
      :hide-default-footer="dataTable.length < 10 "
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="10"
    >
      <template #item.type="{ item }">
        <div class="d-flex mt-4">
          <v-icon size="20" left color="black">
            {{ transactionTypes[item.type].icon }}
          </v-icon>{{ transactionTypes[item.type].text }}
        </div>
      </template>
      <template #item.details="{ item }">
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.TRANSFER_ASSET === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ $$toAssetUnits($$fromAssetUnits(item.details.asset)) }} to
          {{ item.extendedDetails.party2.name ||
            $options.filters.fullname(item.extendedDetails.party2) }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.CREATE_RESEARCH === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ item.details.researchTitle }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.UPDATE_RESEARCH === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ item.extendedDetails.research.title }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ $$toAssetUnits(item.details.licencePlan.fee) }}, project:
          {{ item.extendedDetails.research.title }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.ASSET_EXCHANGE_REQUEST === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ $$toAssetUnits($$fromAssetUnits(item.details.asset1)) }} to
          {{ $$toAssetUnits($$fromAssetUnits(item.details.asset2)) }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.INVITE_MEMBER === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ item.extendedDetails.invitee | accountFullname }}
          invited to join
          {{ item.extendedDetails.researchGroup | accountFullname }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.EXCLUDE_MEMBER === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          Remove {{ item.extendedDetails.member | accountFullname }}
          from the
          {{ item.extendedDetails.researchGroup | accountFullname }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          {{ item.details.title }},
          project:
          {{ item.extendedDetails.research.title }}
        </v-clamp>
        <v-clamp
          v-if="LOC_PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE === item.type"
          autoresize
          :max-lines="2"
          class="mt-4"
        >
          Min:
          {{ $$toAssetUnits($$fromAssetUnits(item.extendedDetails.researchTokenSale.soft_cap)) }},
          max:
          {{ $$toAssetUnits($$fromAssetUnits(item.extendedDetails.researchTokenSale.hard_cap)) }},
          project:
          {{ item.extendedDetails.research.title }}
        </v-clamp>
        <v-row
          v-if="!isAccountsBlockVisible(item)"
          no-gutters
          justify="space-between"
          class="mt-4 mb-6"
        >
          <v-col class="d-flex align-center">
            <v-avatar :size="32">
              <v-img :src="item.header.proposerParty.account | accountAvatarSrc(64, 64)" />
            </v-avatar>
            <v-clamp
              class="ml-3"
              autoresize
              :max-lines="1"
            >
              {{ item.header.proposerParty.account | accountFullname }}
            </v-clamp>
          </v-col>

          <v-col class="d-flex ml-4 align-center">
            <template v-for="(party, i) in item.header.otherParties">
              <v-avatar
                v-if="i < maxSignersCountToDisplay"
                :key="`${i}-party`"
                :size="32"
                class="ml-n2"
              >
                <v-img :src="party.account | accountAvatarSrc(64, 64)" />
              </v-avatar>
            </template>
            <v-clamp
              class="ml-3"
              autoresize
              :max-lines="1"
            >
              {{ item.header.partiesSummary }}
            </v-clamp>
          </v-col>
        </v-row>
      </template>
      <template #item.proposal.expiration_time="{ item }">
        <div class="white-space-nowrap mt-4">
          <div v-if="item.proposal.status === PROPOSAL_STATUS.PENDING">
            Expires in {{ item.proposal.expiration_time | timeLeft }}
          </div>
          <div v-else>
            {{ item.proposal.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
          </div>
        </div>
      </template>
      <template #item.actions="{ item }">
        <div v-if="isActionsBlockVisible(item) && item.type" class="d-flex mt-4">
          <v-btn
            outlined
            x-small
            color="primary"
            class="mr-4"
            :disabled="disableButtonsId === item.proposal.external_id"
            :loading="disableButtonsId === item.proposal.external_id"
            @click="sign(item)"
          >
            <v-icon left>
              done
            </v-icon>
            Сonfirm
          </v-btn>
          <v-btn
            outlined
            x-small
            color="primary"
            :disabled="disableButtonsId === item.proposal.external_id"
            :loading="disableButtonsId === item.proposal.external_id"
            @click="reject(item)"
          >
            <v-icon left>
              clear
            </v-icon>
            Decline
          </v-btn>
        </div>
      </template>
      <template #item.proposal.status="{ item }">
        <div class="d-flex mt-4">
          <v-icon :color="statusChipData.color[item.proposal.status]" size="14" class="mr-1">
            {{ statusChipData.icon[item.proposal.status] }}
          </v-icon>
          {{ statusChipData.text[item.proposal.status] }}
        </div>
      </template>
      <template #expanded-item="{ item, headers }">
        <td />
        <td class="pa-4 text--secondary text-caption">
          <div class="mb-6">
            <div v-if="LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST === item.type">
              <span class="font-weight-medium"> License type: </span>
              {{ item.details.licencePlan.name }}
            </div>
            <div>
              <span class="font-weight-medium"> Receipt: </span>
              {{ item.proposal.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
            </div>
            <div>
              <span class="font-weight-medium"> Expiration: </span>
              {{ item.proposal.expiration_time | dateFormat('DD MMM YYYY, HH:mm', true) }}
            </div>
          </div>
          <div class="mb-6">
            <div class="mb-2 font-weight-medium">
              Required parties
            </div>
            <d-box-item
              v-for="(signer, i) in item.parties"
              :key="`${i}-otherPartiesSigner`"
              class="mb-4"
              :avatar="signer.account.external_id ?
                $options.filters.researchGroupLogoSrc(signer.account.external_id, 80, 80)
                : $options.filters.accountAvatarSrc(signer.account, 80, 80)
              "
              :size="40"
              style="max-width: 400px"
            >
              <router-link
                tag="div"
                class="text-decoration-none text--primary"
                :to="signer.account.external_id
                  ? {
                    name: 'ResearchGroupDetails',
                    params: { research_group_permlink: encodeURIComponent(signer.account.permlink) }
                  }
                  : { name: 'UserDetails', params: { account_name: signer.account.account.name } }"
              >
                <v-clamp autoresize :max-lines="1" class="text-h6">
                  {{ signer.account | accountFullname }}
                </v-clamp>
              </router-link>
              <template #actionText>
                <div style="width: 93px">
                  <div class="d-flex text--primary text-body-2">
                    <v-icon
                      :color="statusChipData.color[signer.status]"
                      size="14"
                      class="mr-1"
                    >
                      {{ statusChipData.icon[signer.status] }}
                    </v-icon>
                    {{ statusChipData.text[signer.status] }}
                  </div>
                </div>
              </template>
            </d-box-item>
          </div>
          <div>
            <div class="mb-2 font-weight-medium">
              Transaction signed by
            </div>
            <v-expansion-panels
              flat
              multiple
              readonly
              class="mb-n4"
              :value="item.expand"
            >
              <template v-for="(party, i) in item.parties">
                <template v-for="({ signer, txInfo }, j) in party.signers">
                  <v-expansion-panel
                    :key="`${i}-${j}-accounts`"
                    class="pa-0 mt-0 mb-4"
                  >
                    <div class="d-flex" :class="{ 'mb-2': item.expand.length }">
                      <v-avatar
                        v-if="!signer.is_research_group && party.account.account.is_research_group"
                        class="mr-n2"
                        :size="40"
                      >
                        <v-img :src="party.account | accountAvatarSrc(80, 80)" />
                      </v-avatar>
                      <d-box-item
                        :avatar="signer | accountAvatarSrc(80, 80)"
                        :size="40"
                      >
                        <router-link
                          tag="div"
                          class="text-decoration-none"
                          :to="signer.profile
                            ? { name: 'UserDetails', params: { account_name: signer.account.name } }
                            : {
                              name: 'ResearchGroupDetails',
                              params:
                                { research_group_permlink: encodeURIComponent(signer.permlink)}
                            }"
                        >
                          <v-clamp autoresize :max-lines="1" class="text-h6">
                            {{ signer | accountFullname }}
                          </v-clamp>
                        </router-link>
                      </d-box-item>
                    </div>
                    <v-expansion-panel-content class="pa-0 ml-7">
                      <div class="text--secondary text-caption">
                        <div>
                          <span class="font-weight-medium">
                            Transaction ID:
                          </span>
                          <span>{{ txInfo.trx_id || '—' }}</span>
                        </div>
                        <div>
                          <span class="font-weight-medium"> Block: </span>
                          <span>{{ txInfo.block_num || '—' }}</span>
                        </div>
                        <div>
                          <span class="font-weight-medium"> Timestamp: </span>
                          {{ txInfo.timestamp
                            ? $options.filters.dateFormat(
                              txInfo.timestamp, 'DD MMM YYYY, HH:mm', true
                            )
                            : '—'
                          }}
                        </div>
                      </div>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </template>
              </template>
            </v-expansion-panels>
          </div>
          <v-btn
            text
            color="primary"
            small
            class="text-caption font-weight-bold pa-0 mt-8"
            @click="showDetails(item)"
          >
            {{ !item.expand.length ? 'Show transactions details' : 'Hide transactions details' }}
          </v-btn>
        </td>
        <td :colspan="headers.length - 2" />
      </template>
    </v-data-table>
    <v-divider />
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { ExpressLicensingService } from '@deip/express-licensing-service';
  import { assetsChore } from '@/mixins/chores';
  import { PROPOSAL_STATUS, LOC_PROPOSAL_TYPES } from '@/variables';
  import { ProposalsService } from '@deip/proposals-service';
  import { ResearchGroupService } from '@deip/research-group-service';
  import { AssetsService } from '@deip/assets-service';

  const maxSignersCountToDisplay = 4;

  const assetsService = AssetsService.getInstance();
  const researchGroupService = ResearchGroupService.getInstance();
  const proposalsService = ProposalsService.getInstance();
  const expressLicensingService = ExpressLicensingService.getInstance();

  const transactionTypes = {
    [LOC_PROPOSAL_TYPES.CREATE_RESEARCH]: {
      icon: 'add_box',
      text: 'Create Project'
    },
    [LOC_PROPOSAL_TYPES.UPDATE_RESEARCH]: {
      icon: 'update',
      text: 'Project Update'
    },
    [LOC_PROPOSAL_TYPES.CREATE_RESEARCH_MATERIAL]: {
      icon: 'note_add',
      text: 'Content Upload'
    },
    [LOC_PROPOSAL_TYPES.CREATE_RESEARCH_TOKEN_SALE]: {
      icon: 'payments',
      text: 'Fundraising'
    },
    [LOC_PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP]: {
      icon: 'groups',
      text: 'Team update'
    },
    [LOC_PROPOSAL_TYPES.INVITE_MEMBER]: {
      icon: 'person_add',
      text: 'Invite Member'
    },
    [LOC_PROPOSAL_TYPES.EXCLUDE_MEMBER]: {
      icon: 'person_remove',
      text: 'Remove Member'
    },
    [LOC_PROPOSAL_TYPES.TRANSFER_ASSET]: {
      icon: 'mdi-arrow-right-circle',
      text: 'Transfer'
    },
    [LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST]: {
      icon: 'work',
      text: 'Licensing'
    },
    [LOC_PROPOSAL_TYPES.ASSET_EXCHANGE_REQUEST]: {
      icon: 'swap_horizontal_circle',
      text: 'Exchange'
    }
  };

  const chipColors = {
    [PROPOSAL_STATUS.APPROVED]: 'success',
    [PROPOSAL_STATUS.PENDING]: 'warning',
    [PROPOSAL_STATUS.REJECTED]: 'error',
    [PROPOSAL_STATUS.FAILED]: 'error',
    [PROPOSAL_STATUS.EXPIRED]: 'error'
  };

  export default {
    name: 'TransactionsTable',

    components: {
      DBoxItem
    },

    mixins: [assetsChore],

    props: {
      dataTable: {
        type: Array,
        default: () => []
      },
      haveActions: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        expanded: [],
        transactionTypes,
        PROPOSAL_STATUS,
        LOC_PROPOSAL_TYPES,
        maxSignersCountToDisplay,
        disableButtonsId: '',
        txStatusChips: {
          [PROPOSAL_STATUS.APPROVED]: this.$t('transactionsPage.signed'),
          [PROPOSAL_STATUS.PENDING]: this.$t('transactionsPage.pending'),
          [PROPOSAL_STATUS.REJECTED]: this.$t('transactionsPage.declined'),
          [PROPOSAL_STATUS.FAILED]: this.$t('transactionsPage.failed'),
          [PROPOSAL_STATUS.EXPIRED]: this.$t('transactionsPage.expired')
        },
        txStatusChipIcons: {
          [PROPOSAL_STATUS.APPROVED]: 'check_circle',
          [PROPOSAL_STATUS.PENDING]: 'mdi-clock-time-three',
          [PROPOSAL_STATUS.REJECTED]: 'mdi-minus-circle',
          [PROPOSAL_STATUS.FAILED]: 'cancel',
          [PROPOSAL_STATUS.EXPIRED]: 'mdi-minus-circle'
        }
      };
    },
    computed: {
      tableHeader() {
        const header = [
          {
            text: 'Type',
            value: 'type',
            align: 'left vertical-top',
            sortable: false
          },
          {
            text: 'Target',
            value: 'details',
            sortable: false,
            align: 'start vertical-top',
            width: '45%'
          },
          {
            text: 'Status',
            value: 'proposal.status',
            align: 'center vertical-top'
          },
          {
            text: 'Expiration date',
            value: 'proposal.expiration_time',
            align: 'center vertical-top',
            sortable: false
          },
          {
            text: '',
            value: 'data-table-expand',
            align: 'center'
          }
        ];
        if (this.haveActions) {
          header.splice(4, 0, {
            text: 'Actions',
            value: 'actions',
            align: 'center vertical-top'
          });
        }
        return header;
      },

      statusChipData() {
        return {
          color: chipColors,
          text: this.txStatusChips,
          icon: this.txStatusChipIcons
        };
      }
    },

    methods: {

      isActionsBlockVisible(item) {
        const { approvals, rejectors } = item.proposal;

        const hasApprovals = approvals.some(([name,]) => {
          return name == this.$currentUserName;
        });
        const hasRejections = rejectors.some(([name,]) => {
          return name == this.$currentUserName;
        });

        return !hasApprovals && !hasRejections;
      },

      isAccountsBlockVisible(item) {
        return this.expanded.some(({ proposal }) => proposal.external_id === item.proposal.external_id);
      },

      showDetails(item) {
        const { parties } = item;
        const signatures = Object.keys(parties).reduce((acc, key) => {
          const party = parties[key];
          const { account: { account: { is_research_group: isResearchGroup } } } = party;
          return [...acc, party];
        }, []);

        if (!item.expand.length) {
          item.expand = signatures.map((sig, i) => i);
        } else {
          item.expand = [];
        }
      },

      sign(proposal) {
        const { proposal: { external_id } } = proposal;
        this.disableButtonsId = external_id;
        proposalsService.updateProposal({ privKey: this.$currentUser.privKey, username: this.$currentUserName }, {
          externalId: external_id,
          activeApprovalsToAdd: [this.$currentUserName],
          activeApprovalsToRemove: [],
          ownerApprovalsToAdd: [],
          ownerApprovalsToRemove: [],
          keyApprovalsToAdd: [],
          keyApprovalsToRemove: [],
          extensions: []
      })
        .then(() => {
          this.$emit('update-data');
          this.$notifier.showSuccess(this.$t('researchGroupDetails.proposalsTable.success'));
        })
        .catch((err) => {
          console.error(err);
          this.$notifier.showError('Oops! Something went wrong. Please try again later');
        })
        .finally(() => {
          this.disableButtonsId = '';
        });
      },

      reject(proposal) {
        const { proposal: { external_id, required_approvals }, type } = proposal;
        this.disableButtonsId = external_id;
        proposalsService.deleteProposal({ privKey: this.$currentUser.privKey, username: this.$currentUserName }, {
          externalId: external_id,
          account: type == LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST
            ? required_approvals.some(ra => this.$currentUser.groups.some(rg => rg.account.name == ra))
                ? required_approvals.find(ra => this.$currentUser.groups.some(rg => rg.account.name == ra))
                : this.$currentUserName
            : this.$currentUserName,
          authority: 2, // active auth
          extensions: []
        })
          .then(() => {
            this.$emit('update-data');
            this.$notifier.showSuccess(this.$t('researchGroupDetails.proposalsTable.success'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError('Oops! Something went wrong. Please try again later');
          })
          .finally(() => {
            this.disableButtonsId = '';
          });
      }
    }
  };
</script>

<style scoped>
.v-expansion-panels .v-expansion-panel {
  background-color: transparent;
}
.expand-icon--active {
  transform: rotate(-180deg);
}
</style>
