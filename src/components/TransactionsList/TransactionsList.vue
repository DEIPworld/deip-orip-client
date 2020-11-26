<template>
  <v-skeleton-loader
    :loading="!$ready"
    type="table-thead, table-tbody, table-tfoot">
    <v-tabs v-model="tab">
      <v-tab :key="1">
        <v-badge color="primary" inline :content="`${proposalsDataTable(PROPOSAL_TAB.PENDING).length}`">
          Pending
        </v-badge>
      </v-tab>
      <v-tab :key="2">
        <v-badge color="primary" inline :content="`${proposalsDataTable(PROPOSAL_TAB.HISTORY).length}`">
          History
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
  import TransactionsTable from '@/components/TransactionsList/components/TransactionsTable';

  const MAX_SIGNERS_TO_DISPLAY_COUNT = 5;

  const PROPOSAL_TAB = {
    PENDING: 1,
    HISTORY: 2
  }

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
        const proposals = tab == PROPOSAL_TAB.PENDING ? this.pendingProposals : this.completedProposals;

        return proposals.map((proposal) => {
          const { parties } = proposal;

          const proposerParty = this.getProposerParty(proposal);
          const otherParties = this.getOtherParties(proposal);

          const partiesCount = Object.keys(parties).length;
          const signaturesCount = [proposerParty, ...otherParties].reduce((count, party) => count + party.signers.filter(({ hasSignature }) => { return hasSignature; }).length, 0);

          const partiesSummary = otherParties.length == 1 
            ?  this.$options.filters.accountFullname(otherParties[0])
            : `${partiesCount} ${partiesCount > 1 ? 'Parties' : 'Party'}, ${signaturesCount} ${signaturesCount > 1 ? 'Signatures' : 'Signature'}`;

          const header = { proposerParty, otherParties, partiesSummary };

          return {
            ...proposal,
            header,
            expand: []
          }
        });
      },

      getProposerParty(proposal) {
        const { proposer: proposalCreator, parties } = proposal;
        
        const proposer = Object
          .keys(parties)
          .reduce((acc, key) => { return [...acc, parties[key]] }, [])
          .find((party) => { return party.isProposer; }) || { account: proposalCreator, isProposer: true, signers: [] };

        const proposerParty = {
          account: proposer.account, 
          signers: proposer.signers.map(({ signer, txInfo }) => { return { ...signer, hasSignature: !!txInfo, isResearchGroup: signer.account.is_research_group }}), 
          isResearchGroup: proposer.account.account.is_research_group 
        };

        return proposerParty;
      },

      getOtherParties(proposal) {
        const { parties } = proposal;

        const otherParties = Object
          .keys(parties)
          .reduce((acc, key) => { return [...acc, parties[key]]}, [])
          .filter((party) => !party.isProposer)
          .map((party) => {
            return {
              account: party.account,
              signers: party.signers.map(({ signer, txInfo }) => { return { ...signer, hasSignature: !!txInfo, isResearchGroup: signer.account.is_research_group }}), 
              isResearchGroup: party.account.account.is_research_group 
            }
          });

        return otherParties;
      }
    }
  };
</script>
