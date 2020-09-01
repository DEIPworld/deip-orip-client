<template>
  <div v-if="disciplines.length">
    <v-select
      v-if="singleChoice"
      v-model="internalValue"
      :items="[{ label: $t('defaultNaming.all'), id: '' }, ...disciplines]"
      outlined
      hide-details
      :label="$t('defaultNaming.filters.domainField')"
      item-text="label"
      item-value="id"
    />

    <d-block
      v-if="!singleChoice"
      :title="$t('defaultNaming.filters.domainField')"
      widget="compact"
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
  </div>
</template>

<script>
  import * as disciplinesService from '@/components/common/disciplines/DisciplineTreeService';

  import Proxyable from 'vuetify/lib/mixins/proxyable';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DListExpand from '@/components/Deipify/DListExpand/DListExpand';

  export default {
    name: 'DFilterTermDisciplines',
    components: {
      DBlock,
      DListExpand
    },

    mixins: [Proxyable],

    props: {
      singleChoice: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        disciplines: [...disciplinesService.getTopLevelNodes().sort((a, b) => a.label.localeCompare(b.label))]
      };
    }
  };
</script>

<style scoped>

</style>
