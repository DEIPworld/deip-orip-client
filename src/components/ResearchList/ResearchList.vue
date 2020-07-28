<template>
  <d-block ref="projectsView">
    <template #title>
      Projects
      <v-badge offset-y="-8" offset-x="4" :content="itemsList.length || '0'" />
    </template>

    <template #titleRight>
      <d-toggle-view :storage-key="storageViewModelKey" />
      <research-list-filter v-if="!noFilter" :storage-key="storageFilterModelKey" />
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
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';

  import ResearchListCard from '@/components/ResearchList/ResearchListItem/ResearchListCard';
  import ResearchListRow from '@/components/ResearchList/ResearchListItem/ResearchListRow';
  import ResearchListGrid from '@/components/ResearchList/ResearchListWrapper/ResearchListGrid';
  import ResearchListTable from '@/components/ResearchList/ResearchListWrapper/ResearchListTable';

  import ResearchListFilter from '@/components/ResearchList/ResearchListFilter/ResearchListFilter';

  export default {
    name: 'ResearchList',

    components: {
      ResearchListFilter,

      ResearchListTable,
      ResearchListGrid,
      ResearchListRow,
      ResearchListCard,

      DToggleView,
      DBlock,
      DFilterSidebar
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
        storageFilterModelKey: undefined,

        viewModel: undefined,

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
          hideDefaultFooter: this.itemsList.length < 12,
          footerProps: {
            'items-per-page-options': [12, 24, 48, -1]
          }
        };
      }
    },

    created() {
      this.storageViewModelKey = `${this.namespace}__pl-type`;
      this.storageFilterModelKey = `${this.namespace}__filter`;

      this.itemsList = [...this.items];

      this.$ls.on(this.storageViewModelKey, this.changeView, true);
      this.$ls.on(this.storageFilterModelKey, this.applyFilter, true);
    },

    destroyed() {
      this.$ls.off(this.storageViewModelKey, this.changeView);
      this.$ls.off(this.storageFilterModelKey, this.applyFilter);
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
        const filter = this.$ls.get(this.storageFilterModelKey);

        const filtered = {
          ...(filter.disciplines.length ? {
            disciplines: [{
              external_id: filter.disciplines
            }]
          } : {}),

          ...(filter.organizations.length ? {
            research_group: {
              external_id: filter.organizations
            }
          } : {}),

          ...(filter.researchComponents.length ? {
            researchRef: {
              tenantCriteriasReadingList: (criteria) => filter.researchComponents.some((i) => criteria.map((c) => `${c.component}:${c.value.index}`).includes(i))
            }
          } : {}),

          ...(filter.categories.length ? {
            researchRef: {
              tenantCategory: {
                external_id: filter.categories
              }
            }
          } : {})

        };

        this.itemsList = [...this.$options.filters.where(this.items, filtered)];
      }
    }
  };
</script>
