<template>
  <v-select
    :items="items"
    label="Technology Readiness Level"
    outlined
    hide-details
    :value="value"
    @change="handleChange"
  >
    <template #item="{ item, on, attrs }">
      <leveller-item
        :dot-num="item.num"
        v-bind="attrs"
        v-on="on"
      >
        {{ item.text }}
      </leveller-item>
    </template>

    <template #selection="{item}">
      <leveller-item
        :dot-num="item.num"
        class="px-0"
        clean
      >
        {{ item.text }}
      </leveller-item>
    </template>
  </v-select>
</template>

<script>
  import LevellerItem from '@/components/Leveller/LevellerItem';

  export default {
    name: 'LevellerSelector',
    components: { LevellerItem },
    props: {
      items: {
        type: Array,
        default: null
      },
      value: {
        type: String || Number,
        default: null
      }
    },
    methods: {
      handleChange(e) {
        this.$emit('input', e);
      }
    }
  };
</script>
