<template>
  <v-skeleton-loader
    :loading="!$ready"
    type="table-thead, table-tbody, table-tfoot"
  >
    <v-tabs v-model="tab">
      <v-tab :key="1">
        <v-badge color="primary" inline :content="`${pendingTrcDataTable.length}`">
          Pending
        </v-badge>
      </v-tab>
      <v-tab :key="2">
        <v-badge color="primary" inline :content="`${completedTrcDataTable.length}`">
          History
        </v-badge>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-items v-model="tab">
      <v-tab-item :key="1">
        <transactions-table @updateData="updateData" have-actions :data-table="pendingTrcDataTable" />
      </v-tab-item>
      <v-tab-item :key="2">
        <transactions-table @updateData="updateData" :data-table="completedTrcDataTable" />
      </v-tab-item>
    </v-tabs-items>
  </v-skeleton-loader>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { transactionsListStore } from '@/components/TransactionsList/store';
  import { mapGetters } from 'vuex';
  import TransactionsTable from '@/components/TransactionsList/components/TransactionsTable';

  export default {
    name: 'TransactionsList',

    components: {
      TransactionsTable
    },

    mixins: [componentStoreFactoryOnce(transactionsListStore)],

    props: {
      account: {
        type: String,
        required: true,
        default: ''
      }
    },

    data() {
      return {
        tab: null
      };
    },
    computed: {
      ...mapGetters({
        pendingTrc: 'TransactionsList/pendingTrc',
        completedTrc: 'TransactionsList/completedTrc'
      }),
      completedTrcDataTable() {
        // this.completedTrc.map((p) => {
        //   const signers = [];
        //   let text = '';
        //   for (const i in p.parties) {
        //     if (!p.parties[i].isProposer) {
        //       signers.push(p.parties[i]);
        //     }
        //   }
        //   const count = signers.reduce((summ, s) => {

        //   }, 0)
        //   if (signers.length > 1) {
        //     text = `Signatures: ${signers.length}`;
        //   }
        //   if (signers.length > 1) {
        //     text = `Parties: ${signers.length}`;
        //   }
        //   if ()
        // });
        return this.completedTrc.map((p) => ({
          ...p,
          proposer: this.proposer(p.parties),
          expand: []
        }));
      //   const data = _.cloneDeep(this.approvedRequests);

      //   const chainHistoryDataTable = (item) => (item.chainHistory
      //     ? [
      //       {
      //         status: 'approved',
      //         historys: item.extendedDetails.approvers.map((approver) => {
      //           const id = approver.external_id || approver.account.name;

      //           return {
      //             ...item.chainHistory[id],
      //             account: approver
      //           };
      //         })
      //       },
      //       {
      //         status: 'rejected',
      //         historys: item.extendedDetails.rejectors.map((rejector) => {
      //           const id = rejector.external_id || rejector.account.name;

      //           return {
      //             ...item.chainHistory[id],
      //             account: rejector
      //           };
      //         })
      //       }
      //     ] : []);
      //   const accountData = (item) => (item.extendedDetails
      //     ? [
      //       {
      //         status: 'approved',
      //         accounts: item.extendedDetails.approvers
      //       },
      //       {
      //         status: 'rejected',
      //         accounts: item.extendedDetails.rejectors
      //       }
      //     ] : []);

      //   return data.map((item) => ({
      //     ...item,
      //     accountsData: accountData(item),
      //     chainHistoryDataTable: chainHistoryDataTable(item),
      //     expand: []
      //   }
      //   ));
      },
      pendingTrcDataTable() {
        return this.pendingTrc.map((p) => ({
          ...p,
          proposer: this.proposer(p.parties),
          expand: []
        }));
      //   const data = _.cloneDeep(this.pendingRequests);

      //   const chainHistoryDataTable = (item) => (item.chainHistory
      //     ? [
      //       {
      //         status: 'approved',
      //         historys: item.extendedDetails.approvers.map((approver) => {
      //           const id = approver.external_id || approver.account.name;

      //           return {
      //             ...item.chainHistory[id],
      //             account: approver
      //           };
      //         })
      //       },
      //       {
      //         status: 'pending',
      //         historys: [
      //           {
      //             ...item.chainHistory[item.extendedDetails.researchGroup.external_id],
      //             account: item.extendedDetails.researchGroup
      //           }
      //         ]
      //       }
      //     ] : []);

      //   const accountData = (item) => (item.extendedDetails
      //     ? [
      //       {
      //         status: 'approved',
      //         accounts: item.extendedDetails.approvers
      //       },
      //       {
      //         status: 'pending',
      //         accounts: [item.extendedDetails.researchGroup]
      //       }
      //     ] : []);

      //   return data.map((item) => ({
      //     ...item,
      //     accountsData: accountData(item),
      //     chainHistoryDataTable: chainHistoryDataTable(item),
      //     expand: []
      //   }
      //   ));
      }
    },
    created() {
      // Promise.all([
      this.updateData()
        .then(() => {
          this.$setReady();
        });
      //   this.$store.dispatch('TransactionsList/loadPendingRequests')
      // ])
    },
    methods: {
      updateData() {
        return this.$store.dispatch('TransactionsList/loadTransactions', this.account);
      },
      proposer(parties) {
        if (parties) {
          for (const i in parties) {
            if (parties[i].isProposer) {
              return parties[i];
            }
          }
        }
        return {};
      }
    }
  };
</script>
