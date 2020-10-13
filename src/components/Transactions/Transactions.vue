<template>
  <d-layout-section v-if="$ready">
    <d-layout-section-main>
      <div class="text-h4 mb-8">
        Transactions
      </div>
      <v-tabs v-model="tab">
        <v-tab :key="1">
          <v-badge color="primary" inline :content="`${pendingRequests.length}`">
            Incomplete
          </v-badge>
        </v-tab>
        <v-tab :key="2">
          <v-badge color="primary" inline :content="`${approvedRequests.length}`">
            Completed
          </v-badge>
        </v-tab>
      </v-tabs>
      <v-divider />
      <v-tabs-items v-model="tab" class="mt-4">
        <v-tab-item :key="1">
          <pending-requests-table />
        </v-tab-item>
        <v-tab-item :key="2">
          <approved-requests-table />
        </v-tab-item>
      </v-tabs-items>
    </d-layout-section-main>
  </d-layout-section>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { transactionsStore } from '@/components/Transactions/store';
  import { mapGetters } from 'vuex';
  import { ExpressLicensingService } from '@deip/express-licensing-service';
  import DLayoutSection from '@/components/Deipify/DLayout/DLayoutSection';
  import DLayoutSectionMain from '@/components/Deipify/DLayout/DLayoutSectionMain';
  import PendingRequestsTable from '@/components/Transactions/components/PendingRequestsTable';
  import ApprovedRequestsTable from '@/components/Transactions/components/ApprovedRequestsTable';

  const expressLicensingService = ExpressLicensingService.getInstance();

  export default {
    name: 'Transactions',

    components: {
      DLayoutSection,
      DLayoutSectionMain,
      PendingRequestsTable,
      ApprovedRequestsTable
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
      })
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
