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
        <transaction-icon v-if="item.type" :transaction-type="item.type" />
      </template>
      <template #item.details="{ item }">
        <transaction-details :transaction="item" :expanded="expanded" />
      </template>
      <template #item.proposal.expiration_time="{ item }">
        <transaction-date :transaction="item" />
      </template>
      <template #item.actions="{ item }">
        <transaction-actions :transaction="item" @update-data="$emit('update-data')" />
      </template>
      <template #item.proposal.status="{ item }">
        <transaction-status :transaction="item" />
      </template>
      <template #expanded-item="{ item, headers }">
        <td />
        <td>
          <transaction-expand-details :transaction="item" />
        </td>
        <td :colspan="headers.length - 2" />
      </template>
    </v-data-table>
    <v-divider />
  </div>
</template>

<script>
  import TransactionIcon from '@/components/TransactionsList/components/TransactionIcon';
  import TransactionDetails from '@/components/TransactionsList/components/TransactionDetails';
  import TransactionDate from '@/components/TransactionsList/components/TransactionDate';
  import TransactionActions from '@/components/TransactionsList/components/TransactionActions';
  import TransactionStatus from '@/components/TransactionsList/components/TransactionStatus';
  import TransactionExpandDetails from '@/components/TransactionsList/components/TransactionExpandDetails';

  export default {
    name: 'TransactionsTable',

    components: {
      TransactionIcon,
      TransactionDetails,
      TransactionDate,
      TransactionActions,
      TransactionStatus,
      TransactionExpandDetails
    },

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
        expanded: []
      };
    },
    computed: {
      tableHeader() {
        const header = [
          {
            text: this.$t('transactionsList.table.type'),
            value: 'type',
            align: 'left vertical-top',
            sortable: false
          },
          {
            text: this.$t('transactionsList.table.target'),
            value: 'details',
            sortable: false,
            align: 'start vertical-top',
            width: '45%'
          },
          {
            text: this.$t('transactionsList.table.status'),
            value: 'proposal.status',
            align: 'center vertical-top'
          },
          {
            text: this.$t('transactionsList.table.expirationDate'),
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
            text: this.$t('transactionsList.table.actions'),
            value: 'actions',
            align: 'center vertical-top'
          });
        }
        return header;
      }
    }
  };
</script>
