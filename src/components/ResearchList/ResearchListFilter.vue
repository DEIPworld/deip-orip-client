<template>
  <d-filter-sidebar
    v-model="filterModel"
    :reset-model="resetFilterModel"
    @apply="applyFilter"
    @reset="resetFilter"
  >
    <template>
      <d-filter-term-disciplines v-model="filterModel.disciplines" />
      <d-filter-term-categories v-model="filterModel.categories" />
      <d-filter-term-components v-model="filterModel.researchAttributes" />
      <d-filter-term-organizations v-model="filterModel.organizations" />
    </template>
  </d-filter-sidebar>
</template>

<script>
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';
  import DFilterTermDisciplines
    from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermDisciplines';
  import DFilterTermCategories from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermCategories';
  import DFilterTermComponents from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermComponents';
  import DFilterTermOrganizations
    from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermOrganizations';

  const defaultFilter = () => ({
    disciplines: [],
    organizations: [],
    researchAttributes: [],
    categories: []
  });

  export default {
    name: 'ResearchListFilter',

    components: {
      DFilterTermOrganizations,
      DFilterTermComponents,
      DFilterTermCategories,
      DFilterTermDisciplines,
      DFilterSidebar
    },

    props: {
      storageKey: {
        type: String,
        default: undefined
      }
    },

    data() {
      return {
        resetFilterModel: defaultFilter(),
        filterModel: defaultFilter()
      };
    },

    created() {
      if (this.$ls.get(this.storageKey)) {
        this.filterModel = this.$ls.get(this.storageKey);
      }
    },

    methods: {

      applyFilter() {
        this.$ls.set(this.storageKey, this.filterModel);
      },

      resetFilter() {
        this.filterModel = { ...defaultFilter() };

        this.applyFilter();
      }
    }

  };
</script>
