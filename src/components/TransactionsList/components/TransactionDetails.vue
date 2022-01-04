<template>
  <div>
    <v-clamp
      autoresize
      :max-lines="2"
      class="mt-4"
    >
      {{ transactionTitle }}
    </v-clamp>
    <v-row
      v-if="!isAccountsBlockVisible(transaction)"
      no-gutters
      justify="space-between"
      class="mt-4 mb-6"
    >
      <v-col class="d-flex align-center">
        <v-avatar :size="32">
          <v-img :src="transaction.header.proposerParty.account | accountAvatarSrc(64, 64)" />
        </v-avatar>
        <v-clamp
          class="ml-3"
          autoresize
          :max-lines="1"
        >
          {{ transaction.header.proposerParty.account | accountFullname }}
        </v-clamp>
      </v-col>

      <v-col class="d-flex ml-4 align-center">
        <template v-for="(party, i) in transaction.header.otherParties">
          <v-avatar
            v-if="i < maxSignersCountToDisplay"
            :key="`${i}-party`"
            :size="32"
            class="ml-n2"
          >
            <v-img :src="party.account | accountAvatarSrc(64, 64)" />
          </v-avatar>
        </template>
        <v-clamp
          class="ml-3"
          autoresize
          :max-lines="1"
        >
          {{ transaction.header.partiesSummary }}
        </v-clamp>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { transactionTitle } from '@/components/TransactionsList/transactionsListMixins';

  export default {
    name: 'TransactionDetails',
    mixins: [transactionTitle],
    props: {
      expanded: {
        type: Array,
        required: true,
        default: () => []
      }
    },
    data() {
      return {
        maxSignersCountToDisplay: 4
      };
    },
    methods: {
      isAccountsBlockVisible(item) {
        return this.expanded.some(
          ({ proposal }) => proposal._id === item.proposal._id
        );
      }
    }
  };
</script>
