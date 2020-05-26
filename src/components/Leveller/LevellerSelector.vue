<template>
  <v-select
    :items="items"
    :label="label"
    filled
    hide-details
    :value="value"
    @change="handleChange"
  >

    <template #prepend-inner>
      <leveller-num v-if="currentStep"
        style="margin-top: -17px; margin-right: -4px; margin-left: -12px;"
        :height="56"
        :num="currentStep.num" />
    </template>

    <template #item="{ item, on, attrs }">
      <leveller-item
        :dot-num="item.num"
        v-bind="attrs"
        v-on="on"
        :ctrl-height="48"
      >
        {{ item.text }}
      </leveller-item>
    </template>
  </v-select>
</template>

<script>
  import LevellerItem from '@/components/Leveller/LevellerItem';
  import LevellerNum from '@/components/Leveller/LevellerNum';

  export default {
    name: 'LevellerSelector',
    components: {
      LevellerNum,
      LevellerItem
    },
    props: {
      items: {
        type: Array,
        default: null
      },
      value: {
        type: [String, Number],
        default: null
      },
      label: {
        type: String,
        default: ''
      }
    },
    computed: {
      currentStep() {
        return this.items.find(x => x.value === this.value);
      }
    },
    methods: {
      handleChange(e) {
        this.$emit('input', e);
      }
    }
  };
</script>
