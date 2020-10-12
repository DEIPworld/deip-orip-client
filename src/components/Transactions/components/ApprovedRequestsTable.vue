<template>
  <v-data-table
    :headers="approvedRequestsHeader"
    :items="approvedRequests"
    :expanded.sync="expanded"
    show-expand
    item-key="_id"
    :hide-default-footer="approvedRequests.length < 50"
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

  export default {
    name: 'ApprovedRequestsTable',

    data() {
      return {
        expanded: [],
        approvedRequestsHeader: [
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
        approvedRequests: 'Transactions/approvedRequests'
      })
    }
  }
</script>
