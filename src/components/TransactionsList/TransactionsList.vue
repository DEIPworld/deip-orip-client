<template>
  <v-skeleton-loader
    :loading="!$ready"
    type="table-thead, table-tbody, table-tfoot"
  >
    <v-tabs v-model="tab">
      <v-tab :key="1">
        <v-badge
          color="primary"
          inline
          :content="`${proposalsDataTable(PROPOSAL_TAB.PENDING).length}`"
        >
          {{ $t('transactions.table.pending') }}
        </v-badge>
      </v-tab>
      <v-tab :key="2">
        <v-badge
          color="primary"
          inline
          :content="`${proposalsDataTable(PROPOSAL_TAB.HISTORY).length}`"
        >
          {{ $t('transactions.table.completed') }}
        </v-badge>
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-tabs-items v-model="tab">
      <v-tab-item :key="PROPOSAL_TAB.PENDING">
        <transactions-table
          have-actions
          :data-table="proposalsDataTable(PROPOSAL_TAB.PENDING)"
          @update-data="updateData"
        />
      </v-tab-item>
      <v-tab-item :key="PROPOSAL_TAB.HISTORY">
        <transactions-table
          :data-table="proposalsDataTable(PROPOSAL_TAB.HISTORY)"
          @update-data="updateData"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-skeleton-loader>
</template>

<script>
  import { componentStoreFactoryOnce } from '@/mixins/registerStore';
  import { transactionsListStore } from '@/components/TransactionsList/store';
  import { mapGetters } from 'vuex';
  import TransactionsTable from '@/components/TransactionsList/TransactionsTable';

  const PROPOSAL_TAB = {
    PENDING: 1,
    HISTORY: 2
  };

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
        tab: null,
        PROPOSAL_TAB
      };
    },
    computed: {
      ...mapGetters({
        pendingProposals: 'TransactionsList/pendingProposals',
        completedProposals: 'TransactionsList/completedProposals'
      })
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

      proposalsDataTable(tab) {
        const proposals = tab === PROPOSAL_TAB.PENDING
          ? this.pendingProposals : this.completedProposals;

        return proposals.map((proposal) => {
          const { parties, proposal: { required_approvals: requiredApprovals } } = proposal;

          const proposerParty = this.getProposerParty(proposal);
          const otherParties = this.getOtherParties(proposal);

          const partiesCount = Object.keys(parties)
            .reduce((count, key) => {
              const party = parties[key];
              const { account: { account: { name } } } = party;
              if (requiredApprovals.some((ra) => ra === name)) {
                return count + 1;
              }
              return count;
            }, 0);

          const signaturesCount = [proposerParty, ...otherParties]
            .reduce((count, party) => count + party.signers.filter(
              ({ hasSignature }) => hasSignature
            ).length, 0);

          const partiesSummary = otherParties.length === 1
            ? this.$options.filters.accountFullname(otherParties[0].account)
            : `${partiesCount} ${partiesCount > 1
              ? this.$t('transactionsList.parties')
              : this.$t('transactionsList.party')},
              ${signaturesCount} ${signaturesCount > 1
                ? this.$t('transactionsList.signatures')
            : this.$t('transactionsList.signature')}`;

          const header = { proposerParty, otherParties, partiesSummary };

          return {
            ...proposal,
            header,
            expand: []
          };
        });
      },

      getProposerParty(proposal) {
        const { proposer: proposalCreator, parties } = proposal;

        const proposer = Object
          .keys(parties)
          .reduce((acc, key) => [...acc, parties[key]], [])
          .find((party) => party.isProposer)
          || { account: proposalCreator, isProposer: true, signers: [] };

        const proposerParty = {
          account: proposer.account,
          signers: proposer.signers.map(({ signer, txInfo }) => (
            {
              ...signer, 
              hasSignature: !!txInfo, 
              isTeam: signer.account 
                ? signer.account.isTeam 
                : false
            }
          )),
          isTeam: proposer.account && proposer.account.account 
            ? proposer.account.account.isTeam
            : false

        };

        return proposerParty;
      },

      getOtherParties(proposal) {
        const { parties } = proposal;

        const otherParties = Object
          .keys(parties)
          .reduce((acc, key) => [...acc, parties[key]], [])
          .filter((party) => !party.isHidden)
          .filter((party) => !party.isProposer)
          .map((party) => ({
            account: party.account,
            signers: party.signers.map(({ signer, txInfo }) => (
              {
                ...signer,
                hasSignature: !!txInfo,
                isTeam: signer.account 
                  ? signer.account.isTeam 
                  : false
              }
            )),
            isTeam: party.account && party.account.account 
              ? party.account.account.isTeam
              : false

          }));

        return otherParties;
      }
    }
  };
</script>
