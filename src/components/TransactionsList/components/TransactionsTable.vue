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
            {{ transactionTypes['LICENSE'].icon }}
          </v-icon>{{ transactionTypes['LICENSE'].text }}
        </div>
      </template>
      <template #item.details="{ item }">
        <v-clamp autoresize :max-lines="2" class="mt-4">
          {{ item.details.title }} Details title
          <!-- ( {{ $$toAssetUnits(item.licencePlan.fee) }} ) -->
        </v-clamp>
        <v-row
          v-if="!isShowAccountsBlock(item)"
          no-gutters
          justify="space-between"
          class="mt-4 mb-6"
        >
          <v-col v-if="item.proposer.account.profile">
            <d-box-item
              :avatar="item.proposer.account.profile | avatarSrc(64, 64)"
              :size="32"
            >
              <v-clamp autoresize :max-lines="1">
                {{ item.proposer.account.name || $options.filters.fullname(item.proposer.account) }}
              </v-clamp>
            </d-box-item>
          </v-col>
          <v-col v-else class="d-flex align-center">
            <v-avatar :size="32">
              <v-img
                :src="item.proposer.account.external_id | researchGroupLogoSrc(64, 64)"
              />
            </v-avatar>
            <v-avatar
              v-for="(s, i) in item.proposer.signers"
              :key="`${i}-signer`"
              class="ml-n2"
              :size="32"
            >
              <v-img
                :src="s.signer.profile | avatarSrc(64,64)"
              />
            </v-avatar>
            <v-clamp
              class="ml-3"
              autoresize
              :max-lines="1"
            >
              {{ item.proposer.account.name || $options.filters.fullname(item.proposer.account) }}
            </v-clamp>
          </v-col>
          <v-col class="d-flex ml-2 align-center">
            <template v-for="(p, i) in item.parties">
              <v-avatar v-if="!p.isProposer" :key="`${i}-party`" :size="32">
                <v-img
                  :src="
                    p.account.profile ?
                      ($options.filters.avatarSrc(p.account.profile, 64, 64))
                      : ($options.filters.researchGroupLogoSrc(p.account.external_id, 64, 64))
                  "
                />
              </v-avatar>
              <v-clamp
                v-if="!p.isProposer"
                :key="`${i}-party-clamp`"
                class="ml-3"
                autoresize
                :max-lines="1"
              >
                {{ p.account.name || $options.filters.fullname(p.account) }}
              </v-clamp>
            </template>
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
        <div v-if="isShowActions(item)" class="d-flex mt-4">
          <v-btn
            outlined
            x-small
            color="primary"
            class="mr-4"
            :disabled="disableButtonsId === item.proposal.external_id"
            :loading="disableButtonsId === item.proposal.external_id"
            @click="approveExpressLicensingRequest(item)"
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
            @click="rejectExpressLicensingRequest(item)"
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
                  v-if="!signer.signer.external_id"
                  :key="`${i}-${j}-accounts`"
                  class="pa-0"
                  :class="{'mt-6': !item.expand.length}"
                >
                  <v-expansion-panel-header class="pa-0" hide-actions>
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
  import { chartGradient, switchColor } from '@/plugins/charts';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';
  import { ExpressLicensingService } from '@deip/express-licensing-service';
  import { assetsChore } from '@/mixins/chores';
  import { PROPOSAL_STATUS } from '@/variables';

  const expressLicensingService = ExpressLicensingService.getInstance();

  const transactionTypes = {
    LICENSE: {
      id: 1,
      icon: 'work',
      text: 'Licensing'
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
      // chipColors() {
      //   return chartGradient(Object.keys(transactionTypes).length + 1).map(
      //     (color) => ({
      //       bg: color,
      //       textColor: switchColor(color)
      //     })
      //   );
      // },
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
        for (const i in item.parties) {
          item.parties[i].signers.forEach((s) => {
            if(!s.signer.external_id && s.signer.account.name === this.$currentUserName) {
              show = false;
            }
          });
        }
        return show;
      },
      isShowAccountsBlock(item) {
        return this.expanded.find(
          ({ proposal }) => proposal.external_id === item.proposal.external_id
        );
      },
      showDetails(item) {
        const expandData = [];
        for (const i in item.parties) {
          item.parties[i].signers.forEach((s) => {
            if (!s.external_id) {
              expandData.push(s);
            }
          });
        }
        !item.expand.length
          ? item.expand = expandData.map((item, i) => i)
          : item.expand = [];
      },
      approveExpressLicensingRequest(request) {
        this.disableButtonsId = request.proposal.external_id;
        expressLicensingService
          .approveExpressLicensingRequest(
            {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            {
              requestId: request.proposal.external_id,
              approver: this.$currentUser.username
            }
          )
          .then(() => {
            this.$emit('updateData');
            this.$notifier.showSuccess('Approve successfully !');
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
      },

      rejectExpressLicensingRequest(request) {
        this.disableButtonsId = request.proposal.external_id;
        expressLicensingService
          .rejectExpressLicensingRequest(
            {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            {
              requestId: request.proposal.external_id,
              rejector: this.$currentUser.username
            }
          )
          .then(() => {
            this.$emit('updateData');
            this.$notifier.showSuccess('Approve successfully !');
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
