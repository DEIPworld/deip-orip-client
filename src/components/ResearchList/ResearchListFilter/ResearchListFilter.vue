<template>
  <d-filter-sidebar
    :filter-count="filterCount"
    @apply="applyFilter"
    @reset="resetFilter"
  >
    <template>
      <research-list-filter-disciplines v-model="filterModel.disciplines" />
      <research-list-filter-categories v-model="filterModel.categories" />
      <research-list-filter-components v-model="filterModel.researchComponents" />
      <research-list-filter-organizations v-model="filterModel.organizations" />
    </template>
  </d-filter-sidebar>
</template>

<script>
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';
  import ResearchListFilterDisciplines
    from '@/components/ResearchList/ResearchListFilter/ResearchListFilterDisciplines';
  import ResearchListFilterCategories from '@/components/ResearchList/ResearchListFilter/ResearchListFilterCategories';
  import ResearchListFilterComponents from '@/components/ResearchList/ResearchListFilter/ResearchListFilterComponents';
  import ResearchListFilterOrganizations
    from '@/components/ResearchList/ResearchListFilter/ResearchListFilterOrganizations';

  const defaultFilter = () => ({
    disciplines: [],
    organizations: [],
    researchComponents: [],
    categories: []
  });

  export default {
    name: 'ResearchListFilter',

    components: {
      ResearchListFilterOrganizations,
      ResearchListFilterComponents,
      ResearchListFilterCategories,
      ResearchListFilterDisciplines,
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
        filterCount: 0,
        filterModel: defaultFilter()
      };
    },

    created() {
      if (this.$ls.get(this.storageKey)) {
        this.filterModel = this.$ls.get(this.storageKey);
      }
      this.setCount();
    },

    methods: {
      setCount() {
        this.filterCount = Object.values(this.filterModel).filter((a) => a.length > 0).length;
      },

      applyFilter() {
        this.$ls.set(this.storageKey, this.filterModel);
        this.setCount();
      },

      resetFilter() {
        this.filterModel = { ...defaultFilter() };
        this.applyFilter();
      }
    }

  };
</script>
