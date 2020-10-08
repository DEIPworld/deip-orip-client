<template>
  <d-block ref="ProjectsList">
    <template #title>
      <v-badge
        :content="projects.length || '0'"
      >
        {{ $t('defaultNaming.projects') }}
      </v-badge>
    </template>

    <template #subtitle>
      <slot name="subtitle" />
    </template>

    <template #titleAddon>
      <d-toggle-view
        v-if="multiView"
        :storage-key="storageViewTypeKey"
        class="align-self-end"
      />

      <projects-list-filter
        v-if="withFilter"
        :storage-key="storageFilterKey"
      />

      <slot name="addSome" />
    </template>

    <component
      :is="viewTypeComponent"
      :projects="projects"
      :loading="!$ready"
      :row-layout-key="rowLayoutKey"
      :card-layout-key="cardLayoutKey"
    >

      <template #itemCardActions="{ project }">
        <slot name="itemCardActions" :project="project" />
      </template>

      <template #itemRowActions="{ project }">
        <slot name="itemRowActions" :project="project" />
      </template>

    </component>

  </d-block>
</template>

<script>
  import { componentStoreFactory } from '@/mixins/registerStore';
  import { projectsListStore } from '@/components/Projects/List/store';
  import { VIEW_TYPES } from '@/variables';
  import DBlock from '@/components/Deipify/DBlock/DBlock';
  import DToggleView from '@/components/Deipify/DToggleView/DToggleView';
  import ProjectsListGrid from '@/components/Projects/List/Grid/ProjectsListGrid';
  import ProjectsListTable from '@/components/Projects/List/Table/ProjectsListTable';
  import { mapState } from 'vuex';
  import ProjectsListFilter from '@/components/Projects/List/Filter/ProjectsListFilter';
  import { compactResearchAttributes, isArray } from '@/utils/helpers';

  export default {
    name: 'ProjectsList',
    components: {
      ProjectsListFilter,
      ProjectsListTable,
      ProjectsListGrid,
      DToggleView,
      DBlock
    },
    mixins: [
      componentStoreFactory(projectsListStore)
    ],

    props: {
      withFilter: {
        type: Boolean,
        default: false
      },

      viewTypes: {
        type: [Array],
        default: () => ([VIEW_TYPES.GRID, VIEW_TYPES.TABLE])
      },

      rowLayoutKey: {
        type: String,
        default: 'projectListRow'
      },
      cardLayoutKey: {
        type: String,
        default: 'projectListCard'
      },

      type: {
        type: String,
        default: 'projects'
      },
      userName: {
        type: String,
        default: null
      },
      teamId: {
        type: String,
        default: null
      },
      status: {
        type: String,
        default: 'approved'
      }
    },

    data() {
      return {
        viewTypeComponents: {
          [VIEW_TYPES.TABLE]: 'ProjectsListTable',
          [VIEW_TYPES.GRID]: 'ProjectsListGrid'
        },

        currentViewType: null
      };
    },

    computed: {

      ...mapState({
        projects(state, getters) { return getters[`${this.storeNS}/projectsList`]; }
      }),

      viewTypeComponent() {
        return this.viewTypeComponents[this.currentViewType];
      },

      multiView() { return this.viewTypes.length > 1; },

      storageViewTypeKey() { return `${this.storeNS}_view-type`; },
      storageFilterKey() { return `${this.storeNS}_filter`; },
    },

    created() {
      this.isMultiView(() => {
        this.$ls.on(this.storageViewTypeKey, this.changeViewType, true);
      });

      this.changeViewType(this.viewTypes[0]);

      if (this.withFilter) {
        const hasQuery = !!this.$route.query.rFilter;

        this.$nextTick(() => {
          this.$ls.on(this.storageFilterKey, this.getData, !hasQuery);
        });
      } else {
        this.getData();
      }
    },

    beforeDestroy() {
      this.isMultiView(() => {
        this.$ls.on(this.storageViewTypeKey, this.changeViewType, true);
      });
    },

    methods: {
      getData() {
        this.$setReady(false);

        const payload = {
          type: this.type,
          userName: this.userName,
          // userName: 'alice',
          teamId: this.teamId,
          status: this.status,
          ...(this.withFilter ? { filter: this.filterPayload() } : {})
        };

        this.$store.dispatch(`${this.storeNS}/getProjectsData`, payload)
          .then(() => {
            this.$setReady();
          })
          .catch((err) => {
            console.error(err);
          });
      },

      filterPayload() {
        const storeFilter = this.$ls.get(this.storageFilterKey);

        const attributes = compactResearchAttributes(
          storeFilter.researchAttributes,
          'researchAttributeId',
          'values'
        )
          .filter((attr) => (isArray(attr.values) ? !!(attr.values.length) : !!(attr.values)))
          .map((attr) => ({
            ...attr,
            ...{ values: isArray(attr.values) ? attr.values : [attr.values] }
          }));

        return {
          ...storeFilter,
          ...(storeFilter.researchAttributes ? {
            researchAttributes: attributes
          } : {})
        };
      },

      onItemClick() {},

      changeViewType(viewType) {
        this.currentViewType = viewType;
      },

      isMultiView(cb) {
        if (this.multiView) {
          cb();
        }
      }
    }
  };
</script>
