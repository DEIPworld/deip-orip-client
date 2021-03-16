<template>
  <div class="white-space-nowrap mt-4">
    <div v-if="isPendingStatus">
      {{ $t('transactionsList.expiresIn') }} {{ transaction.proposal.expiration_time | timeLeft }}
    </div>
    <div v-else>
      {{ transaction.proposal.created_at | dateFormat('DD MMM YYYY, HH:mm', true) }}
    </div>
  </div>
</template>

<script>
  import { transactionData } from '@/components/TransactionsList/transactionsListMixins';

  export default {
    name: 'TransactionDate',
    mixins: [transactionData],
    computed: {
      isPendingStatus() {
        return this.transaction.proposal.status === this.PROPOSAL_STATUS.PENDING;
      }
    }
  };
</script>
