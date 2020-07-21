<template>
  <d-block ref="projectsView">
    <template #title>
      Projects
      <v-badge offset-y="-8" offset-x="4" :content="itemsList.length || '0'" />
    </template>

    <template #titleRight>
      <d-toggle-view :storage-key="storageViewModelKey" />

      <d-filter
        v-if="!noFilter"
        v-model="filterModel"
        :storage-key="storagefilterModelKey"
        @applyFilter="applyFilter"
        @resetFilter="resetFilter"
      >
        <template>
          <research-list-filter-disciplines v-model="filterModel.disciplines" />
          <research-list-filter-categories v-model="filterModel.categories" />
          <research-list-filter-components v-model="filterModel.researchComponents" />
          <research-list-filter-organizations v-model="filterModel.organizations" />
        </template>
      </d-filter>
    </template>
    <v-data-iterator
      :items="itemsList"
      no-data-text="No Projects found for specified criteria"
      :hide-default-footer="iteratorProps.hideDefaultFooter"
      :footer-props="iteratorProps.footerProps"
      :items-per-page="iteratorProps.itemsPerPage"
      @update:page="onPaginationUpdated"
    >
      <template #default="{items}">
        <component :is="hostComponent">
          <component
            :is="itemComponent"
            v-for="item in items"
            :key="'list-item-' + item.external_id"
            :research="item"
          />
        </component>
      </template>
    </v-data-iterator>

  </d-block>
</template>

<script>
  import { VIEW_TYPES } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import DFilter from '@/components/Deipify/DFilter/DFilter';

  import ResearchListCard from '@/components/ResearchList/ResearchListItem/ResearchListCard';
  import ResearchListRow from '@/components/ResearchList/ResearchListItem/ResearchListRow';
  import ResearchListGrid from '@/components/ResearchList/ResearchListWrapper/ResearchListGrid';
  import ResearchListTable from '@/components/ResearchList/ResearchListWrapper/ResearchListTable';

  import ResearchListFilterDisciplines
    from '@/components/ResearchList/ResearchListFilter/ResearchListFilterDisciplines';
  import ResearchListFilterCategories from '@/components/ResearchList/ResearchListFilter/ResearchListFilterCategories';
  import ResearchListFilterComponents from '@/components/ResearchList/ResearchListFilter/ResearchListFilterComponents';
  import ResearchListFilterOrganizations
    from '@/components/ResearchList/ResearchListFilter/ResearchListFilterOrganizations';

  const defaultFilterModel = () => ({
    disciplines: [],
    organizations: [],
    researchComponents: [],
    categories: []
  });

  export default {
    name: 'ResearchList',

    components: {
      ResearchListFilterOrganizations,
      ResearchListFilterComponents,
      ResearchListFilterCategories,
      ResearchListFilterDisciplines,

      ResearchListTable,
      ResearchListGrid,
      ResearchListRow,
      ResearchListCard,

      DToggleView,
      DBlock,
      DFilter
    },

    props: {
      items: {
        type: Array,
        default: () => ([])
      },
      namespace: {
        type: String,
        default: undefined
      },
      noFilter: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        storageViewModelKey: undefined,
        storagefilterModelKey: undefined,

        viewModel: undefined,
        filterModel: defaultFilterModel(),

        itemsList: []

      };
    },

    computed: {
      isGrid() {
        return this.viewModel === VIEW_TYPES.GRID;
      },

      hostComponent() {
        return this.isGrid ? 'research-list-grid' : 'research-list-table';
      },
      itemComponent() {
        return this.isGrid ? 'research-list-card' : 'research-list-row';
      },

      iteratorProps() {
        return {
          itemsPerPage: 12,
          hideDefaultFooter: this.items.length < 12,
          footerProps: {
            'items-per-page-options': [12, 24, 48, -1]
          }
        };
      }
    },

    created() {
      this.storageViewModelKey = `${this.namespace}__pl-type`;
      this.storagefilterModelKey = `${this.namespace}__filter`;

      this.$ls.on(this.storageViewModelKey, this.changeView, true);
      this.itemsList = [...this.items];
    },
    destroyed() {
      this.$ls.off(this.storageViewModelKey, this.changeView);
    },

    methods: {
      onPaginationUpdated() {
        setTimeout(() => window.scrollTo({
          top: this.$refs.projectsView.offsetTop - 10,
          behavior: 'smooth'
        }), 0);
      },

      changeView(val) {
        this.viewModel = val;
      },

      applyFilter() {
        const filter = {
          ...(this.filterModel.disciplines.length ? {
            disciplines: [{
              external_id: this.filterModel.disciplines
            }]
          } : {}),

          ...(this.filterModel.organizations.length ? {
            research_group: {
              external_id: this.filterModel.organizations
            }
          } : {}),

          ...(this.filterModel.researchComponents.length ? {
            researchRef: {
              tenantCriteriasReadingList: (criteria) => this.filterModel.researchComponents.some((i) => criteria.map((c) => `${c.component}:${c.value.index}`).includes(i))
            }
          } : {}),

          ...(this.filterModel.categories.length ? {
            researchRef: {
              tenantCategory: {
                external_id: this.filterModel.categories
              }
            }
          } : {})

        };

        this.itemsList = [...this.$options.filters.where(this.items, filter)];
      },

      resetFilter() {
        this.filterModel = { ...defaultFilterModel() };
        this.applyFilter();
      }
    }
  };
</script>
