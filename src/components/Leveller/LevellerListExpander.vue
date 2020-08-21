<template>
  <leveller-list dense class="pt-0 rl">
    <template v-for="(item, index) of rlData">
      <leveller-item
        v-if="index < 3 || isExpanded"
        :key="'rl-'+index"
        :dot-num="index + 1"
        dense
      >
        <div class="text-subtitle-1">
          {{ item.title }}
        </div>
      </leveller-item>
    </template>

    <leveller-list-button
      :icon="isExpanded ? 'expand_less' : 'expand_more'"
      @click="isExpanded = !isExpanded"
    />
  </leveller-list>
</template>

<script>
  import LevellerItem from '@/components/Leveller/LevellerItem';
  import LevellerList from '@/components/Leveller/LevellerList';
  import LevellerListButton from '@/components/Leveller/LevellerListButton';

  export default {
    name: 'LevellerListExpander',
    components: { LevellerListButton, LevellerList, LevellerItem },
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
