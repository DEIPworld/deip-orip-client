<template>
  <d-stack :gap="16">
    <users-list-stack v-if="users.length" :users="users" />
    <d-dot-list :items="list" />
  </d-stack>
</template>

<script>
  import DDotList from '@/components/Deipify/DDotList/DDotList';
  import { assetsChore } from '@/mixins/chores';
  import UsersListStack from '@/components/Users/UsersListStack';
  import DStack from '@/components/Deipify/DStack/DStack';

  export default {
    name: 'ExpressLicensingLicensee',
    components: { DStack, UsersListStack, DDotList },
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
              assetId: 1,
              amount: this.totalFee
            })
          },
          {
            label: 'Average licences fee',
            value: this.$$toAssetUnits({
              assetId: 1,
              amount: this.totalFee / (this.licenses.length || 1)
            })
          },
        ];
      }
    }
  };
</script>
