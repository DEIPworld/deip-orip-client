<template>
  <v-list>
    <v-list-item v-for="(item, index) of research" :key="index">
      <v-list-item-content>
        <div class="overline">{{ item.name }}</div>
        <v-list v-if="item.name === 'Project readines level'" class="ma-0 pa-0">
          <v-list-item class="px-0" v-for="(level, index) of item.data" :key="index">
            <leveller-num class="align-self-center" style="height: auto" :height="24" :num="level.value.index"></leveller-num>
            <div class="ml-2">
              <div class="caption">{{ level.name }}</div>
              {{ level.value.title }}
            </div>
          </v-list-item>
        </v-list>
        <div v-else class="body-2" v-html="item.data">
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
  import LevellerNum from '@/components/Leveller/LevellerNum';

  export default {
    name: 'ResearchRequestReadView',
    components: { LevellerNum },
    props: {
      research: {
        type: Array,
        default: () => ([])
      }
    }
  };
</script>
