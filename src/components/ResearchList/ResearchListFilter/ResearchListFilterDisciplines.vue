<template>
  <d-block
    v-if="disciplines.length"
    title="Disciplines"
    sm
  >
    <d-list-expand :active="disciplines.length > 4">
      <template #default="{expanded}">
        <div class="mt-n2">
          <template v-for="(discipline, i) in disciplines">
            <v-checkbox
              v-if="expanded || i < 4"
              :key="'discipline-filter-' + i"
              v-model="internalValue"
              :label="discipline.label"
              :value="discipline.id"
              hide-details
              class="mt-2 mb-0"
            />
          </template>
        </div>
      </template>
    </d-list-expand>
  </d-block>
</template>

<script>
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';

  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'ResearchListFilterDisciplines',
    components: {
      DBlock,
      DListExpand
    },
    mixins: [Proxyable],

    data() {
      return {
        disciplines: [...disciplinesService.getTopLevelNodes().sort((a, b) => a.label.localeCompare(b.label))]
      };
    }
  };
</script>

<style scoped>

</style>
