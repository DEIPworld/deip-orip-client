<template>
  <d-stack :gap="16">
    <users-list
      v-if="users.length"
      :users="users"
      view-type="stack"
    />
    <d-dot-list :items="list" />
  </d-stack>
</template>

<script>
  import DDotList from '@/components/Deipify/DDotList/DDotList';
  import { assetsChore } from '@/mixins/chores';
  import DStack from '@/components/Deipify/DStack/DStack';
  import UsersList from '@/features/Users/components/List/UsersList';

  export default {
    name: 'ExpressLicensingLicensee',
    components: { UsersList, DStack, DDotList },
    mixins: [
      assetsChore
    ],
    props: {
      licenses: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      users() {
        return this.licenses.map((lic) => lic.owner);
      },
      totalFee() {
        return this.licenses
          .map((lic) => lic.licencePlan.fee.amount)
          .reduce((a, b) => a + parseInt(b), 0);
      },
      list() {
        return [
          {
            label: 'Total licences fee',
            value: this.$$toAssetUnits({
              assetId: 'USD',
              amount: this.totalFee
            })
          },
          {
            label: 'Average licences fee',
            value: this.$$toAssetUnits({
              assetId: 'USD',
              amount: this.totalFee / (this.licenses.length || 1)
            })
          },
        ];
      }
    }
  };
</script>
