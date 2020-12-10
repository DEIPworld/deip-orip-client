<template>
  <d-layout-section v-if="$ready">
    <d-layout-section-main>
      <div class="text-h4 mb-8">
        {{$t('transactions.title')}}
      </div>
      <transactions-list :key="'group-proposals'" :account="$currentUserName" />
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { transactionsStore } from '@/components/Transactions/store';
  import { mapGetters } from 'vuex';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import TransactionsList from '@/components/TransactionsList/TransactionsList';

  export default {
    name: 'Transactions',

    components: {
      DLayoutSection,
      DLayoutSectionMain,
      TransactionsList
    },

    mixins: [componentStoreFactoryOnce(transactionsStore)],

    data() {
      return {
        tab: null
      };
    },
    computed: {
      ...mapGetters({
        approvedRequests: 'Transactions/approvedRequests',
        pendingRequests: 'Transactions/pendingRequests'
      }),
      completedRequestsDataTable() {
        const data = _.cloneDeep(this.approvedRequests);

        const chainHistoryDataTable = (item) => (item.chainHistory
          ? [
            {
              status: 'approved',
              historys: item.extendedDetails.approvers.map((approver) => {
                const id = approver.external_id || approver.account.name;

                return {
                  ...item.chainHistory[id],
                  account: approver
                };
              })
            },
            {
              status: 'rejected',
              historys: item.extendedDetails.rejectors.map((rejector) => {
                const id = rejector.external_id || rejector.account.name;

                return {
                  ...item.chainHistory[id],
                  account: rejector
                };
              })
            }
          ] : []);
        const accountData = (item) => (item.extendedDetails
          ? [
            {
              status: 'approved',
              accounts: item.extendedDetails.approvers
            },
            {
              status: 'rejected',
              accounts: item.extendedDetails.rejectors
            }
          ] : []);

        return data.map((item) => ({
          ...item,
          accountsData: accountData(item),
          chainHistoryDataTable: chainHistoryDataTable(item),
          expand: []
        }
        ));
      },
      pendingRequestsDataTable() {
        const data = _.cloneDeep(this.pendingRequests);

        const chainHistoryDataTable = (item) => (item.chainHistory
          ? [
            {
              status: 'approved',
              historys: item.extendedDetails.approvers.map((approver) => {
                const id = approver.external_id || approver.account.name;

                return {
                  ...item.chainHistory[id],
                  account: approver
                };
              })
            },
            {
              status: 'pending',
              historys: [
                {
                  ...item.chainHistory[item.extendedDetails.researchGroup.external_id],
                  account: item.extendedDetails.researchGroup
                }
              ]
            }
          ] : []);

        const accountData = (item) => (item.extendedDetails
          ? [
            {
              status: 'approved',
              accounts: item.extendedDetails.approvers
            },
            {
              status: 'pending',
              accounts: [item.extendedDetails.researchGroup]
            }
          ] : []);

        return data.map((item) => ({
          ...item,
          accountsData: accountData(item),
          chainHistoryDataTable: chainHistoryDataTable(item),
          expand: []
        }
        ));
      }
    },
    created() {
      Promise.all([
        this.$store.dispatch('Transactions/loadApprovedRequests'),
        this.$store.dispatch('Transactions/loadPendingRequests')
      ])
        .then(() => {
          this.$setReady();
        });
    }
  };
</script>
