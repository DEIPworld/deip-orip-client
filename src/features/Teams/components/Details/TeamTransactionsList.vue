<template>
  <d-block
    v-if="$hasModule(DEIP_MODULE.APP_PAGE_MULTISIG_TRANSACTIONS)"
    id="proposals"
    class="mb-12"
    :title="$t('teamDetails.proposalsTable.title')"
  >
    <transition v-if="highlightProposalsSection" name="fade">
      <div v-if="proposalsSectionTransitionTrigger" class="pt-2 pb-6">
        <transactions-list :key="'team-proposals'" :account="team._id" />
      </div>
    </transition>
    <div v-else>
      <div class="pt-2 pb-6">
        <transactions-list :key="'team-proposals'" :account="team._id" />
      </div>
    </div>
  </d-block>
</template>

<script>
  import { mapGetters } from 'vuex';
  import TransactionsList from '@/components/TransactionsList/TransactionsList';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  export default {
    name: 'TeamTransactionsList',
    components: {
      TransactionsList,
      DBlock
    },
    data() {
      return {
        highlightProposalsSection: undefined,
        proposalsSectionTransitionTrigger: false
      };
    },
    computed: {
      ...mapGetters({
        team: 'Team/teamDetails'
      })
    },
    mounted() {
      if (this.highlightProposalsSection) {
        this.proposalsSectionTransitionTrigger = true;
      }
    },

    created() {
      this.highlightProposalsSection = this.$route.hash === '#proposals';
    }
  };
</script>
