<template>
  <d-filter-sidebar
    ref="filter"
    v-model="filterModel"
    :reset-model="resetFilterModel"
    @apply="applyFilter"
    @reset="resetFilter"
  >
    <d-block widget="compact">
      <v-text-field
        v-model="filterModel.searchTerm"
        label="Search terms"
        outlined
        hide-details="auto"
      />
    </d-block>

    <d-filter-term-components v-model="filterModel.researchAttributes" />
  </d-filter-sidebar>
</template>

<script>
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';
  import DFilterTermComponents from '@/components/Deipify/DFilter/DFilterTerms/DFilterTermComponents';
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
      DFilterTermComponents,
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
        this.filterModel = {
          ...this.filterModel,
          ...JSON.parse(q)
        };
        this.applyFilter();
        this.$nextTick(() => {
          this.$refs.filter.process();
        })
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

        this.$nextTick(() => {
          this.$refs.filter.process();
        })
      }
    }

  };
</script>
