<template>
  <div>
    <v-data-table
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
        <div class="d-flex">
          <v-icon size="20" left color="black">
            {{ transactionTypes['LICENSE'].icon }}
          </v-icon>{{ transactionTypes['LICENSE'].text }}
        </div>
      </template>
      <template #item.requester="{ item }">
        <d-box-item
          :avatar="
            item.extendedDetails.requester.profile | avatarSrc(64, 64, false)
          "
          :size="24"
        >
          <v-clamp autoresize :max-lines="1">
            {{ item.extendedDetails.requester | fullname }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.researchGroupExternalId="{ item }">
        <v-clamp autoresize :max-lines="2">
          {{ item.extendedDetails.researchGroup.name }}
          ( {{ $$toAssetUnits(item.licencePlan.fee) }} )
        </v-clamp>
      </template>
      <template #item.expirationDate="{ item }">
        <div class="white-space-nowrap">
          <div v-if="item.status === txStatus.pending">
            Expires in {{ item.expirationDate | timeLeft }}
          </div>
          <div v-else>
            {{ item.created_at | dateFormat('DD MMM YYYY, hh:mm', true) }}
          </div>
        </div>
      </template>
      <template #item.actions="{ item }">
        <template v-if="!item.approvers.includes($currentUser.username)">
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
        </template>
      </template>
      <template #item.status="{ item }">
        <div class="d-flex">
          <v-icon :color="statusChipData.color[item.status]" size="13" class="mr-1">
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
              {{ item.created_at | dateFormat('DD MMM YYYY, hh:mm', true) }}
            </div>
            <div>
              <span class="font-weight-medium"> Expiration: </span>
              {{ item.expirationDate | dateFormat('DD MMM YYYY, hh:mm', true) }}
            </div>
          </div>
          <div class="mb-4">
            Signees:
          </div>
          <v-expansion-panels
            flat
            multiple
            readonly
            :value="item.expand"
          >
            <template v-for="(accountData, i) in item.accountsData">
              <v-expansion-panel
                v-for="(account, j) in accountData.accounts"
                :key="`${i}-${j}-accounts`"
                class="pa-0"
                :class="{'mb-8': !item.expand.length}"
              >
                <v-expansion-panel-header class="pa-0" hide-actions>
                  <d-box-item
                    :avatar="
                      account.profile
                        ? $options.filters.avatarSrc(
                          account.profile,
                          64,
                          64,
                          false
                        )
                        : $options.filters.researchGroupLogoSrc(
                          account.external_id,
                          64,
                          64
                        )
                    "
                    :size="40"
                    class="mb-3"
                    style="max-width: 300px"
                  >
                    <router-link
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
                      class="text--secondary text-caption text-decoration-none"
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
                            size="13"
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
                    v-for="(historyStatus, i) in item.chainHistoryDataTable"
                  >
                    <template v-for="(history, j) in historyStatus.historys">
                      <div
                        v-if="history.account.account.name === account.account.name || history.account.external_id === account.account.name"
                        :key="`${i}-${j}-history`"
                        class="mb-8 text--secondary text-caption"
                      >
                        <div>
                          <span class="font-weight-medium">
                            Transaction ID:
                          </span>
                          <span class="mr-2">{{ history.id || '—' }}</span>
                        </div>
                        <div>
                          <span class="font-weight-medium"> Block: </span>
                          <span class="mr-2">{{
                            history.block_num || '—'
                          }}</span>
                        </div>
                        <div>
                          <span class="font-weight-medium"> Timestamp: </span>
                          {{
                            history.timestamp
                              ? $options.filters.dateFormat(
                                history.timestamp,
                                'DD MMM YYYY, hh:mm',
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
            class="text-caption font-weight-bold"
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
    resolved: 'resolved'
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
            sortable: false
          },
          {
            text: 'Target',
            value: 'researchGroupExternalId',
            sortable: false,
            width: '45%'
          },
          {
            text: 'Status',
            value: 'status'
          },
          {
            text: 'Expiration date',
            value: 'expirationDate',
            align: 'center',
            sortable: false
          },
          {
            text: '',
            value: 'data-table-expand',
            align: 'start elevetion-0'
          }
        ];
        if (this.haveActions) {
          header.splice(4, 0, {
            text: 'Actions',
            value: 'actions'
          });
        }
        return header;
      },
      chipColors() {
        return chartGradient(Object.keys(transactionTypes).length + 1).map(
          (color) => ({
            bg: color,
            textColor: switchColor(color)
          })
        );
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

    methods: {
      showDetails(item) {
        const expandData = item.accountsData.flat();
        !item.expand.length
          ? item.expand = expandData.map((item, i) => i)
          : item.expand = [];
      },
      approveExpressLicensingRequest(request) {
        this.disableButtonsId = request._id;
        expressLicensingService
          .approveExpressLicensingRequest(
            {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            {
              requestId: request._id,
              approver: request.researchGroupExternalId
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
      },

      rejectExpressLicensingRequest(request) {
        this.disableButtonsId = request._id;
        expressLicensingService
          .rejectExpressLicensingRequest(
            {
              privKey: this.$currentUser.privKey,
              username: this.$currentUser.username
            },
            {
              requestId: request._id,
              rejector: request.researchGroupExternalId
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
