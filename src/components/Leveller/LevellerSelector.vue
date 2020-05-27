<template>
  <v-select
    :items="items"
    :label="label"
    hide-details
    :value="value"
    v-bind="_xProps"
    @change="onInput"
  >

    <template v-if="typeof value !== 'undefined' && currentStep" #prepend-inner>
      <leveller-num
        style="margin-top: -17px; margin-right: -4px; margin-left: -12px;"
        :height="56"
        :num="currentStep.num" />
    </template>

    <template #item="{ item, on, attrs }">
      <leveller-item
        :dot-num="item.num"
        v-bind="attrs"
        :ctrl-height="48"
        v-on="on"
      >
        {{ item.text }}
      </leveller-item>
    </template>
  </v-select>

</template>

<script>
  import LevellerItem from '@/components/Leveller/LevellerItem';
  import LevellerNum from '@/components/Leveller/LevellerNum';
  import { AbstractField } from '@/components/Deipify/AbstractField';

  export default {
    name: 'LevellerSelector',
    components: {
      LevellerNum,
      LevellerItem
    },
    mixins: [AbstractField],
    props: {
      items: {
        type: Array,
        default: () => ([])
      }
    },
    computed: {
      currentStep() {
        return this.items.find(x => x.value === this.value);
      }
    }
  };
</script>
