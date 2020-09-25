<template>
  <d-filter-sidebar
    v-model="filterModel"
    :reset-model="resetFilterModel"
    @apply="applyFilter"
    @reset="resetFilter"
  >
    <template>
      <d-block widget="compact">
        <v-text-field
          v-model="filterModel.searchTerm"
          label="Search terms"
          outlined
          hide-details="auto"
        />
      </d-block>

<!--      <d-filter-term-disciplines v-model="filterModel.disciplines" />-->
      <d-filter-term-components v-model="filterModel.researchAttributes" />
<!--      <d-filter-term-organizations v-model="filterModel.organizations" />-->
    </template>
  </d-filter-sidebar>
</template>

<script>
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';
  import DFilterTermDisciplines
    from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermDisciplines';
  import DFilterTermComponents from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermComponents';
  import DFilterTermOrganizations
    from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermOrganizations';
  import DBlock from '@/components/Deipify/DBlock/DBlock';

  const defaultFilter = () => ({
    searchTerm: '',
    disciplines: [],
    organizations: [],
    researchAttributes: {}
  });

  export default {
    name: 'ResearchListFilter',

    components: {
      DBlock,
      DFilterTermOrganizations,
      DFilterTermComponents,
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
      const q = this.$route.query.rFilter;
      if (q) {
        this.filterModel = JSON.parse(q);
        this.applyFilter();
      } else if (this.$ls.get(this.storageKey)) {
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
