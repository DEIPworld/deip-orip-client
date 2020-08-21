<template>
  <div>
    <div v-for="(item, index) of research" :key="index" :class="{'mb-6': index+1 < research.length}">
      <div class="text-subtitle-1 font-weight-medium">
        {{ item.name }}
      </div>

      <v-list v-if="item.name === 'Project readines level'" class="ma-0 pa-0">
        <v-list-item v-for="(level, index) of item.data" :key="index" class="px-0">
          <leveller-num
            class="align-self-center"
            style="height: auto"
            :height="24"
            :num="level.value.index"
          />
          <div class="ml-2">
            <div class="text-caption">
              {{ level.name }}
            </div>
            {{ level.value.title }}
          </div>
        </v-list-item>
      </v-list>

      <div v-else class="text-body-2" v-html="item.data" />
    </div>
  </div>
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
