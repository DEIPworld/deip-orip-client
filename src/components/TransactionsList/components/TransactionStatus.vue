<template>
  <div class="d-flex mt-4">
    <div v-if="transaction.proposal.status == PROPOSAL_STATUS.FAILED">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span>
            <v-icon
              class="mr-1"
              size="14"
              :color="statusChipData.color[transaction.proposal.status]"
              v-on="on"
            >
              {{ statusChipData.icon[transaction.proposal.status] }}
            </v-icon>
            {{ statusChipData.text[transaction.proposal.status] }}
          </span>
        </template>
        <span>{{ transaction.proposal.fail_reason }}</span>
      </v-tooltip>
    </div>
    <div v-else>
      <v-icon :color="statusChipData.color[transaction.proposal.status]" size="14" class="mr-1">
        {{ statusChipData.icon[transaction.proposal.status] }}
      </v-icon>
      {{ statusChipData.text[transaction.proposal.status] }}
    </div>
  </div>
</template>

<script>
  import { transactionChips } from '@/components/TransactionsList/transactionsListMixins';

  export default {
    name: 'TransactionStatus',
    mixins: [transactionChips]
  };
</script>
