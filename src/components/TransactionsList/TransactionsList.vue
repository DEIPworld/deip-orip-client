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
        <transactions-table
          have-actions
          :data-table="pendingTrcDataTable"
          @update-data="updateData"
        />
      </v-tab-item>
      <v-tab-item :key="2">
        <transactions-table :data-table="completedTrcDataTable" @update-data="updateData" />
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
        const getSignersData = (trc) => {
          let signers = [];
          let text = '';
          let signersCount = 0;
          Object.keys(trc.parties).forEach((i) => {
            if (
              !trc.parties[i].isProposer && trc.parties[i].account.external_id && signers.length < 5
            ) {
              signers.push({ signer: trc.parties[i].account });
            }
            if (!trc.parties[i].isProposer) {
              trc.parties[i].signers.forEach((s) => {
                if (!s.signer.external_id) {
                  signersCount++;
                }
              });
            }
          });

          if (signers.length > 1 && signersCount > 1) {
            text = `Parties: ${Object.keys(trc.parties).length - 1}, Signatures: ${signersCount}`;
          } else if (signers.length > 1) {
            text = `Parties: ${Object.keys(trc.parties).length - 1}`;
          } else if (signersCount > 1) {
            text = `Signatures: ${signersCount}`;
            signers = [
              { signer: signers[0] }, signers[0].signers.filter((s) => !s.signer.external_id)
            ];
          } else if (signers[0]) {
            text = signers[0].signer.name || this.$options.filters.fullname(
              signers[0].signer
            );
            const signerKey = Object.keys(trc.parties).find((i) => !trc.parties[i].isProposer);
            signers = trc.parties[signerKey].account.external_id
              ? [
                { signer: trc.parties[signerKey].account },
                ...trc.parties[signerKey].signers.filter((s) => !s.signer.external_id)
              ]
              : [{ signer: trc.parties[signerKey].account }];
          }
          return { text, signers };
        };
        return this.completedTrc.map((p) => ({
          ...p,
          proposer: this.proposer(p.parties),
          signers: getSignersData(p),
          expand: []
        }));
      },
      pendingTrcDataTable() {
        const getSignersData = (trc) => {
          const signers = [];
          let text = '';
          Object.keys(trc.parties).forEach((i) => {
            if (
              !trc.parties[i].isProposer && signers.length < 5
            ) {
              signers.push({ signer: trc.parties[i].account });
            }
          });

          if (signers.length > 1) {
            text = `Parties: ${Object.keys(trc.parties).length - 1}`;
          } else if (signers[0]) {
            text = signers[0].signer.name || this.$options.filters.fullname(
              signers[0].signer
            );
          }
          return { text, signers };
        };
        return this.pendingTrc.map((p) => ({
          ...p,
          proposer: this.proposer(p.parties),
          signers: getSignersData(p),
          expand: []
        }));
      }
    },
    created() {
      this.updateData()
        .then(() => {
          this.$setReady();
        });
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
