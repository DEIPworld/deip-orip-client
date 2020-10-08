<template>
  <d-filter-sidebar
    ref="filter"
    v-model="filterModel"
    :reset-model="resetFilterModel"
    @apply="applyFilter"
    @reset="resetFilter"
  >
    <d-block widget>
      <v-text-field
        v-model="filterModel.searchTerm"
        label="Search text..."
        outlined
        hide-details="auto"
      />
    </d-block>

    <d-filter-term-components v-model="filterModel.researchAttributes" class="mb-6" />
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

      if (this.$ls.ttl(this.storageKey) === -1) {
        this.applyFilter();
      }

      if (q) {
        this.filterModel = {
          ...this.filterModel,
          ...JSON.parse(q)
        };

        this.applyFilter();

        this.$nextTick(() => {
          this.$refs.filter.process();
          this.$router.replace({ query: {} });
        });

      } else if (this.$ls.get(this.storageKey)) {
        this.filterModel = this.$ls.get(this.storageKey);
      }
    },

    methods: {

      applyFilter() {
        this.$ls.set(this.storageKey, this.filterModel, 1000 * 60 * 60 * 24);
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
