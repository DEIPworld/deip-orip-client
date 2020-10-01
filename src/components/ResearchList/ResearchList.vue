<template>
  <d-block ref="projectsView">
    <template #title>
      {{ $t('defaultNaming.projects') }}
      <v-badge v-if="$ready" offset-y="-8" offset-x="4" :content="itemsList.length || '0'" />
    </template>

    <template #titleAddon>
      <d-toggle-view :storage-key="storageViewModelKey" class="align-self-end" />
      <research-list-filter v-if="withFilter" :storage-key="storageFilterModelKey" />
      <slot name="addSome" />
    </template>

    <template #subtitle>
      <slot name="subtitle" />
    </template>

    <v-skeleton-loader
      class=""
      :loading="!$ready"
      min-height="232px"
      type="cards-list"
      :types="{
        'cards-list': 'image@4'
      }"
    >
      <v-data-iterator
        :items="itemsList"
        :no-data-text="$t('defaultNaming.noProjects')"
        :hide-default-footer="iteratorProps.hideDefaultFooter"
        :footer-props="iteratorProps.footerProps"
        :items-per-page="iteratorProps.itemsPerPage"
        @update:page="onPaginationUpdated"
      >
        <template #default="{ items }">
          <component :is="listComponent" :items="items" />
        </template>
      </v-data-iterator>
    </v-skeleton-loader>
  </d-block>
</template>

<script>
  import { VIEW_TYPES } from '@/variables';

  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import DFilterSidebar from '@/components/Deipify/DFilter/DFilterSidebar';

  import ResearchListGrid from '@/components/ResearchList/ResearchListGrid';
  import ResearchListTable from '@/components/ResearchList/ResearchListTable';

  import ResearchListFilter from '@/components/ResearchList/ResearchListFilter';
  import { objectNotEmpty } from '@/utils/helpers';

  export default {
    name: 'ResearchList',

    components: {
      ResearchListFilter,

      ResearchListTable,
      ResearchListGrid,

      DToggleView,
      DBlock,
      DFilterSidebar
    },

    props: {
      data: {
        type: Array,
        default: () => ([])
      },
      namespace: {
        type: String,
        default: undefined
      },
      withFilter: {
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
      listComponent() {
        return this.viewModel === VIEW_TYPES.GRID ? 'research-list-grid' : 'research-list-table';
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
      const q = this.$route.query.rFilter;
      this.storageViewModelKey = `${this.namespace}__pl-type`;
      this.$ls.on(this.storageViewModelKey, this.changeView, true);

      if (this.withFilter) {
        this.storageFilterModelKey = `${this.namespace}__filter`;

        this.$ls.on(this.storageFilterModelKey, this.applyFilter, !q);
      } else {
        this.$setReady();
      }

      this.itemsList = [...this.data];
    },

    beforeDestroy() {
      this.$ls.off(this.storageViewModelKey, this.changeView);

      if (this.withFilter) {
        this.$ls.off(this.storageFilterModelKey, this.applyFilter);
      }
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
        this.$setReady(false);
        const filter = this.$ls.get(this.storageFilterModelKey);

        this.$store.dispatch('feed/loadResearchFeed', {
          filter: {
            ...filter,
            ...(
              objectNotEmpty(filter.researchAttributes) ? {
                researchAttributes: Object.keys(filter.researchAttributes).filter((a) => filter.researchAttributes[a].length).map((a) => ({ researchAttributeId: a, values: Array.isArray(filter.researchAttributes[a]) ? filter.researchAttributes[a] : [filter.researchAttributes[a]] }))
              } : {}
            )
          }
        })
          .then((items) => {
            this.itemsList = items;
            this.$setReady();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  };
</script>

<style lang="scss">
  .v-skeleton-loader{
    &__cards-list {
      display: grid;
      grid-gap: 1.5rem;
      grid-template-columns: repeat(4, 1fr);
    }
  }
</style>
