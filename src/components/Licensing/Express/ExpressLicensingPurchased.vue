<template>
  <d-dot-list>
    <d-dot-list-item
      v-for="(item, index) of licenses"
      :key="`ls-${index}`"
      :label="item.licensePlan.name"
      :value="$$toAssetUnits(item.licensePlan.fee)"
    >
      <template #secondRow>
        <div class="text-caption">
          {{ item.created_at | dateFormat('MMMM DD YYYY', true) }}
        </div>
      </template>
    </d-dot-list-item>
  </d-dot-list>
</template>

<script>
  import { assetsChore } from '@/mixins/chores';
  import DDotList from '@/components/Deipify/DDotList/DDotList';
  import DDotListItem from '@/components/Deipify/DDotList/DDotListItem';

  export default {
    name: 'ExpressLicensingPurchased',
    components: { DDotListItem, DDotList },
    mixins: [
      assetsChore
    ],
    props: {
      licenses: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
