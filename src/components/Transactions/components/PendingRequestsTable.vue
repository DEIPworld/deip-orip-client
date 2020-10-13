<template>
  <div>
    <v-data-table
      :headers="pendingRequestsHeader"
      :items="pendingRequests"
      :expanded.sync="expanded"
      show-expand
      item-key="_id"
      disable-sort
      :hide-default-footer="pendingRequests.length < 50"
      :footer-props="{itemsPerPageOptions: [5, 10, 20, 50, -1]}"
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
          :avatar="item.extendedDetails.requester.profile | avatarSrc(64, 64, false)"
          :size="24"
        >
          <v-clamp
            autoresize
            :max-lines="1"
          >
            {{ item.extendedDetails.requester | fullname }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.researchGroupExternalId="{ item }">
        <d-box-item
          :avatar="item.researchGroupExternalId | researchGroupLogoSrc(64, 64)"
          :size="24"
        >
          <v-clamp
            autoresize
            :max-lines="1"
          >
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
        <v-chip
          class="my-3"
          :color="statusChipData.color[item.status]"
        >
          {{ statusChipData.text[item.status] }}
        </v-chip>
      </template>
      <template #expanded-item="{ item }">
        <td colspan="5" class="text-caption text--secondary">
          <div class="font-weight-medium">
            Technology:
          </div>
          <div class="text-decoration-underline">
            {{ item.licencePlan.name }}
          </div>
          <div>
            <span class="font-weight-medium">
              License issue fee:
            </span> {{ toAssetString(item.licencePlan.fee) }}
          </div>
        </td>
        <td colspan="1" class="py-3">
          <d-box-item
            :avatar="item.extendedDetails.requester.profile | avatarSrc(64, 64, false)"
            :size="24"
            class="mb-3"
          >
            <v-clamp
              autoresize
              :max-lines="1"
            >
              {{ item.extendedDetails.requester | fullname }}
            </v-clamp>
            <template #actionText>
              <v-chip
                :color="statusChipData.color[
                  item.approvers.includes(item.extendedDetails.requester.account.name)
                    ? 'approved'
                    : 'pending'
                ]"
              >
                {{ statusChipData.text[
                  item.approvers.includes(item.extendedDetails.requester.account.name)
                    ? 'approved'
                    : 'pending'
                ] }}
              </v-chip>
            </template>
          </d-box-item>
          <d-box-item
            :avatar="item.researchGroupExternalId | researchGroupLogoSrc(64, 64)"
            :size="24"
          >
            <v-clamp
              autoresize
              :max-lines="1"
            >
              {{ item.extendedDetails.researchGroup.name }}
            </v-clamp>
            <template #actionText>
              <v-chip
                :color="statusChipData.color[
                  item.approvers.includes(item.extendedDetails.researchGroup.external_id)
                    ? 'approved'
                    : 'pending'
                ]"
              >
                {{ statusChipData.text[
                  item.approvers.includes(item.extendedDetails.researchGroup.external_id)
                    ? 'approved'
                    : 'pending'
                ] }}
              </v-chip>
            </template>
          </d-box-item>
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

  const txStatusChips = {
    approved: 'signed',
    pending: 'pending',
    rejected: 'declined'
  };

  const chipColors = {
    approved: 'success',
    pending: 'warning',
    rejected: 'error'
  };

  export default {
    name: 'PendingRequestsTable',

    mixins: [assetsChore],

    components: {
      DBoxItem
    },

    data() {
      return {
        expanded: [],
        transactionTypes,
        txStatusChips,
        disableButtonsId: '',
        pendingRequestsHeader: [
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
            text: 'Actions',
            value: 'actions'
          },
          {
            text: 'Status',
            value: 'status'
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
        approvedRequests: 'Transactions/approvedRequests',
        pendingRequests: 'Transactions/pendingRequests'
      }),
      chipColors() {
        return chartGradient(Object.keys(transactionTypes).length + 1).map((color) => ({
          bg: color,
          textColor: switchColor(color)
        }));
      },
      statusChipData() {
        return {
          color: chipColors,
          text: txStatusChips
        };
      },
      isCurrentUserSigned() {
        return this.pendingRequests.approvers.includes(
          (item) => item === this.$currentUser.username
        );
      }
    },
    methods: {
      approveExpressLicensingRequest(request) {
        this.disableButtonsId = request._id;
        expressLicensingService.approveExpressLicensingRequest({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          requestId: request._id,
          approver: request.researchGroupExternalId
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
            this.$notifier.showError('Oops! Something went wrong. Please try again later');
          })
          .finally(() => {
            this.disableButtonsId = '';
          });
      },

      rejectExpressLicensingRequest(request) {
        this.disableButtonsId = request._id;
        expressLicensingService.rejectExpressLicensingRequest({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          requestId: request._id,
          rejector: request.researchGroupExternalId
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
            this.$notifier.showError('Oops! Something went wrong. Please try again later');
          })
          .finally(() => {
            this.disableButtonsId = '';
          });
      }
    }
  };
</script>
