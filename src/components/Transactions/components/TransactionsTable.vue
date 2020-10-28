<template>
  <div>
    <v-data-table
      :headers="tableHeader"
      :items="dataTable"
      :expanded.sync="expanded"
      show-expand
      item-key="_id"
      sort-by="updated_at"
      sort-desc
      :hide-default-footer="dataTable.length < 50"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="50"
    >
      <template #item.type="{ item }">
        <v-chip
          class="my-3"
          :color="chipColors[transactionTypes['LICENSE']].bg"
          :text-color="chipColors[transactionTypes['LICENSE']].textColor"
        >
          License
        </v-chip>
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
        <d-box-item
          :avatar="item.researchGroupExternalId | researchGroupLogoSrc(64, 64)"
          :size="24"
        >
          <v-clamp autoresize :max-lines="1">
            {{ item.extendedDetails.researchGroup.name }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.created_at="{ item }">
        {{ item.created_at | dateFormat('DD MMM YYYY, hh:mm', true) }}
      </template>
      <template #item.expirationDate="{ item }">
        {{ item.expirationDate | dateFormat('DD MMM YYYY, hh:mm', true) }}
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
        <v-chip class="my-3" :color="statusChipData.color[item.status]">
          {{ statusChipData.text[item.status] }}
        </v-chip>
      </template>
      <template #expanded-item="{ item, headers }">
        <td :colspan="headers.length" class="pa-0">
          <v-simple-table>
            <thead style="visibility: collapse">
              <tr>
                <th
                  v-for="(item, i) in tableHeader"
                  :key="`${i}-colHeader`"
                  :width="item.width"
                >
                  {{ item.text }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  :colspan="tableHeader.length - 3"
                  class="text-caption text--secondary"
                >
                  <div>
                    <span class="font-weight-medium"> Technology: </span>
                    <router-link
                      :to="{
                        name: 'research.details',
                        params: {
                          researchExternalId:
                            item.extendedDetails.research.external_id,
                        },
                      }"
                      class="text-decoration-underline text--secondary"
                    >
                      {{ item.extendedDetails.research.title }}
                    </router-link>
                  </div>
                  <div>
                    <span class="font-weight-medium"> License type: </span>
                    {{ item.licencePlan.name }}
                  </div>
                  <div>
                    <span class="font-weight-medium"> License issue fee: </span>
                    {{ $$toAssetUnits(item.licencePlan.fee) }}
                  </div>
                </td>
                <td colspan="2" class="mb-n3 px-0 pt-3">
                  <template v-for="(accountData, i) in item.accountsData">
                    <d-box-item
                      v-for="(account, j) in accountData.accounts"
                      :key="`${i}-${j}-accounts`"
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
                      :size="24"
                      class="mb-3 ml-auto"
                      style="max-width: 270px"
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
                        class="text--secondary text-caption"
                      >
                        <v-clamp autoresize :max-lines="1">
                          {{
                            account.profile
                              ? $options.filters.fullname(account)
                              : account.name
                          }}
                        </v-clamp>
                      </router-link>
                      <template #actionText>
                        <div style="width: 93px">
                          <v-chip
                            small
                            :color="statusChipData.color[accountData.status]"
                          >
                            {{ statusChipData.text[accountData.status] }}
                          </v-chip>
                        </div>
                      </template>
                    </d-box-item>
                  </template>
                </td>
                <td>
                  <v-icon
                    :class="{'expand-icon--active': item.expand}"
                    @click="item.expand ? item.expand-- : item.expand++"
                  >
                    mdi-chevron-up
                  </v-icon>
                </td>
              </tr>
              <tr :hidden="!!item.expand">
                <td :colspan="tableHeader.length">
                  <v-expansion-panels accordion flat :value="item.expand">
                    <v-expansion-panel class="pa-0">
                      <v-expansion-panel-content class="pa-0">
                        <div class="mx-n6 mt-3 mb-n1">
                          <div class="text-caption mb-3">
                            Signee
                          </div>
                          <template
                            v-for="(historyStatus, i) in item.chainHistoryDataTable"
                          >
                            <div
                              v-for="(history, j) in historyStatus.historys"
                              :key="`${i}-${j}-history`"
                              class="mb-3 text--secondary d-flex align-center text-caption"
                            >
                              <v-chip
                                :color="statusChipData.color[historyStatus.status]"
                                class="mr-1 flex-grow-0 flex-shrink-0"
                                small
                              >
                                {{ statusChipData.text[historyStatus.status] }}
                              </v-chip>
                              <div>
                                {{
                                  history.account.name ||
                                    $options.filters.fullname(history.account) ||
                                    '—'
                                }}
                                (<span class="font-weight-medium">
                                  Transaction ID:
                                </span>
                                <span class="mr-2">{{ history.id || '—' }}</span>
                                <span class="font-weight-medium"> Block: </span>
                                <span class="mr-2">{{
                                  history.block_num || '—'
                                }}</span>
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
                                )
                              </div>
                            </div>
                          </template>
                        </div>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </td>
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
    LICENSE: 1
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
        disableButtonsId: '',
        txStatusChips: {
          approved: this.$t('transactionsPage.signed'),
          pending: this.$t('transactionsPage.pending'),
          rejected: this.$t('transactionsPage.declined')
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
            text: 'Sender',
            value: 'requester',
            sortable: false
          },
          {
            text: 'Target',
            value: 'researchGroupExternalId',
            sortable: false
          },
          {
            text: 'Date of receipt',
            value: 'created_at',
            align: 'end',
            sortable: false
          },
          {
            text: 'Expiration date',
            value: 'expirationDate',
            align: 'center',
            sortable: false
          },
          {
            text: 'Status',
            value: 'status',
            width: '109px'
          },
          {
            text: '',
            value: 'data-table-expand',
            align: 'start elevetion-0',
            width: '56px'
          }
        ];
        if (this.haveActions) {
          header.splice(5, 0, {
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
          text: this.txStatusChips
        };
      },
      isCurrentUserSigned() {
        return this.pendingRequests.approvers.includes(
          (item) => item === this.$currentUser.username
        );
      }
    },

    created() {
      // console.log(this.dataTable);
    },
    methods: {
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
            this.$notifier.showSuccess('Approved successfully !');
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
            this.$notifier.showSuccess('Declined successfully !');
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
