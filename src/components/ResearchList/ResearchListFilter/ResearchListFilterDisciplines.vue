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
              v-model="localModel"
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
  import { ResearchListAbstractFilter } from '@/components/ResearchList/ResearchListFilter/ResearchListAbstractFilter';

  export default {
    name: 'ResearchListFilterDisciplines',
    mixins: [ResearchListAbstractFilter],

    data() {
      return {
        disciplines: [...disciplinesService.getTopLevelNodes()]
      };
    }
  };
</script>

<style scoped>

</style>
