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
      class="black--text"
      sort-desc
      :hide-default-footer="dataTable.length < 50"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="50"
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
          {{ item.extendedDetails.research.title }}
          ( {{ $$toAssetUnits(item.details.licencePlan.fee) }} )
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
        <v-row
          v-if="!isShowAccountsBlock(item)"
          no-gutters
          justify="space-between"
          class="mt-4 mb-6"
        >
          <v-col v-if="item.proposerSigners.account.profile">
            <d-box-item
              :avatar="item.proposerSigners.account.profile | avatarSrc(64, 64)"
              :size="32"
            >
              <v-clamp autoresize :max-lines="1">
                {{ item.proposerSigners.account | fullname }}
              </v-clamp>
            </d-box-item>
          </v-col>
          <v-col v-else class="d-flex align-center">
            <v-avatar :size="32">
              <v-img
                :src="item.proposerSigners.account.external_id | researchGroupLogoSrc(64, 64)"
              />
            </v-avatar>
            <template v-for="(s, i) in item.proposerSigners.signers">
              <v-avatar
                v-if="s.signer.profile"
                :key="`${i}-signer`"
                class="ml-n2"
                :size="32"
              >
                <v-img
                  :src="s.signer.profile | avatarSrc(64,64)"
                />
              </v-avatar>
            </template>
            <v-clamp
              class="ml-3"
              autoresize
              :max-lines="1"
            >
              {{ item.proposerSigners.account.name
                || $options.filters.fullname(item.proposerSigners.account) }}
            </v-clamp>
          </v-col>
          <v-col class="d-flex ml-4 align-center">
            <template v-for="(s, i) in item.signers.signers">
              <v-avatar :key="`${i}-party`" class="ml-n2" :size="32">
                <v-img
                  :src="
                    s.signer.profile ?
                      ($options.filters.avatarSrc(s.signer.profile, 64, 64))
                      : ($options.filters.researchGroupLogoSrc(
                        s.signer.external_id, 64, 64
                      ))
                  "
                />
              </v-avatar>
            </template>
            <v-clamp
              class="ml-3"
              autoresize
              :max-lines="1"
            >
              {{ item.signers.text }}
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
        <div v-if="isShowActions(item) && item.type" class="d-flex mt-4">
          <v-btn
            outlined
            x-small
            color="primary"
            class="mr-4"
            :disabled="disableButtonsId === item.proposal.external_id"
            :loading="disableButtonsId === item.proposal.external_id"
            @click="signTrc(item)"
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
            @click="signTrc(item, true)"
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
        <td class="pa-4 text--secondary">
          <div class="mb-6">
            <div>
              <span class="font-weight-medium"> Receipt: </span>
              {{ item.proposal.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
            </div>
            <div>
              <span class="font-weight-medium"> Expiration: </span>
              {{ item.proposal.expiration_time | dateFormat('DD MMM YYYY, HH:mm', true) }}
            </div>
          </div>
          <div class="mb-4 font-weight-medium">
            Signees:
          </div>
          <v-expansion-panels
            flat
            multiple
            readonly
            :value="item.expand"
            :class="{'mt-n6': !item.expand.length}"
          >
            <template v-for="(party, i) in item.parties">
              <template v-for="(signer, j) in party.signers">
                <v-expansion-panel
                  v-if="!signer.signer.external_id
                    || signer.signer.external_id && party.signers.length === 1"
                  :key="`${i}-${j}-accounts`"
                  class="pa-0"
                  :class="{'mt-6': !item.expand.length}"
                >
                  <v-expansion-panel-header class="pa-0" hide-actions>
                    <div class="d-flex">
                      <v-avatar
                        v-if="!signer.signer.external_id && party.account.external_id"
                        class="mr-n2"
                        :size="40"
                      >
                        <v-img :src="party.account.external_id | researchGroupLogoSrc(80,80)" />
                      </v-avatar>
                      <d-box-item
                        :avatar="
                          signer.signer.profile
                            ? $options.filters.avatarSrc(
                              signer.signer.profile,
                              80,
                              80,
                              false
                            )
                            : $options.filters.researchGroupLogoSrc(
                              signer.signer.external_id,
                              80,
                              80
                            )
                        "
                        :size="40"
                        style="max-width: 400px"
                      >
                        <router-link
                          tag="div"
                          :to="
                            signer.signer.profile
                              ? {
                                name: 'UserDetails',
                                params: { account_name: signer.signer.account.name },
                              }
                              : {
                                name: 'ResearchGroupDetails',
                                params: {
                                  research_group_permlink: encodeURIComponent(
                                    signer.signer.permlink
                                  ),
                                },
                              }
                          "
                          class="text-caption text-decoration-none"
                        >
                          <v-clamp autoresize :max-lines="1" class="text-h6">
                            {{
                              signer.signer.profile
                                ? $options.filters.fullname(signer.signer)
                                : signer.signer.name
                            }}
                          </v-clamp>
                        </router-link>
                        <template #actionText>
                          <div style="width: 93px">
                            <div class="d-flex black--text text-body-2">
                              <v-icon
                                :color="statusChipData.color[party.status]"
                                size="14"
                                class="mr-1"
                              >
                                {{ statusChipData.icon[party.status] }}
                              </v-icon>
                              {{ statusChipData.text[party.status] }}
                            </div>
                          </div>
                        </template>
                      </d-box-item>
                    </div>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="pa-0">
                    <div
                      class="text--secondary text-caption ml-7"
                    >
                      <div>
                        <span class="font-weight-medium">
                          Transaction ID:
                        </span>
                        <span>{{ signer.txInfo.trx_id || '—' }}</span>
                      </div>
                      <div>
                        <span class="font-weight-medium"> Block: </span>
                        <span>{{
                          signer.txInfo.block_num || '—'
                        }}</span>
                      </div>
                      <div>
                        <span class="font-weight-medium"> Timestamp: </span>
                        {{
                          signer.txInfo.timestamp
                            ? $options.filters.dateFormat(
                              signer.txInfo.timestamp,
                              'DD MMM YYYY, HH:mm',
                              true
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
      icon: 'business_center',
      text: 'Investment'
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

  const txStatus = {
    approved: 'approved',
    pending: 'pending',
    rejected: 'rejected'
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
        txStatus,
        PROPOSAL_STATUS,
        LOC_PROPOSAL_TYPES,
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
            align: 'center vertical-top',
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
      },
      isCurrentUserSigned() {
        return this.pendingRequests.approvers.includes(
          (item) => item === this.$currentUser.username
        );
      }
    },

    created() {
      console.log(this.dataTable);
    },

    methods: {
      isShowActions(item) {
        let show = true;
        Object.keys(item.parties).forEach((i) => {
          item.parties[i].signers.forEach((s) => {
            if (!s.signer.external_id && s.signer.account.name === this.$currentUserName) {
              show = false;
            }
          });
        });
        return show;
      },
      isShowAccountsBlock(item) {
        return this.expanded.find(
          ({ proposal }) => proposal.external_id === item.proposal.external_id
        );
      },
      showDetails(item) {
        const expandData = [];
        Object.keys(item.parties).forEach((i) => {
          item.parties[i].signers.forEach((s) => {
            if (!s.external_id) {
              expandData.push(s);
            }
          });
        });
        !item.expand.length
          ? item.expand = expandData.map((item, i) => i)
          : item.expand = [];
      },

      signTrc(trc, reject = false) {
        let promise;
        const defaultUserData = {
          privKey: this.$currentUser.privKey,
          username: this.$currentUserName
        };
        const defaultPromiseData = {
          proposalId: trc.proposal.external_id,
          [reject ? 'rejector' : 'approver']: this.$currentUserName,
          authority: 2
        };
        this.disableButtonsId = trc.proposal.external_id;
        if (trc.type === LOC_PROPOSAL_TYPES.INVITE_MEMBER) {
          // promise = researchGroupService[reject
          //   ? 'rejectResearchGroupInviteViaOffChain' : 'approveResearchGroupInviteViaOffChain'](
          //   this.currentUser.privKey, {
          //     inviteId: trc.external_id,
          //     account: this.currentUser.username
          //   }
          // )
          //   .then(() => {
          //     this.$store.dispatch('researchGroup/loadGroupInvites', {
          //       researchGroupExternalId: this.group.external_id
          //     });
          //   });
        } else if (trc.type === LOC_PROPOSAL_TYPES.TRANSFER_ASSET) {
          promise = assetsService[reject ? 'rejectAssetsTransferProposal' : 'approveAssetsTransferProposal'](
            defaultUserData,
            defaultPromiseData
          );
        } else if (trc.type === LOC_PROPOSAL_TYPES.ASSET_EXCHANGE_REQUEST) {
          promise = assetsService[reject ? 'rejectAssetsExchangeProposal' : 'approveAssetsExchangeProposal'](
            defaultUserData,
            {
              proposalId: trc.proposal.external_id,
              [reject ? 'rejector' : 'approver']: trc.details.party2,
              authority: 2
            }
          );
        } else if (trc.type === LOC_PROPOSAL_TYPES.EXPRESS_LICENSE_REQUEST) {
          promise = expressLicensingService[reject ? 'rejectExpressLicensingRequest' : 'approveExpressLicensingRequest'](
            defaultUserData,
            {
              requestId: trc.proposal.external_id,
              [reject ? 'rejector' : 'approver']: this.$currentUser.username
            }
          );
        } else {
          promise = reject
            ? proposalsService.deleteProposal(this.$currentUser.privKey, {
              externalId: trc.proposal.external_id,
              account: this.$currentUserName,
              authority: 2,
              extensions: []
            }, true)
            : proposalsService.updateProposal(this.$currentUser.privKey, {
              externalId: trc.proposal.external_id,
              activeApprovalsToAdd: [this.$currentUserName],
              activeApprovalsToRemove: [],
              ownerApprovalsToAdd: [],
              ownerApprovalsToRemove: [],
              keyApprovalsToAdd: [],
              keyApprovalsToRemove: [],
              extensions: []
            });
        }

        promise
          .then(() => {
            if (trc.type === LOC_PROPOSAL_TYPES.UPDATE_RESEARCH_GROUP) {
            // Promise.all([this.$store.dispatch('auth/loadGroups')])
            //   .then(() => {
              // const { permlink } = this.$store.getters['auth/userGroups'].find(
              //   (item) => item.external_id === this.group.external_id
              // );
            //     this.$router.push({
            //       name: 'ResearchGroupDetails',
            //       params: {
            //         research_group_permlink: encodeURIComponent(permlink)
            //       }
            //     });
            //   });
            } else {
              // this.$store.dispatch(
              //   'researchGroup/loadResearchGroup', { permlink: this.group.permlink }
              // );
            }
            this.$emit('update-data');
            this.$notifier.showSuccess(this.$t('researchGroupDetails.proposalsTable.success'));
          })
          .catch((err) => {
            console.error(err);
            this.$notifier.showError(
              'Oops! Something went wrong. Please try again later'
            );
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
