<template>
  <d-stack :gap="8">
    <slot>
      <d-dot-list-item
        v-for="(item, index) of items"
        :key="index"
        :label="item.label"
        :value="item.value"
        :align="rowAlign"
      >
        <template v-if="$hasSlot('label')" #label>
          <slot name="label" :item="item" />
        </template>

        <template v-if="$hasSlot('value')" #value>
          <slot name="value" :item="item" />
        </template>

        <template v-if="$hasSlot('secondRow')" #secondRow>
          <slot name="secondRow" :item="item" />
        </template>
      </d-dot-list-item>
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
      },
      rowAlign: {
        type: String,
        default: null
      }
    }
  };
</script>
