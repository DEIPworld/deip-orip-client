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
      <readiness-level-item
        :dot-num="item.num"
        v-bind="attrs"
        v-on="on"
      >
        {{ item.text }}
      </readiness-level-item>
    </template>

    <template #selection="{item}">
      <readiness-level-item
        :dot-num="item.num"
        class="px-0"
        clean
      >
        {{ item.text }}
      </readiness-level-item>
    </template>
  </v-select>
</template>

<script>
  import ReadinessLevelItem from '@/components/ReadinessLevel/ReadinessLevelItem';

  export default {
    name: 'ReadinessLevelSelector',
    components: { ReadinessLevelItem },
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
