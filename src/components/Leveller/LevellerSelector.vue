<template>
  <v-select
    v-model="internalValue"
    :items="items"
    :label="label"
    v-bind="_xProps"
  >
    <template #selection="{ item }">
      <div class="d-flex align-center">
        <v-avatar :size="20" color="primary" class="white--text text-body-2 font-weight-medium mr-2">
          {{ item.num }}
        </v-avatar>
        <span class="text-body-2">{{ item.text }}</span>
      </div>
    </template>

    <template #item="{ item, on, attrs }">
      <leveller-item
        class="px-0"
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
  import { AbstractField } from '@/components/Deipify/DInput/AbstractField';

  export default {
    name: 'LevellerSelector',
    components: {
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
        return this.items.find((x) => x.value === this.value);
      }
    }
  };
</script>
