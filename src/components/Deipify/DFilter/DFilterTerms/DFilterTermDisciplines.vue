<template>
  <div v-if="disciplines.length">
    <v-select
      v-if="singleChoice"
      v-model="internalValue"
      :items="[{ name: $t('defaultNaming.all'), externalId: '' }, ...disciplines]"
      outlined
      hide-details
      :label="$t('defaultNaming.filters.domainField')"
      item-text="name"
      item-value="externalId"
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
                :label="discipline.name"
                :value="discipline.externalId"
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

    computed: {
      disciplines() {
        return [...this.$store.getters['Disciplines/topLevelList']().sort(
          (a, b) => a.name.localeCompare(b.name)
        )];
      }
    }
  };
</script>

<style scoped>

</style>
