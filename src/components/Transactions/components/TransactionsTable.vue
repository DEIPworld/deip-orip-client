<template>
  <div>
    <v-data-table
      v-custom="'expanded__row-border-0'"
      hide-default-header
      :headers="tableHeader"
      :items="dataTable"
      :expanded.sync="expanded"
      show-expand
      item-key="_id"
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
      <template #item.researchGroupExternalId="{ item }">
        <v-clamp autoresize :max-lines="2" class="mt-4">
          {{ item.extendedDetails.researchGroup.name }}
          ( {{ $$toAssetUnits(item.licencePlan.fee) }} )
        </v-clamp>
        <v-row
          v-if="!isShowAccountsBlock(item)"
          no-gutters
          justify="space-between"
          class="mt-4 mb-6"
        >
          <v-col>
            <d-box-item
              :avatar="
                item.extendedDetails.requester.profile | avatarSrc(64, 64, false)
              "
              :size="32"
            >
              <v-clamp autoresize :max-lines="1">
                {{ item.extendedDetails.requester | fullname }}
              </v-clamp>
            </d-box-item>
          </v-col>
          <v-col class="d-flex ml-2 align-center">
            <v-avatar v-if="item.status !== txStatus.pending" :size="32">
              <v-img
                :src="
                  item.extendedDetails.rejectors[1] ?
                    item.extendedDetails.rejectors[1].profile
                    : item.extendedDetails.approvers[2].profile
                    | avatarSrc(64, 64, false)
                "
              />
            </v-avatar>
            <v-avatar :size="32" class="mr-3" :class="{'ml-n2': item.status !== txStatus.pending}">
              <v-img
                :src="item.extendedDetails.researchGroup.external_id | researchGroupLogoSrc(64, 64)"
              />
            </v-avatar>
            <v-clamp autoresize :max-lines="1">
              {{
                item.extendedDetails.researchGroup.name
              }}
            </v-clamp>
          </v-col>
        </v-row>
      </template>
      <template #item.expirationDate="{ item }">
        <div class="white-space-nowrap mt-4">
          <div v-if="item.status === txStatus.pending">
            Expires in {{ item.expirationDate | timeLeft }}
          </div>
          <div v-else>
            {{ item.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
          </div>
        </div>
      </template>
      <template #item.actions="{ item }">
        <div v-if="!item.approvers.includes($currentUser.username)" class="d-flex mt-4">
          <v-btn
            outlined
            x-small
            color="primary"
            class="mr-4"
            :disabled="disableButtonsId === item._id"
            :loading="disableButtonsId === item._id"
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
            :disabled="disableButtonsId === item._id"
            :loading="disableButtonsId === item._id"
            @click="rejectExpressLicensingRequest(item)"
          >
            <v-icon left>
              clear
            </v-icon>
            Decline
          </v-btn>
        </div>
      </template>
      <template #item.status="{ item }">
        <div class="d-flex mt-4">
          <v-icon :color="statusChipData.color[item.status]" size="14" class="mr-1">
            {{ statusChipData.icon[item.status] }}
          </v-icon>
          {{ statusChipData.text[item.status] }}
        </div>
      </template>
      <template #expanded-item="{ item, headers }">
        <td />
        <td class="pa-4 text--secondary">
          <div class="mb-6">
            <div>
              <span class="font-weight-medium"> License type: </span>
              {{ item.licencePlan.name }}
            </div>
            <div>
              <span class="font-weight-medium"> Receipt: </span>
              {{ item.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
            </div>
            <div>
              <span class="font-weight-medium"> Expiration: </span>
              {{ item.expirationDate | dateFormat('DD MMM YYYY, HH:mm', true) }}
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
            <template v-for="(accountData, i) in item.accountsData">
              <v-expansion-panel
                v-for="(account, j) in accountData.accounts"
                :key="`${i}-${j}-accounts`"
                class="pa-0"
                :class="{'mt-6': !item.expand.length}"
              >
                <v-expansion-panel-header class="pa-0" hide-actions>
                  <d-box-item
                    :avatar="
                      account.profile
                        ? $options.filters.avatarSrc(
                          account.profile,
                          80,
                          80,
                          false
                        )
                        : $options.filters.researchGroupLogoSrc(
                          account.external_id,
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
                        account.profile
                          ? {
                            name: 'UserDetails',
                            params: { account_name: account.account.name },
                          }
                          : {
                            name: 'ResearchGroupDetails',
                            params: {
                              research_group_permlink: encodeURIComponent(
                                account.permlink
                              ),
                            },
                          }
                      "
                      class="text-caption text-decoration-none"
                    >
                      <v-clamp autoresize :max-lines="1" class="text-h6">
                        {{
                          account.profile
                            ? $options.filters.fullname(account)
                            : account.name
                        }}
                      </v-clamp>
                    </router-link>
                    <template #actionText>
                      <div style="width: 93px">
                        <div class="d-flex black--text text-body-2">
                          <v-icon
                            :color="statusChipData.color[accountData.status]"
                            size="14"
                            class="mr-1"
                          >
                            {{ statusChipData.icon[accountData.status] }}
                          </v-icon>
                          {{ statusChipData.text[accountData.status] }}
                        </div>
                      </div>
                    </template>
                  </d-box-item>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="pa-0">
                  <template
                    v-for="(historyStatus, k) in item.chainHistoryDataTable"
                  >
                    <template v-for="(history, l) in historyStatus.historys">
                      <div
                        v-if="history.account.account.name === account.account.name"
                        :key="`${k}-${l}-history`"
                        class="text--secondary text-caption ml-7"
                      >
                        <div>
                          <span class="font-weight-medium">
                            Transaction ID:
                          </span>
                          <span>{{ history.id || '—' }}</span>
                        </div>
                        <div>
                          <span class="font-weight-medium"> Block: </span>
                          <span>{{
                            history.block_num || '—'
                          }}</span>
                        </div>
                        <div>
                          <span class="font-weight-medium"> Timestamp: </span>
                          {{
                            history.timestamp
                              ? $options.filters.dateFormat(
                                history.timestamp,
                                'DD MMM YYYY, HH:mm',
                                true
                              )
                              : '—'
                          }}
                        </div>
                      </div>
                    </template>
                  </template>
                </v-expansion-panel-content>
              </v-expansion-panel>
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
  import { ProposalsService } from '@deip/proposals-service';
  import { assetsChore } from '@/mixins/chores';

  const expressLicensingService = ExpressLicensingService.getInstance();
  const proposalsService = ProposalsService.getInstance();

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
    approved: 'success',
    pending: 'warning',
    rejected: 'error'
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
        disableButtonsId: '',
        txStatusChips: {
          [txStatus.approved]: this.$t('transactionsPage.signed'),
          [txStatus.pending]: this.$t('transactionsPage.pending'),
          [txStatus.rejected]: this.$t('transactionsPage.declined')
        },
        txStatusChipIcons: {
          [txStatus.approved]: 'check_circle',
          [txStatus.pending]: 'mdi-clock-time-three',
          [txStatus.rejected]: 'mdi-minus-circle'
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
            value: 'researchGroupExternalId',
            sortable: false,
            align: 'start vertical-top',
            width: '45%'
          },
          {
            text: 'Status',
            value: 'status',
            align: 'center vertical-top'
          },
          {
            text: 'Expiration date',
            value: 'expirationDate',
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

    methods: {
      isShowAccountsBlock(item) {
        return this.expanded.find((e) => e._id === item._id);
      },
      showDetails(item) {
        const expandData = item.accountsData.reduce((v, i) => {
          i.accounts.forEach((a) => v.push(a));
          return v;
        }, []);
        !item.expand.length
          ? item.expand = expandData.map((item, i) => i)
          : item.expand = [];
      },
      approveExpressLicensingRequest(request) {
        this.disableButtonsId = request._id;
        proposalsService.updateProposal({ privKey: this.$currentUser.privKey, username: this.$currentUser.username }, {
          externalId: request._id,
          activeApprovalsToAdd: [this.$currentUser.username],
          activeApprovalsToRemove: [],
          ownerApprovalsToAdd: [],
          ownerApprovalsToRemove: [],
          keyApprovalsToAdd: [],
          keyApprovalsToRemove: [],
          extensions: []
        })
          .then(() => {
            Promise.all([
              this.$store.dispatch('Transactions/loadApprovedRequests'),
              this.$store.dispatch('Transactions/loadPendingRequests')
            ]);
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
        this.disableButtonsId = request._id;
        proposalsService.deleteProposal({ privKey: this.$currentUser.privKey, username: this.$currentUser.username },
          {
            externalId: request._id,
            account: this.$currentUser.username,
            authority: 2, // active auth
            extensions: [],
          }
        )
          .then(() => {
            Promise.all([
              this.$store.dispatch('Transactions/loadApprovedRequests'),
              this.$store.dispatch('Transactions/loadPendingRequests')
            ]);
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
