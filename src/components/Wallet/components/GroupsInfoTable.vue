<template>
  <v-skeleton-loader
    type="table-thead, table-tbody"
    :loading="!$ready"
  >
    <v-data-table
      v-custom="'hover-row'"
      :headers="groupsListTableHeader"
      :items="allGroups"
      :hide-default-footer="allGroups.length < 50"
      :footer-props="{ itemsPerPageOptions: [5, 10, 20, 50, -1] }"
      :items-per-page="50"
      disable-sort
      @click:row="(item) => $router.push({
        name: 'groupWallet',
        params: {
          account: item.external_id
        }
      })"
    >
      <template #item.name="{ item }">
        <d-box-item
          :avatar="item.external_id | researchGroupLogoSrc(48, 48)"
          :size="48"
          class="my-3"
        >
          <v-clamp
            autoresize
            :max-lines="1"
            class="text-body-1"
          >
            {{ item.name }}
          </v-clamp>
        </d-box-item>
      </template>
      <template #item.tokenizedActives="{ item }">
        <span class="text-body-1">
          {{ item.researchList ? countActives(item.researchList) : 0 }}
        </span>
      </template>
      <template #item.account.balances="{ item }">
        <span class="text-body-1">
          {{ mockTokenPrice(item.id, DEIP_100_PERCENT)| currency }}
        </span>
      </template>
      <template #item.revenueHistory="{ item }">
        <span class="text-body-1">
          {{ item.revenueHistory ? `$ ${totalRevenue(item.revenueHistory)}` : '$ 0' }}
        </span>
      </template>
      <template #item.action>
        <v-icon>
          keyboard_arrow_right
        </v-icon>
      </template>
    </v-data-table>
  </v-skeleton-loader>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DBoxItem from '@/components/Deipify/DBoxItem/DBoxItem';

  export default {
    name: 'GroupsInfoTable',

    components: {
      DBoxItem
    },

    data() {
      return {
        groupsListTableHeader: [
          {
            value: 'name'
          },
          {
            text: 'Assets',
            value: 'tokenizedActives'
          },
          {
            text: 'Tokens value ',
            value: 'account.balances'
          },
          {
            text: 'Total Revenue',
            value: 'revenueHistory'
          },
          {
            value: 'action'
          }
        ]
      };
    },

    computed: {
      ...mapGetters({
        allGroups: 'Wallet/allGroups'
      })
    },
    created() {
      this.$store.dispatch('Wallet/loadAllGroups', this.$currentUserName)
        .then(() => { this.$setReady(); });
    },
    methods: {
      countActives(arr) {
        return arr.reduce(
          (val, p) => (val + p.security_tokens ? p.security_tokens.length : 0), 0
        );
      },
      totalRevenue(arr) {
        return arr.reduce((val, { revenue }) => (val + this.fromAssetsToFloat(revenue)), 0);
      }
    }
  };
</script>
