<template>
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
      License
    </template>
    <template #item.created_at="{ item }">
      {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
    </template>
    <template #item.expirationDate="{ item }">
      {{ item.expirationDate | dateFormat('MMMM DD YYYY', true) }}
    </template>
    <template #item.actions="{ item }">
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
    <template #expanded-item="{ item }">
      <td colspan="5">
        <div>
          Technology:
        </div>
        <div>
          {{ item.licencePlan.name }}
        </div>
        <div>
          License issue fee: {{ item.licencePlan.fee.amount }}
        </div>
      </td>
      <td colspan="2">
        <div v-for="(approver, i) in item.approvers" :key="`${i}-approver`">
          {{ approver }}
        </div>
      </td>
    </template>
  </v-data-table>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { ExpressLicensingService } from '@deip/express-licensing-service';

  const expressLicensingService = ExpressLicensingService.getInstance();

  export default {
    name: 'PendingRequestsTable',

    data() {
      return {
        disableButtonsId: '',
        expanded: [],
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
            text: 'Target (or Recipient)',
            value: '',
            sortable: false
          },
          {
            text: 'Date of receipt',
            value: 'created_at',
            align: 'center',
            sortable: false
          },
          {
            text: 'Expiration date',
            value: 'expirationDate',
            align: 'end',
            sortable: false
          },
          {
            text: 'Action',
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
      })
    },
    methods: {
      approveExpressLicensingRequest(request) {
        this.disableButtonsId = request._id;
        console.log({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          requestId: request._id,
          approver: request.researchGroupExternalId
        })
        expressLicensingService.approveExpressLicensingRequest({
          privKey: this.$currentUser.privKey,
          username: this.$currentUser.username
        }, {
          requestId: request._id,
          approver: request.researchGroupExternalId
        })
          .then((res) => {
            console.log(res);
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
          .then((res) => {
            console.log(res);
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
  }
</script>
