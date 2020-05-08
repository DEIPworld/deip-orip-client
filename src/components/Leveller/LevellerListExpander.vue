<template>
  <readiness-level-list dense class="pt-0 rl">

    <template v-for="(item, index) of rlData">
      <readiness-level-item
        v-if="index < 3 || isExpanded"
        :key="'rl-'+index"
        :dot-num="index + 1"
        dense
      >
        <div class="subtitle-1">
          {{ item.shortTitle }}
        </div>
      </readiness-level-item>
    </template>

    <readiness-level-list-button
      :icon="isExpanded ? 'expand_less' : 'expand_more'"
      @click="isExpanded = !isExpanded"
    />

  </readiness-level-list>
</template>

<script>
  import ReadinessLevelItem from '@/components/ReadinessLevel/ReadinessLevelItem';
  import ReadinessLevelList from '@/components/ReadinessLevel/ReadinessLevelList';
  import ReadinessLevelListButton from '@/components/ReadinessLevel/ReadinessLevelListButton';

  export default {
    name: 'ReadinessLevelListExpander',
    components: { ReadinessLevelListButton, ReadinessLevelList, ReadinessLevelItem },
    props: {
      data: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        isExpanded: false
      };
    },
    computed: {
      rlData() { return this.data; }
    }
  };
</script>


