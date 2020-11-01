<template>
  <d-stack :gap="8">
    <slot>
      <d-dot-list-item
        v-for="(item, index) of items"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </slot>
  </d-stack>
</template>

<script>
  import DDotListItem from '@/components/Deipify/DDotList/DDotListItem';
  import DStack from '@/components/Deipify/DStack/DStack';
  export default {
    name: 'DDotList',
    components: { DStack, DDotListItem },
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
